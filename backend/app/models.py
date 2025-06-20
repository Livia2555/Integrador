from django.db import models
from django.contrib.auth.models import AbstractUser


#Criação das classes sensores, ambinte e historico cada uma com suas informaçoes 
# o Historico tem a ForeignKey da Classe Sensores e Ambiente  com on_delete=models.CASCADE 
# no caso é o formato cascada que faz com que o historico dependa das informaçoes fornecidas pela classes Sensores e Ambiente
 
UNIDADES_MEDIDA = [
    ('°C', 'Celsius'),
    ('%', 'Contador'),
    ('uni', 'Umidade'),
    ('lux', 'Luminosidade'),
]

SENSORES = [
    ('temperatura', 'Temperatura'),
    ('contador', 'Contador'),
    ('umidade', 'Umidade'),
    ('luminosidade', 'Luminosidade'),
]

STATUS = [
    ('ativo', 'Ativo'),
    ('inativo', 'Inativo'),
]

class Sensores(models.Model):
    sensor = models.CharField(max_length=30, choices=SENSORES)
    mac_address = models.CharField(max_length=30)
    unidade_medida = models.CharField(max_length=5, choices=UNIDADES_MEDIDA)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=10, choices=STATUS)

    def __str__(self):
        return self.sensor


class Ambiente(models.Model):
    sig = models.IntegerField(unique=True)
    descricao = models.CharField(max_length=100)
    ni = models.CharField(max_length=50)
    responsavel = models.CharField(max_length=100)

    def __str__(self):
        return str (self.sig)


class Historico(models.Model):
    sensor = models.ForeignKey(Sensores, on_delete=models.CASCADE)
    ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE)
    valor = models.FloatField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return self.sensor
    

