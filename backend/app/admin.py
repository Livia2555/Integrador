from django.contrib import admin
from .models import Sensores, Ambiente, Historico

# Registrando os modelos diretamente
admin.site.register(Sensores)
admin.site.register(Ambiente)
admin.site.register(Historico)