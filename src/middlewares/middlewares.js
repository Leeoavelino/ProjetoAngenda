exports.middlewareGlobal = (req, res, next) => {  //para poder acessar nos outros arquivos

    res.locals.errors = req.flash('errors')  
    res.locals.success = req.flash('success')
    res.locals.user = req.session.user 
    next()

}

exports.outroMiddleware = (req, res, next) => {

    next()

}

//se acontecer qualquer erro na aplicaçao é para abrir pro cliente a pagina de erro 404.
exports.checkCsrfError = function(err, req, res, next){

    if(err) {
        return res.render('404')
    }
    next()
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()

    next()
}

exports.loginRequired = (req, res, next) => { 
    if(!req.session.user){ //quer dizer que o usuario nao esta logado
        req.flash('errors', 'Você precisa fazer login.')
        req.session.save(() => res.redirect('/')) //salva a sessao antes e redireciona para '/' q é home
        return //para nao passar pra baixo (next)
    }

    next()
}