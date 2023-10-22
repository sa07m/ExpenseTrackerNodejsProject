const User = require('../models/user')
const Expense = require('../models/expense')
const sequelize = require('../util/database')

exports.getUserLeaderBoard = async (req, res, next) => {
    try{
        console.log('in getuser control')
        const users = await User.findAll()
        const expenses = await Expense.findAll()
        const userAggregatedExpenses = []
        expenses.forEach((expense)=>{
            if(userAggregatedExpenses[expense.userId]){
                userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId]+expense.amount
            }
            else{
                userAggregatedExpenses[expense.userId] = expense.amount
            }
            

        })
        var userLeaderBoardDetails = []
        console.log(userAggregatedExpenses)
        res.status(200).json(userAggregatedExpenses)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
//module.exports = getUserLeaderBoard