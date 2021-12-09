
const express = require("express");
const Usuario = require("./Usuario");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/userAuth");

router.get("/login", (req, res)=>{
    var emailError = req.flash("emailError");
    var senhaError = req.flash("senhaError");

    emailError = (emailError == undefined || emailError.length == 0) ? undefined : emailError;
    senhaError = (senhaError == undefined || senhaError.length == 0) ? undefined : senhaError;

    res.render("usuarios/login", {emailError : emailError, senhaError : senhaError})
});

router.post("/usuario/autenticacao", (req, res)=>{
    var {email, senha} = req.body;
    var emailError;
    var senhaError;

    if(email == undefined || email.length == 0 || senha == undefined || senha == 0){
        emailError = "Os campos não podem ficar vazios";
        senhaError = " "
        req.flash("emailError", emailError)
        res.redirect("/login");
    }else{
        Usuario.findOne({where: {email : email}}).then(usuario => {
            var senhaOK = bcrypt.compareSync(senha, usuario.senha);
            if(senhaOK){
                req.session.usuario = {
                    email : usuario.email
                }               
                res.redirect("/");
            }else{
                
                res.redirect("/login");
            }
        
        });
    }
 
});

router.get("/logout", (req, res)=>{
    req.session.usuario = undefined;
    res.redirect("/login");
});

router.get("/usuarios", auth, (req, res)=>{
 
    Usuario.findAll({raw : true, order : [
        ['nome', 'ASC']
    ]}).then(usuarios =>{
        res.render("usuarios/index", {
             usuarios : usuarios
        });
     });

})

router.get("/usuarios/new", auth, (req, res)=>{
    res.render("usuarios/new");
})

router.post("/usuarios/save", (req, res)=> {
    var nome = req.body.nome;
    var email = req.body.email;
    var senha = req.body.senha;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(senha, salt);

    Usuario.findOne({ where : {email : email}}).then(usuario =>{
        if(usuario == undefined){
              Usuario.create({
                nome : nome,
                email : email,
                senha : hash
            }).then(()=>{
                res.redirect("/usuarios");
            })
        }else{
            res.redirect("/usuarios");
        }
    })

  
})

router.get("/usuarios/edit/:id", auth, (req, res)=>{
    var id = req.params.id;

    Usuario.findByPk(id).then(usuario => {
        if(isNaN(id)){
            res.redirect("/usuarios");
        }
        if(usuario != undefined){
           res.render("usuarios/edit", {usuario : usuario}); 
        }else{
            res.redirect("/usuarios");
        }
        
    }).catch(erro =>{
        res.redirect("/usuarios")
    })
})

router.post("/usuarios/update", (req, res)=>{
    var id = req.body.id;
    var nome = req.body.nome;
    var email = req.body.email;
    var senha = req.body.senha;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(senha, salt);

    Usuario.update({nome : nome, email : email, senha : hash},{
        where : {
            id : id
        }
    }).then(()=>{
        res.redirect("/usuarios");
    })
})

router.post("/usuarios/delete", (req, res)=>{
    var id = req.body.id;
    Usuario.destroy({
        where : {
            id : id
        }
    }).then(()=>{
        res.redirect("/usuarios")
    })
})

module.exports = router;