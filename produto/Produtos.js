const Sequelize = require('sequelize');
const connection = require('../database/db');

const Produtos = connection.define('produtos', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantidade:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    preco:{
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

Produtos.sync({force:false}).then(()=>{
    console.log("Tabela criada!");
})

module.exports = Produtos;