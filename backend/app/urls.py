from django.urls import path
from . import views
from app.importarDados import ImportarPlanilha
from .views import ExportarSensores, ExportarHistorico, ExportarAmbiente

urlpatterns = [
    # url para logar 
    path('login/', view=views.LoginView.as_view(), name='login'), 

    # urls criada para mostrar todos, individual, criar, atualizar e deletar

    # sensores
    path('sensores/', view=views.SensoresListCreatAPIView.as_view(), name='Listar_Criar_Sensores'),
    path('sensores/<int:pk>/', view=views.SensoresRetrieveUpdateDestroyAPIView.as_view(), name='Atualizar_Deletar_Sensores'),
    path('sensores/importarSensores/', ImportarPlanilha.as_view(), name='importar_planilha_sensores', kwargs={'tipo_recurso': 'sensores'}),
    path('sensores/exportarSensores/', ExportarSensores.as_view(), name='exportar_sensores'),
    path('sensores/opcoes/', views.SensorOpcoesView.as_view(), name='sensor_opcoes'), 

    # ambiente
    path('ambiente/', view=views.AmbienteListCreatAPIView.as_view(), name='Listar_Criar_Ambiente'),
    path('ambiente/<int:pk>/', view=views.AmbienteRetrieveUpdateDestroyAPIView.as_view(), name='Atualizar_Deletar_Ambiente'),
    path('ambiente/importarAmbiente/', ImportarPlanilha.as_view(), name='importar_planilha_ambiente', kwargs={'tipo_recurso': 'ambiente'}),
    path('ambiente/exportarAmbiente/', ExportarAmbiente.as_view(), name='exportar_ambiente'),

    # histórico
    path('historico/', view=views.HistoricoListCreatAPIView.as_view(), name='Listar_Criar_Historico'),
    path('historico/<int:pk>/', view=views.HistoricoRetrieveUpdateDestroyAPIView.as_view(), name='Atualizar_Deletar_Historico'),
    path('historico/importarHistorico/', ImportarPlanilha.as_view(), name='importar_planilha_historico', kwargs={'tipo_recurso': 'historico'}),
    path('historico/exportarHistorico/', ExportarHistorico.as_view(), name='exportar_historico'),

]
