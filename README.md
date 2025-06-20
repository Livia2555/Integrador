# Integrador
  O projeto se basei em implementar sensores na cidade. E com esse projeto ser possivel ver os sensores umidade, contador, temperatura, luminosidade alem de ambiente e historico a pessoa logada(autentificada) é permitida adiconar editar e excluir sensores, ambiente e historico
  Agora começando o projeto :
  Para iniciar o projeto é necessario
  -intalar a env com o comando python -m venv env
  -ativar a env .\env\Scripts\Activate
  -instalar todos esses
  pip install djangorestframework
    pip install djangorestframework-simplejwt
    pip install django-cors-headers
    pip install django-import-export , pip install pandas , pip install openpyxl
  
  depois de intalar se quiser apagar o banco de dados vai ser necessario esses tres passos
  python manage.py makemigrations
  python manage.py migrate
  python manage.py createsuperuser
  no createsuperuser vai pedir pra adicionar um username email e senah junto coma confirmação dela e por fim quando aparecer a mensagem y or n digite y e envia e depois e so rodar o back end com python manage.py runserver
  
  mas caso nao queria apagar o banco e so rodar com python manage.py runserver
  Esses são os primeiros passos a se fazer com o projeto pra conseguir rodar e começar a testar

