const mongoose = require('mongoose')
const validator = require('validator') //chamando o modulo validator
const bcryptjs = require('bcryptjs')  //chamando o pacote bcryptjs que ajuda a embaralhar a senha de usuario (tipo criptografar)

//configurando o LoginSchema
const LoginSchema = new mongoose.Schema({ 
    email: {type: String, require: true},
    password: {type: String, require: true}
})

//criando o model
const LoginModel = mongoose.model('Login', LoginSchema) // (nome do model e nome do schema)

class Login {

    constructor(body){
        this.body = body 
        this.errors = [] // esse array de erros é pra acumular os erros que venham a ter nas funçoes ou metodos
        this.user = null
    }

    async login(){

        this.valida()
        if(this.errors.length > 0) return
        this.user = await LoginModel.findOne({email: this.body.email}) //checando se o email existe

        //se nao existir esse usuario
        if(!this.user){
            this.errors.push('Usuario nao existe')
            return
        } 

        //checando a senha 
        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Senha invalida') //caso de errado iremos lançar um erro
            this.user = null 
            return
        }

    }

    //metodo register
    async register(){

        this.valida() //chamando o metodo valida

        if(this.errors.length > 0) return  //checando se existem erros no array de erros. se tiver os dados nao seram registrtados no sistema.

        //chamando o metodo que checa se o usuario existe. isso ajuda a nao criarmos mais de um login com o mesmo email.
        await this.userExists()

        if(this.errors.length > 0) return

       //usado pra embaralhar a senha 
        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)
   
        this.user = await LoginModel.create(this.body)  //registrando na base de dados
        
    }

    //metodo que checa se o usuario ja existe na base de dados para que nao sejam criados dois iguais
    async userExists(){
         this.user = await LoginModel.findOne({ email: this.body.email }) //procurando um registro na base de dados que checa se o email é igual ao email do body
        if(this.user) this.errors.push('Usuario ja existe.')  //se o usuario foi preenchido entao o usuario ja existe. entao daria erro.

    }

    //metodo de validação
    valida(){
        this.cleanUp()

        //o email precisa ser valido
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail invalido')  //colocando uma flag de erro caso de errado no validator

        //senha precisa ter entre 3 e 50 caracteres
        if(this.body.password.length < 3 || this.body.password.length > 50){
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres.')
        }

    }

    cleanUp(){  //metodo que vai limpar nosso objeto

        for(const key in this.body){ //todas as chaves do body dentro de key
           if(typeof this.body[key] !== 'string'){ //se for diferente de uma string, retorna uma string vazia
            this.body[key] = ''
           }
        }

        //garantir que so temos os campos email e senha no models
        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }

}

module.exports = Login