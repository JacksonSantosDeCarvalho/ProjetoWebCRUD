const Sequelize = require('sequelize');
const connection = require('../database/db');

const Usuario = connection.define('usuario', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    senha:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Usuario.sync({force:false}).then(()=>{
    console.log("Tabela criada!");
})

module.exports = Usuario;