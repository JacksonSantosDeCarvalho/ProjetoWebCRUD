const Sequelize = require('sequelize');
const connection = new Sequelize('clinica', 'root', '27606', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;