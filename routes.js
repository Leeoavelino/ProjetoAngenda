const express = require('express')

//responsavel por tratar todas as rotas
const route = express.Router() 

//arquivos importados
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contatoController = require('./src/controllers/contatoController')

const {loginRequired} = require('./src/middlewares/middlewares') //importando o middleware que verifica se o usuario esta logado ou nao

//rotas de home
route.get('/',  homeController.index)

//rotas de login
route.get('/login/index', loginController.index)  //rota que 'vai no arquivo loginController, na funçao index
route.post('/login/register', loginController.register) //rota de registro de usuarios
route.post('/login/login', loginController.login) //rota de login do usuarios
route.get('/login/logout', loginController.logout) //rota de logout para saida do usuario

//rotas de contato
//colocamos loginRequired no meio da rota para checar antes se o usuario esta logado
route.get('/contato/index', loginRequired,  contatoController.index)
route.post('/contato/register', loginRequired,  contatoController.register) //recebe os dados registrados
route.get('/contato/index/:id', loginRequired,  contatoController.editIndex) //rota para cair no contato apos o criarmos
route.post('/contato/edit/:id', loginRequired,  contatoController.edit) //rota para a ediçao e iremos para a funçao edit
route.get('/contato/delete/:id', loginRequired,  contatoController.delete)


module.exports = route