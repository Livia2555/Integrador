# importa a biblioteca pandas para ler e manipular planilhas Excel
# importa o MultiPartParser para permitir que a API aceite arquivos via formulário
# importa JsonResponse para retornar respostas em formato JSON
import pandas as pd
from rest_framework import generics
from rest_framework.parsers import MultiPartParser
from django.http import JsonResponse
from .models import Sensores, Ambiente, Historico
from .permissions import IsAdmin



# Classe para importar dados da planilhas Excel (.xlsx).
# Acesso peritido apenas para usuario logado autentificado
# No método POST valida o arquivo, lê os dados com a biblioteca pandas e importa conforme o tipo de recurso (sensores, ambiente ou historico).

class ImportarPlanilha(generics.GenericAPIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        tipo_recurso = kwargs.get('tipo_recurso')
        file_key = tipo_recurso  # espera que o nome do campo seja igual ao tipo_recurso

        if file_key not in request.FILES:
            return JsonResponse({"error": f"Nenhum arquivo enviado com o nome '{file_key}'."}, status=400)

        file = request.FILES[file_key]

        if not file.name.endswith('.xlsx') and not file.name.endswith('.xls'):
            return JsonResponse({"error": "Arquivo inválido. Envie uma planilha Excel."}, status=400)

        try:
            df = pd.read_excel(file)
        except Exception as e:
            return JsonResponse({"error": f"Erro ao ler o arquivo Excel: {str(e)}"}, status=400)

        if tipo_recurso == 'sensores':
            self.importar_sensores(df)
        elif tipo_recurso == 'ambiente':
            self.importar_ambiente(df)
        elif tipo_recurso == 'historico':
            self.importar_historico(df)
        else:
            return JsonResponse({"error": "Tipo de recurso desconhecido."}, status=400)

        return JsonResponse({"success": f"Dados importados para {tipo_recurso} com sucesso!"}, status=200)

# Importa os dados da planilha para o modelo Sensores.
 # Converte o campo "status" para valores padronizados (ativo ou inativo)
    def importar_sensores(self, df):
        for index, row in df.iterrows():
            status_raw = str(row['status']).strip().lower()
            status = 'ativo' if status_raw in ['ativo', 'true', '1', 'sim', 'yes'] else 'inativo'
            sensor = str(row['sensor']).strip().lower()

            Sensores.objects.create(
                sensor=sensor,
                mac_address=row['mac_address'],
                unidade_medida=row['unidade_medida'],
                latitude=row['latitude'],
                longitude=row['longitude'],
                status=status,
            )

# Importa os dados da planilha para o modelo Ambiente.
# Cada linha representa um ambiente com identificação, descrição e responsável.
    def importar_ambiente(self, df):
        for index, row in df.iterrows():
            Ambiente.objects.create(
                sig=row['sig'],
                descricao=row['descricao'],
                ni=row['ni'],
                responsavel=row['responsavel']
            )

# Importa os dados da planilha para o modelo Historico.
# Cada linha representa um registro de leitura de sensor em um ambiente e momento específico.
    def importar_historico(self, df):
        for index, row in df.iterrows():
            try:
                Historico.objects.create(
                    sensor_id=row['sensor'],
                    ambiente_id=row['ambiente'],
                    valor=row['valor'],
                    timestamp=row['timestamp']
                )
            except Exception as e:
                print(f"Erro na linha {index}: {e}")
                raise e  # ou: return JsonResponse({"error": str(e)}, status=400)
