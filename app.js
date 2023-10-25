require('dotenv').config()
const path = require('path')
const express = require('express');
const helmet = require('helmet') // for secure headers
//const compression = require('compression') // for compression , not required as it is not server side rendered
const morgan = require('morgan')  //for logging
const fs = require('fs') //core module

const cors = require('cors');

const sequelize = require('./util/database');
const authroutes = require('./routes/authroutes');
const expenseroutes = require('./routes/expenseroutes');
const purchaseroutes = require('./routes/purchase');
const premiumroutes = require('./routes/premium');

const forgotpasswordroutes = require('./routes/forgotpassword');
const User = require('./models/user');
const Order = require('./models/orders');
const Expenses = require('./models/expenses');
const forGotPassword = require('./models/forgotpassword');

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'), {flags:'a'})

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet())
//app.use(compression()) 
app.use(morgan('combined',{stream:accessLogStream}))

app.use(authroutes);
app.use(expenseroutes);
app.use(purchaseroutes);
app.use(premiumroutes);
app.use(forgotpasswordroutes);

User.hasMany(Expenses);
Expenses.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forGotPassword);
forGotPassword.belongsTo(User);

sequelize.sync()
.then(()=>{
    app.listen(process.env.PORT || 3000);
})
.catch(err=> console.log(err));

