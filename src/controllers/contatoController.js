const Contato = require('../models/ContatoModels')  //importando contato do arquivo ContatoModels.js
const { async } = require("regenerator-runtime")



exports.index = (req, res) => {
    res.render('contato', {
        contato: { }
    })
}

exports.register = async (req, res) => {

    try{

        const contato = new Contato(req.body)
        await contato.register()
            
        if(contato.errors.length > 0){ //verificar se existem erros
            req.flash('errors', contato.errors)
            req.session.save(() => res.redirect('/contato/index')) //redireciona para a pagina index
            return
        }
        //passando do if cai aqui e o contato é registrado. 
        req.flash('success', 'Contato registrado com sucesso.')  //aparece a mensagem de success
            req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`)) //o usuario é redirecionado para a pagina de ediçao do contato.
            return
    } catch(e){
        console.log(e)
        return res.render('404')
    }

}

exports.editIndex = async function(req, res){

    if(!req.params.id) return res.render('404') //se nao receber o parametro do id, da erro 404

    const contato = await Contato.buscaPorId(req.params.id)

    if(!contato) return res.render('404')

    res.render('contato',{
        contato
    })
}

exports.edit = async function(req, res){

    try{

        if(!req.params.id) return res.render('404')
        const contato = new Contato(req.body) //pegando os dados atualizados
        await contato.edit(req.params.id) //essa funçao recebida é a que esta em ContatoModels.js


        if(contato.errors.length > 0){ //verificando se tem erros na ediçao
            req.flash('errors', contato.errors)
            req.session.save(() => res.redirect('/contato/index'))
            return
        }

        req.flash('success', 'Contato editado com sucesso.') //nao tendo erros mostramos essa msg apos ediçao
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`))
        return
    }catch(e){
        console.log(e)
        res.render('404')
    }

}

exports.delete = async function(req, res){

    if(!req.params.id) return res.render('404')
    
    const contato = await Contato.delete(req.params.id)

    if(!contato) return res.render('404')

    req.flash('success', 'Contato apagado com sucesso.')
            req.session.save(() => res.redirect('back')) //por incrivel que pareça pegou. ficar atento para trocar por outra forma.
            return


}