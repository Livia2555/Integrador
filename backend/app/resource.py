from .models import Sensores,Historico,Ambiente
from import_export import resources


# arquivo criado para a importação do ambiente historico e sensores qua vai ser utilizado 
class AmbienteResources (resources.ModelResource):
    class Meta:
        model = Ambiente
        import_id_fields = ['sig'] 

class HistoricoResources (resources.ModelResource):
    class Meta:
        model = Historico

class SensoresResources (resources.ModelResource):
    class Meta:
        model = Sensores

