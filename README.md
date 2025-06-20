# Integrador
  O projeto se basei em implementar sensores na cidade. E com esse projeto ser possivel ver os sensores umidade, contador, temperatura, luminosidade alem de ambiente e historico a pessoa logada(autentificada) é permitida adiconar editar e excluir sensores, ambiente e historico
  Agora começando o projeto :
  Para iniciar o projeto é necessario
  
  -intalar a env com o comando python -m venv env
  
  -ativar a env .\env\Scripts\Activate
  
  -instalar todos esses
    -pip install djangorestframework
    -pip install djangorestframework-simplejwt
    -pip install django-cors-headers
    -pip install django-import-export , pip install pandas , pip install openpyxl
  
  depois de intalar se quiser apagar o banco de dados vai ser necessario esses tres passos
  -python manage.py makemigrations
  -python manage.py migrate
  -python manage.py createsuperuser
  no createsuperuser vai pedir pra adicionar um username email e senah junto coma confirmação dela e por fim quando aparecer a mensagem y or n digite y e envia e depois e so rodar o back end com python manage.py runserver
  
  mas caso nao queria apagar o banco e so rodar com python manage.py runserver
  Esses são os primeiros passos a se fazer com o projeto pra conseguir rodar e começar a testar


Para que na tabela sensores , ambiente e historico apareça os dados é importante que abra o postaman cria 3 requests uma pra cada usando esse endpoits 
- http://127.0.0.1:8000/sensores/importarSensores/ tambem vai precisar do token de acesso depois vai em body colcoque sensores  seleciona file e escolhe o arquivo sensores.xlsx
- http://127.0.0.1:8000/ambiente/importarAmbiente/  precisa do token colocar o nome ambinte file e o arquivo ambintes.xlxs
- http://127.0.0.1:8000/historico/importarHistorico/  mesma coisa token nome historico file arquivo historico.xlxs

- esse é o endpoint do login http://127.0.0.1:8000/login/
- coloque isso no body raw
- {
    "username": "Livia",
    "password": "12345"
  }

