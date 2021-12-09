const express = require("express");
const Cliente = require("./Cliente");
const router = express.Router();
const auth = require("../middleware/userAuth");

router.get("/clientes", auth, (req, res)=>{

    Cliente.findAll({raw : true, order : [
        ['nome', 'ASC']
    ]}).then(clientes => {
        res.render("clientes/index", {
            clientes : clientes
        });
    });
})

router.get("/clientes/new", auth, (req, res)=>{
    res.render("clientes/new");
})

router.post("/clientes/save", (req, res)=>{
    var cpf = req.body.cpf;
    var nome = req.body.nome;
    var contato = req.body.contato;

    Cliente.findOne({ where : {cpf : cpf}}).then(cliente =>{
        if(cliente == undefined){
            Cliente.create({
                cpf : cpf,
                nome : nome,
                contato : contato
            }).then(()=>{
                res.redirect("/clientes");
            })
        }else{
            res.redirect("/clientes")
        }
    })
})

router.get("/clientes/edit/:id", auth, (req, res)=>{
    var id = req.params.id;

    Cliente.findByPk(id).then(cliente => {
        if(isNaN(id)){
            res.redirect("/clientes");
        }
        if(cliente != undefined){
           res.render("clientes/edit", {cliente : cliente}); 
        }else{
            res.redirect("/clientes");
        }
        
    }).catch(erro =>{
        res.redirect("/clientes")
    })
})

router.post("/clientes/update", (req, res)=>{
    var id = req.body.id;
    var cpf = req.body.cpf;
    var nome= req.body.nome;
    var contato = req.body.contato;

    Cliente.update({nome : nome, cpf : cpf, contato : contato},{
        where : {
            id : id
        }
    }).then(()=>{
        res.redirect("/clientes");
    })
})

router.post("/clientes/delete", (req, res)=>{
    var id = req.body.id;
    Cliente.destroy({
        where : {
            id : id
        }
    }).then(()=>{
        res.redirect("/clientes")
    })
})


module.exports = router;