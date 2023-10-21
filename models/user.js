const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const UserModel = sequelize.define('user',{
    name: {
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremiumuser:Sequelize.BOOLEAN
    })

    module.exports = UserModel