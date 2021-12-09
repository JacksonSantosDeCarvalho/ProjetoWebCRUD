const  express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");
const connection = require("./database/db")
const flash = require("express-flash");
const cookieParser = require("cookie-parser");



const produtosController = require('./produto/produtosController');
const usuarioController = require('./usuario/usuarioController');
const clienteController = require('./cliente/clienteController');
const orcamentoController = require("./orcamento/orcamentoController");

const Produtos = require("./produto/Produtos");
const Usuario = require("./usuario/Usuario");
const Cliente = require("./cliente/Cliente");
const Orcamento = require("./orcamento/Orcamento");

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(flash());

connection
    .authenticate()
    .then(()=>{
        console.log("Conexão ao banco realizada com sucesso!");
    })
    .catch((msgErro)=>{
        console.log(msgErro);
    })


app.use(session({
    secret : "ifpecafiwebprojeto",
    cookie : { maxAge : 1000000 },
    resave: true,
    saveUninitialized: true
}))

app.use("/", usuarioController);
app.use("/", produtosController);
app.use("/", clienteController);
app.use("/", orcamentoController);

app.listen(8080, ()=>{ console.log("Servidor em execução"); });

app.get("/", (req, res)=>{
    res.render("inicio");
});



