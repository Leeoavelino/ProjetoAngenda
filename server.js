//referente as variaveis de ambiente que estao no arquivo .env
require('dotenv').config()

 //modulo do express declarado para uso  - NAO PRECISA apontar CAMINHO
const express = require('express')

//para carregar o express usando o app como variavel
const app = express() 

//serve para modelar a nossa base de dados e fazer com que os dados enviados cheguem ao banco de dados da forma que foram enviados
const mongoose = require('mongoose') 

//para corrigir o erro que estava dando. o proprio terminal que passou essa forma de correçao.
mongoose.set('strictQuery', true); 

//para conctar usando a senha que esta no .env
mongoose.connect(process.env.CONNECTIONSTRING) 
    .then( () => {
        app.emit('pronto')
    })
    .catch( e => console.log(e))

//serve para identificar o navegador de um cliente para quando ele venha acessar nosso servidor.
const session = require('express-session') 

//é pra falar que as sessoes seram salvas na base de dados
const MongoStore = require('connect-mongo') 

//mensagens de avisos que assim que sao lidas sao apagadas.
const flash = require('connect-flash') 

//cria rotas para as aplicaçoes. estamos declarando a funçao na variavel routes
const routes = require('./routes') 

//trabalhar com caminhos
const path = require('path') 

//segurança
const helmet = require('helmet') 

//isso faz com que nenhum site externo consiga postar coisas pra dentro da nossa aplicaçao
const csrf = require('csurf') 

//importando os middlewares- sao funçoes executadas em rotas. uma apos outra. uma funçao so é executada se a outra for antes.
const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middlewares') 

//chama o helmet 
app.use(helmet()) 

//para postarmos formularios para dentro da nossa aplicaçao
app.use(express.urlencoded({ 
    extended: true
}))

//para usar o json dentro da nossa aplicaçao
app.use(express.json()) 

//todos os arquivos estaticos que podem ser acessados diretamente. ex: css, js, img
app.use(express.static(path.resolve(__dirname, 'public'))) 


const sessionOptions = session({
    secret: 'Qualquer coisa',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})

app.use(sessionOptions)
app.use(flash())


//caminho absoluto - arquivos que renderizamos na tela
app.set('views', path.resolve(__dirname, 'src', 'views')) 

//a engineer que iremos usar é o ejs q é como se fosse um html turbinado
app.set('view engine', 'ejs') 

app.use(csrf())

//chamando nossos middlewares criados
app.use(middlewareGlobal)  
app.use(checkCsrfError)
app.use(csrfMiddleware)

//faz o express usar as rotas
app.use(routes) 

//a conexão so vai ocorrer quando capturarmos o sinal de pronto emitido pelo app.emit
app.on('pronto', () =>{ 
    app.listen(3000, () => { //criando a porta para acessar 
        console.log('Acessar: http://localhost:3000') //colocando o caminho do site na porta 3000
        console.log('servidor executando na porta 3000')
    })
})

