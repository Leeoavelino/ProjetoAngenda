const { async } = require('regenerator-runtime')
const Login = require('../models/LoginModels') //recebendo a classe Login do arquivo LoginModels, para poder utilizar aqui.

exports.index = (req, res) => {
    //caso o usuario esteja logado mandamos ele para essa pagina
    if(req.session.user)return res.render('login-logado') //renderiza o arquivo login-logado.ejs
    console.log(req.session.user)
    //caso o usuario nao esteja logado ele é direcionado para essa pagina login
    return res.render('login') //renderiza o arquivo login.ejs
}

//criando a funçao para registrar o usuario
exports.register = async function(req, res) {
    try{
        const login = new Login(req.body) //chamando a classe Login que esta em LoginModels. Esse login é uma instancia da classe.
        await login.register()
    
        if(login.errors.length > 0){ //caso tenha erros
            req.flash('errors', login.errors)  //exibir mensagem com os erros
            req.session.save(function(){  //salvar a sessao
               return res.redirect('/login/index') //retornar para o index que é a pagina atual. So coloquei um caminho direto
            })
            return
        }

        //caso nao tenha erros
        req.flash('success', 'Seu usuario foi criado com sucesso!') //exibir uma mensagem de sucesso
        req.session.save(function(){ //salvar a sessao
        return res.redirect('/login/index') //retornar para o index que é a pagina atual. So coloquei um caminho direto
        })
    }catch(e){
        console.log(e)
        return res.render('404')
    }

}

exports.login = async function(req, res) { 
    try{
        const login = new Login(req.body)
        await login.login()
    
        if(login.errors.length > 0){
            req.flash('errors', login.errors)
            req.session.save(function(){ //salvar a sessao e retornar para a pagina index
               return res.redirect('/login/index')
            })
            return
        }

        req.flash('success', 'Você entrou no sistema.')
        req.session.user = login.user
        req.session.save(function(){ //salvar a sessao e retornar para a pagina index
        return res.redirect('/login/index')
        })
    }catch(e){
        console.log(e) //logar o erro para vermos o erro
        return res.render('404') //renderizamos para o cliente uma pagina de erro 404
    }

}

exports.logout = function(req, res){ //criando a funçao logout para usarmos com a rota logout e encerrar a sessao
    req.session.destroy()  //matando a sessao
    res.redirect('/') //quando apertamos logout mandando ele para o incio da pagina
}