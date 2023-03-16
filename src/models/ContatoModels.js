//O nome do arquivo começou com letra maiuscula pq geralmente o model vai ser uma classe.

const mongoose = require('mongoose')
const { async } = require('regenerator-runtime')

const validator = require('validator')

const ContatoSchema = new mongoose.Schema({ 
    nome: {type: String, require: true},  //require coloca como obrigatorio 
    sobrenome: {type: String, require: false, default: ''}, //nao colocando nada fica vazio
    email: {type: String, require: false, default: ''}, //nao colocando nada fica vazio
    telefone: {type: String, require: false, default: ''}, //nao colocando nada fica vazio
    criadoEm: {type: Date, default: Date.now }, //mostra a data que foi criado

})

//criando o model
const ContatoModel = mongoose.model('Contato', ContatoSchema) // (nome do model e nome do schema)

function Contato(body){
    this.body = body
    this.errors = []
    this.contato = null
}

Contato.prototype.register = async function(){
    this.valida()

    if(this.errors.length > 0) return //se nao tiver erros no array de erros podemos registrar os contatos abaixo
    this.contato = await ContatoModel.create(this.body) //regista o contato na chave contato
 
}

Contato.prototype.valida = function(){
    this.cleanUp()
    //se tiver dados no email, checa se ele é valido caso nao, passa pro proximo, pois o email nao é obrigatorio, so o nome
    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail invalido')

    if(!this.body.nome) this.errors.push('Nome é um campo obrigatorio')

    //se nao for enviado nem o email nem o telefone vai dar um erro pois tem q ter um dos dois.
    if(!this.body.email && !this.body.telefone) this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.')

}

Contato.prototype.cleanUp = function(){
    for(const key in this.body){
       if(typeof this.body[key] !== 'string'){
        this.body[key] = ''
       }
    }
    
    //dados sendo tratados
    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    }
}

Contato.prototype.edit = async function(id){
    if(typeof id !== 'string') return //se for diferente de string, encerramos aqui mesmo com o return
    this.valida()
    if(this.errors.length > 0) return 
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true}) //encontre o contato por id e atualize (mandando o id e o corpo do formulario(this.body) {mandamos um objeto com os dados atualizados})
}


//METODOS ESTATICOS (metodos q nao acessam o prototype. Sendo assim nao tem acessa ao valida nem ao errors - tudo que tem this ele nao tem acesso)
Contato.buscaPorId = async function(id){
    if(typeof id !== 'string') return 
    const contato = await ContatoModel.findById(id)
    return contato
}

Contato.buscaContatos = async function(){
    const contatos = await ContatoModel.find()
        .sort({ criadoEm: -1}) //1 para ordem crescente e -1 para ordem decrescente 
    return contatos
}

Contato.delete = async function(id){
    if(typeof id !== 'string') return
    const contato = await ContatoModel.findOneAndDelete({_id: id})
    return contato
}


module.exports = Contato