//O nome do arquivo começou com letra maiuscula pq geralmente o model vai ser uma classe.

const mongoose = require('mongoose')

//HomeSchema é o nome do model - Schema é a modelagem dos dados
const HomeSchema = new mongoose.Schema({ 
    titulo: {type: String, require: true}, //criamos o titulo e colocamos qual o tipo que vai ser string.
    descricao: String
})

//criando o model
const HomeModel = mongoose.model('Home', HomeSchema) // (nome do model e nome do schema)

class Home {

}

module.exports = Home