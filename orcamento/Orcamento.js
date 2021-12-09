const Sequelize = require('sequelize');
const connection = require('../database/db');

const Orcamento = connection.define('orcamento', {
    ano: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    mes: {
        type: Sequelize.STRING,
        allowNull: false
    },
    faturamento: {
        type: Sequelize.STRING,
        allowNull: false
    },
    despesas: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    lucro: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Orcamento.sync({force:false}).then(()=>{
    console.log("Tabela criada!");
})

module.exports = Orcamento;