const express = require('express')
require('dotenv').config()
const sequelize = require('./util/database')
const bodyParser = require('body-parser')
const route = require('./routers/router')
const cors = require('cors')
const Expense = require('./models/expense')
const User  = require('./models/user') 

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

User.hasMany(Expense)
Expense.belongsTo(User)
app.use(route)
sequelize.sync()
.then(result=>{
    app.listen(3000)
    console.log('listening to port 3000 :)')
})
.catch(err=>console.log(err))
