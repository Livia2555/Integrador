from .models import Sensores,Historico,Ambiente
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from datetime import datetime
import re

# Importa de models as classes que foram criadas 
# Por ser o arquivo serializers ele precisa ser impostado do rest_framework
# Deve importar o token que apenas o usuario permitido tem acesso chamado TokenObtainPairSerializer importado do rest_framework_simplejwt.serializers
# Ao fazer isso cria classes serializers utilizando os mesmos nomes que tem no model junto adicone a classe meta que contem o model = nome da classe do models e o fields =  all para retornar tudo dessa classe isso é feito em todas as classes serializers 

# Serializer do modelo Sensores com validações de status e MAC Address
SENSOR_UNIDADE_MAP = {
    'temperatura': '°C',
    'contador': 'uni',        
    'umidade': '%',            
    'luminosidade': 'lux',
}

class SensoresSerializer(serializers.ModelSerializer):
    status = serializers.CharField()  # entrada como string: "ativo"/"inativo"

    class Meta:
        model = Sensores
        fields = '__all__'

    def validate_mac_address(self, value):
        """Valida o formato do MAC Address."""
        pattern = r'^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError("MAC Address inválido. Use o formato 00:1B:44:11:3A:B7.")
        return value

    def validate(self, data):
        """Valida a relação entre o sensor e a unidade de medida."""
        sensor = data.get('sensor')
        unidade_medida = data.get('unidade_medida')

        # Convertendo para minúsculo para garantir match mesmo se vier com maiúscula
        if sensor:
            sensor_key = sensor.lower()
        else:
            sensor_key = None

        unidade_esperada = SENSOR_UNIDADE_MAP.get(sensor_key)

        if unidade_esperada is None:
            raise serializers.ValidationError(
                f"Sensor '{sensor}' não é válido ou não está mapeado para uma unidade de medida."
            )

        if unidade_medida != unidade_esperada:
            raise serializers.ValidationError(
                f"A unidade de medida '{unidade_medida}' não corresponde ao sensor '{sensor}'. "
                f"A unidade esperada para o sensor '{sensor}' é '{unidade_esperada}'."
            )
        return data

    def to_representation(self, instance):
        """Personaliza a forma como o status será retornado na resposta."""
        data = super().to_representation(instance)
        if instance.status == True or instance.status == "ativo":
            data['status'] = "ativo"
        else:
            data['status'] = "inativo"
        return data

# Serializer do modelo Ambiente com proibição de alteração do campo `sig`
class AmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambiente
        fields = '__all__'

    def update(self, instance, validated_data):
        """Proíbe a alteração do campo 'sig'."""
        if 'sig' in validated_data and validated_data['sig'] != instance.sig:
            raise serializers.ValidationError("O campo 'sig' não pode ser alterado.")
        return super().update(instance, validated_data)

# Serializer do modelo Historico com timestamp no formato dd/mm/yyyy HH:MM:SS
class HistoricoSerializer(serializers.ModelSerializer):
    timestamp = serializers.CharField()

    class Meta:
        model = Historico
        fields = '__all__'

    def validate_timestamp(self, value):
        """Valida e converte string para datetime no formato dd/mm/yyyy, HH:MM:SS"""
        try:
            dt = datetime.strptime(value, "%d/%m/%Y, %H:%M:%S")
            return dt
        except ValueError:
            raise serializers.ValidationError(
                "Formato inválido. Use dd/mm/yyyy, HH:MM:SS (ex: 02/05/2025, 08:58:00)."
            )

    def to_representation(self, instance):
        """Formata datetime para string no formato dd/mm/yyyy, HH:MM:SS"""
        data = super().to_representation(instance)
        data['timestamp'] = instance.timestamp.strftime("%d/%m/%Y, %H:%M:%S")
        return data
    

# Serializer de Login, que inclui as informações do usuário no token JWT
class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['usuario'] = {
            'username': self.user.username,
            'email': self.user.email,
        }
        return data