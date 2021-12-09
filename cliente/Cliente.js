const Sequelize = require('sequelize');
const connection = require('../database/db');

const Cliente = connection.define('cliente', {
    cpf: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    endereco: {
        type: Sequelize.STRING,
        allowNull: false
    },
    contato: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Cliente.sync({force:false}).then(()=>{
    console.log("Tabela criada!");
})

module.exports = Cliente;