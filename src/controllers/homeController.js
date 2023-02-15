
exports.paginaInicial = (req, res) => {  //arrow function
    
    res.render('index', {
        titulo: 'Este sera o <span style=" color: red;"> titulo </span> da pagina',
        numeros: [0, 1, 2,3,4,5,6,7,8,9],

    })

    return
}

exports.trataPost = (req, res) => {

    res.send(req.body)
    
    return
}