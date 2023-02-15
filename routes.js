const express = require('express')

const route = express.Router() //responsavel por tratar todas as rotas

//importando tudo oq esse arquivo exporta
const homeController = require('./src/controllers/homeController')
//importando tudo oq esse arquivo exporta
const contatosController = require('./src/controllers/contatosController')
//importando tudo oq esse arquivo exporta
const testesController = require('./src/controllers/testesController')

//caminho para funçao do homeController -  paginaInicial
route.get('/',  homeController.paginaInicial)
route.post('/', homeController.trataPost)

//caminho para a funçao que esta dentro de contatosController - contatos
route.get('/contato', contatosController.contatos)

//criei uma rota de testes recebendo dois parametros opcionais
route.get('/testes?/:id_Usuario?/:id_Senha?', testesController.testes)







module.exports = route