from django.shortcuts import render
from .models import Sensores,Historico,Ambiente
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import SensoresSerializer,AmbienteSerializer,HistoricoSerializer ,LoginSerializer
from .permissions import IsAdmin
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
import pandas as pd
from django.http import HttpResponse
from datetime import datetime
from rest_framework.response import Response

# foi criado as classes de cada um sensores , historico, ambiente para criar listar , atualizar e deletar no caso utilizando o crud 
# vai buscar todas as inofaçoes que tiver dentro de cada arquivo que foi definido no model e junto vai utilizar as classes criadas no serializers , para as requisiçoes individual vai ser usada os id 
# é foi definido que apenas o usuario admin pode ter acesso 

class LoginView(TokenObtainPairView):
    serializer_class= LoginSerializer


class SensorOpcoesView(APIView):
    permission_classes = [IsAuthenticated]  # ou [IsAdmin]

    def get(self, request):
        tipos_sensor = [
            {"value": key, "label": label}
            for key, label in Sensores._meta.get_field("sensor").choices
        ]
        unidades_medida = [
            {"value": key, "label": label}
            for key, label in Sensores._meta.get_field("unidade_medida").choices
        ]
        status = [
            {"value": key, "label": label}
            for key, label in Sensores._meta.get_field("status").choices
        ]

        return Response({
            "tipos_sensor": tipos_sensor,
            "unidades_medida": unidades_medida,
            "status": status
        })


class SensoresListCreatAPIView(ListCreateAPIView):
    queryset = Sensores.objects.all()
    serializer_class = SensoresSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtros
        sensor_id = self.request.query_params.get('sensor_id')
        tipo_sensor = self.request.query_params.get('tipo_sensor')
        unidade_medida = self.request.query_params.get('unidade_medida')
        status = self.request.query_params.get('status')

        # Filtrando os resultados com base nos parâmetros de consulta
        if sensor_id:
            queryset = queryset.filter(id=sensor_id)

        if tipo_sensor:
            queryset = queryset.filter(sensor=tipo_sensor)

        if unidade_medida:
            queryset = queryset.filter(unidade_medida=unidade_medida)

        if status:
            queryset = queryset.filter(status=status == "ativo")  # Converte 'ativo'/'inativo' para boolean

        return queryset

# unidade de medida filtro djnago filtrer django rest framework
class SensoresRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Sensores.objects.all()
    serializer_class =SensoresSerializer
    lookup_field= 'pk'
    permission_classes = [IsAdmin]


# Mostar todos e criar históricos, apenas para usuario autentificado.
# filtros por ID, sensor, ambiente e data (dd/mm/aaaa).

class HistoricoListCreatAPIView(ListCreateAPIView):
    queryset = Historico.objects.all()
    serializer_class = HistoricoSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        queryset = super().get_queryset()

        historico_id = self.request.query_params.get('historico_id')
        sensor_id = self.request.query_params.get('sensor_id')
        ambiente_sig = self.request.query_params.get('ambiente_sig')
        data = self.request.query_params.get('data')  # esperado: dd/mm/aaaa

        if historico_id:
            queryset = queryset.filter(id=historico_id)
        if sensor_id:
            queryset = queryset.filter(sensor_id=sensor_id)
        if ambiente_sig:
            queryset = queryset.filter(ambiente__sig=ambiente_sig)
        if data:
            try:
                data_formatada = datetime.strptime(data, '%d/%m/%Y').date()
                # filtra pelo campo date ignorando horário
                queryset = queryset.filter(timestamp__date=data_formatada)
            except ValueError:
                # data inválida retorna queryset vazio para evitar erro 500
                return queryset.none()

        return queryset

# sensor timestamp id

class HistoricoRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Historico.objects.all()
    serializer_class =HistoricoSerializer
    lookup_field= 'pk'
    permission_classes = [IsAdmin]

class AmbienteListCreatAPIView(ListCreateAPIView):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtros
        sig = self.request.query_params.get('sig')

        # Filtrando os resultados com base nos parâmetros de consulta
        if sig:
            queryset = queryset.filter(sig=sig)

        return queryset

# sig 
class AmbienteRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Ambiente.objects.all()
    serializer_class =AmbienteSerializer
    lookup_field= 'pk'
    permission_classes = [IsAdmin]



# a partir daqui vai ser baseado na apiview do djangorestframework
# so o usuario autorizado e criado pelo create super user pode ter o acesso 
# foi definido o metodo get para obter os dados dos exel para ser exportado
# é buscado em cada arquivo todos os dados que contem em cada arquivo e retorna como um dicionario e depois convertido em um dataframe que faz parte da estrutura da biblioteca pandas
# Foi definido uma resposta em http para que o navegador entenda que é um arquivo xlsxv 
# usando o content-disposition para fazer o download automatico e define um cabeçalho



class ExportarSensores(APIView):
    permission_classes = [IsAdmin]
    def get(self, request, *args, **kwargs):
        # Obtém todos os sensores do banco de dados
        sensores = Sensores.objects.all()
        
        # Especificando os campos que serão exportados
        dados = []
        for sensor in sensores:
            dados.append({
                'Sensor': sensor.sensor,
                'MAC Address': sensor.mac_address,
                'Unidade de Medida': sensor.unidade_medida,
                'Latitude': sensor.latitude,
                'Longitude': sensor.longitude,
                'Status': sensor.status
            })
        
        # Cria um DataFrame com os dados especificados
        df = pd.DataFrame(dados)

        # Cria a resposta HTTP com o tipo de conteúdo correto para Excel
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

        # Definir o cabeçalho Content-Disposition
        response['Content-Disposition'] = 'attachment; filename="sensores.xlsx"'

        try:
            # Usa o Pandas para gravar o DataFrame no arquivo Excel
            with pd.ExcelWriter(response, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Sensores')

        except Exception as e:
            return HttpResponse(f"Erro ao gerar o arquivo: {str(e)}", status=500)

        return response


class ExportarAmbiente(APIView):
    permission_classes = [IsAdmin]
    def get(self, request, *args, **kwargs):
        # Obtém todos os ambientes do banco de dados
        ambientes = Ambiente.objects.all()

        # Especificando os campos que serão exportados
        dados = []
        for ambiente in ambientes:
            dados.append({
                'SIG': ambiente.sig,
                'Descrição': ambiente.descricao,
                'NI': ambiente.ni,
                'Responsável': ambiente.responsavel
            })
        
        # Cria um DataFrame com os dados especificados
        df = pd.DataFrame(dados)

        # Cria a resposta HTTP com o tipo de conteúdo correto para Excel
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

        # Definir o cabeçalho Content-Disposition
        response['Content-Disposition'] = 'attachment; filename="ambiente.xlsx"'

        try:
            # Usa o Pandas para gravar o DataFrame no arquivo Excel
            with pd.ExcelWriter(response, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Ambiente')

        except Exception as e:
            return HttpResponse(f"Erro ao gerar o arquivo: {str(e)}", status=500)

        return response


class ExportarHistorico(APIView):
    permission_classes = [IsAdmin]
    def get(self, request, *args, **kwargs):
        # Obtém todos os históricos do banco de dados
        historicos = Historico.objects.all()

        # Especificando os campos que serão exportados
        dados = []
        for historico in historicos:
            dados.append({
                'Sensor': historico.sensor.sensor,
                'Ambiente': historico.ambiente.sig,
                'Valor': historico.valor,
                'Timestamp': historico.timestamp
            })

        # Cria um DataFrame com os dados especificados
        df = pd.DataFrame(dados)

        # Cria a resposta HTTP com o tipo de conteúdo correto para Excel
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

        # Definir o cabeçalho Content-Disposition
        response['Content-Disposition'] = 'attachment; filename="historico.xlsx"'

        try:
            # Usa o Pandas para gravar o DataFrame no arquivo Excel
            with pd.ExcelWriter(response, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Historico')

        except Exception as e:
            return HttpResponse(f"Erro ao gerar o arquivo: {str(e)}", status=500)

        return response