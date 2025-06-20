# Integrador
##Lembrete (Os dados das planilhas já estão salvos no banco de dados então so é necessario intalar as dependencias e rodar tanto o back quanto o front)


1-O projeto se basei em implementar sensores na cidade. E com esse projeto ser possivel ver os sensores umidade, contador, temperatura, luminosidade alem de ambiente e historico a pessoa logada(autentificada) é permitida adiconar editar e excluir sensores, ambiente e historico
  Agora começando o projeto :
  Para iniciar o projeto é necessario
  
  -intalar a env com o comando python -m venv env
  
  -ativar a env .\env\Scripts\Activate
  
  -instalar todos esses
    -pip install djangorestframework
    -pip install djangorestframework-simplejwt
    -pip install django-cors-headers
    -pip install django-import-export , pip install pandas , pip install openpyxl
  
 - rodar o backend com python manage.py runserver

 - e no front intalar o node modules com o npm i
 - e rodar com npm run der 
  Esses são os primeiros passos a se fazer com o projeto pra conseguir rodar e começar a testar




## Se quiser fazer vai conseguir 
2-Para que na tabela sensores , ambiente e historico apareça os dados é importante que abra o postaman cria 3 requests uma pra cada usando esse endpoits 
  - http://127.0.0.1:8000/sensores/importarSensores/ tambem vai precisar do token de acesso depois vai em body colcoque sensores  seleciona file e escolhe o arquivo sensores.xlsx
  - http://127.0.0.1:8000/ambiente/importarAmbiente/  precisa do token colocar o nome ambinte file e o arquivo ambintes.xlxs
  - http://127.0.0.1:8000/historico/importarHistorico/  mesma coisa token nome historico file arquivo historico.xlxs
    
  - esse é o endpoint do login http://127.0.0.1:8000/login/
  - coloque isso no body raw
  - {
      "username": "Livia",
      "password": "12345"
    }
  
  
  e por fim para rodar o front instale o node modules com npm i 
  e rode npm run dev copia o link e abra no navegador


### Se quiser apagar o banco 
   depois de intalar se quiser apagar o banco de dados vai ser necessario esses tres passos
    -python manage.py makemigrations
    -python manage.py migrate
    -python manage.py createsuperuser
    no createsuperuser vai pedir pra adicionar um username email e senha junto com a confirmação dela e por fim quando aparecer a mensagem y or n digite y e envia e depois e so rodar o back end com python manage.py runserver
     



