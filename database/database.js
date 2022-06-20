const Sequelize = require('sequelize')


const connection = new Sequelize('trabalho_faculdade','root', 'controless',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;