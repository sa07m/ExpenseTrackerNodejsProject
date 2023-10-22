const express = require('express')
require('dotenv').config()
const sequelize = require('./util/database')
const bodyParser = require('body-parser')
const route = require('./routers/router')
const premiumroute = require('./routers/premiumFeatures')
const cors = require('cors')
const Expense = require('./models/expense')
const User  = require('./models/user') 
const Order = require('./models/orders')

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

app.use(route)
app.use(premiumroute)

sequelize.sync()
.then(result=>{
    app.listen(3000)
    console.log('listening to port 3000 :)')
})
.catch(err=>console.log(err))
