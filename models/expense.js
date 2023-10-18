const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const UserModel = sequelize.define('expense',{
    amount: {
        type:Sequelize.INTEGER,
        allowNull:false
    },
    desc:{
        type:Sequelize.STRING,
        allowNull:false
    },
    cat:{
        type:Sequelize.STRING,
        allowNull:false
    }
    })

    module.exports = UserModel