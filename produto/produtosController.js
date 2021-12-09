
const express = require("express");
const Produtos = require("./Produtos");
const router = express.Router();
const auth = require("../middleware/userAuth");


router.get("/produtos", auth, (req, res)=>{
   
    Produtos.findAll({raw : true, order : [
        ['nome', 'ASC']
    ] }).then(produtos =>{

        res.render("produtos/index", {
             produtos : produtos
        });
    });

})


router.get("/produtos/new", auth, (req, res)=>{
    var nomeError = req.flash("nomeError");
    var quantidadeError = req.flash("quantidadeError");
    var precoError = req.flash("precoError");

    nomeError = (nomeError == undefined || nomeError.length == 0) ? undefined : nomeError;
    quantidadeError = (quantidadeError == undefined ) ? undefined : quantidadeError;
    precoError = (precoError == undefined) ? undefined : precoError;

    res.render("produtos/new", {nomeError : nomeError, quantidadeError : quantidadeError, precoError : precoError});
})



router.post("/produtos/save", (req, res)=> {
    
    var {nome, quantidade, preco} = req.body;
    var nomeError;
    var quantidadeError;
    var precoError;

 
        if(nome == undefined || nome == " " & quantidade == null || quantidade == 0 & preco == null || preco == 0){
            nomeError = "Os campos não podem ficar vazios.";
            quantidadeError = "A quantidade não pode ser vazia.";
            precoError = "O prço não pode ser vazio.";
            req.flash("nomeError", nomeError);
            res.redirect("/produtos/new");
        }else{
            Produtos.create({
                nome : nome,
                quantidade : quantidade,
                preco : preco
            }).then(()=>{
                res.redirect("/produtos");
            })
        }
    

    
});

router.get("/produtos/edit/:id", (req, res)=>{
    var id = req.params.id;

    Produtos.findByPk(id).then(produto => {
        if(isNaN(id)){
            res.redirect("/produtos");
        }
        if(produto != undefined){
           res.render("produtos/edit", {produto : produto}); 
        }else{
            res.redirect("/produtos");
        }
        
    }).catch(erro =>{
        res.redirect("/produtos")
    })
})

router.post("/produtos/update", (req, res)=>{
    var id = req.body.id;
    var nome = req.body.nome;
    var quantidade = req.body.quantidade;
    var preco = req.body.preco;

    Produtos.update({nome : nome, quantidade : quantidade, preco : preco},{
        where : {
            id : id
        }
    }).then(()=>{
        res.redirect("/produtos");
    })
})

router.post("/produtos/delete", (req, res)=>{
    var id = req.body.id;
    Produtos.destroy({
        where : {
            id : id
        }
    }).then(()=>{
        res.redirect("/produtos")
    })
})

module.exports = router;