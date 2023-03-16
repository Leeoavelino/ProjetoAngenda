const { async } = require('regenerator-runtime')

const Contato = require('../models/ContatoModels')


exports.index = async (req, res) => {  //arrow function
    
    const contatos = await Contato.buscaContatos()

    res.render('index', { contatos })

}