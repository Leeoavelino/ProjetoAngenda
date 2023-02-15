//modulo = micro Framework ou biblioteca

require('dotenv').config() //referente as variaveis de ambiente que estao no arquivo .env

const express = require('express') //modulo do express declarado para uso  - NAO PRECISA apontar CMAINHO POIS JA ESTA DENTRO DO NODE
const app = express() //para carregar o express usando o app como variavel

const mongoose = require('mongoose') //serve para modelar a nossa base de dados. e fazer com que os dados enviados cheguem ao banco de dados da forma que foram enviados

mongoose.set('strictQuery', true); //para corrigir o erro que estava dando. o proprio terminal que passou essa forma de correçao.

mongoose.connect(process.env.CONNECTIONSTRING) //para conctar usando a senha que esta no .env
    .then( () => {
        app.emit('pronto')
    })
    .catch( e => console.log(e))

const session = require('express-session') //serve para identificar o navegador de um cliente para quando ele venha acessar nosso servidor.

const MongoStore = require('connect-mongo') //é pra falar que as sessoes seram salvas na base de dados

const flash = require('connect-flash') //mensagens que assim que ler elas vao sumir da base de dados.

const routes = require('./routes') //rotas da nossa aplicaçao

const path = require('path') //trabalhar com caminhos

const helmet = require('helmet') //segurança

const csrf = require('csurf') //isso faz com que nenhum site externo consiga postar coisas pra dentro da nossa aplicaçao

const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middlewares') //importando o middleware - sao funçoes executadas em rotas. uma apos outra.

app.use(helmet()) //chama o helmet 

app.use(express.urlencoded({ //para postarmos formularios para dentro da nossa aplicaçao
    extended: true
}))

app.use(express.json()) //para usar o json dentro da nossa aplicaçao

app.use(express.static(path.resolve(__dirname, 'public'))) //todos os arquivos estaticos que podem ser acessados diretamente. ex css, js, img

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



app.set('views', path.resolve(__dirname, 'src', 'views')) //caminho absoluto - arquivos que renderizamos na tela
app.set('view engine', 'ejs') //a engine que iremos usar é o ejs q é um html "turbinado"

app.use(csrf())

//nossos proprios middlewares
app.use(middlewareGlobal)  
app.use(checkCsrfError)
app.use(csrfMiddleware)

app.use(routes) //faz o express usar as rotas

app.on('pronto', () =>{ //a conexão so vai ocorrer quando capturarmos o sinal de pronto emitido pelo app.emit
    app.listen(3000, () => { //criando a porta para acessar 
        console.log('Acessar: http://localhost:3000') //colocando o caminho do site na porta 3000
        console.log('servidor executando na porta 3000')
    })
})

