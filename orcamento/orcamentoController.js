const express = require("express");
const Orcamento = require("./Orcamento");
const router = express.Router();
const auth = require("../middleware/userAuth");
const multer = require("multer")
const path = require("path");
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "middleware/uploads/");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({storage})


router.get("/orcamentos", auth, (req, res)=>{

    Orcamento.findAll({raw : true, order : [
        ['ano', 'ASC']
    ]}).then(orcamentos => {
        res.render("orcamentos/index", {
            orcamentos : orcamentos
        });
    });
})

router.get("/orcamentos/new", auth, (req, res)=>{
    res.render("orcamentos/new");
})


router.post("/orcamentos/save", upload.single("file"), (req, res)=>{
    var ano = req.body.ano;
    var mes = req.body.mes;
    var faturamento = req.body.faturamento;
    var despesas = req.body.despesas;
    var lucro = (req.body.faturamento - req.body.despesas);

    Orcamento.findOne({ where : {ano : ano, mes : mes}}).then(orcamento =>{
        if(orcamento == undefined){
            Orcamento.create({
                ano : ano,
                mes : mes,
                faturamento : faturamento,
                despesas : despesas,
                lucro : lucro
            }).then(()=>{
                res.redirect("/orcamentos");  
            })
        }else{
            res.redirect("/orcamentos")
        }
    })
})



router.get("/orcamentos/edit/:id", auth, (req, res)=>{
    var id = req.params.id;

    Orcamento.findByPk(id).then(orcamento => {
        if(isNaN(id)){
            res.redirect("/orcamentos");
        }
        if(orcamento != undefined){
           res.render("orcamentos/edit", {orcamento : orcamento}); 
        }else{
            res.redirect("/orcamentos");
        }
        
    }).catch(erro =>{
        res.redirect("/orcamentos")
    })
})

router.post("/orcamentos/update", (req, res)=>{
    var id = req.body.id;
    var ano = req.body.ano;
    var mes = req.body.mes;
    var faturamento = req.body.faturamento;
    var despesas = req.body.despesas;
    var lucro = req.body.lucro;

    Orcamento.update({ano : ano, mes : mes, faturamento : faturamento, despesas : despesas, lucro : lucro},{
        where : {
            id : id
        }
    }).then(()=>{
        res.redirect("/orcamentos");
    })
})


router.post("/orcamentos/delete", (req, res)=>{
    var id = req.body.id;
    Orcamento.destroy({
        where : {
            id : id
        }
    }).then(()=>{
        res.redirect("/orcamentos")
    })
})

module.exports = router;