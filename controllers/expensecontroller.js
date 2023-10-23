const Expense = require('../models/expenses');
const User = require('../models/user')
const sequelize = require('../util/database')

const path = require('path');

exports.postExpense = async (req,res,next)=>{
    const t = await sequelize.transaction()
    try{
    console.log('in post expense controller')
    const userId = req.user.id ; 
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const expense = await Expense.create({amount, description, category, userId},{transaction:t})
    const totalExpense = Number(req.user.totalexpenses) + Number(amount) ;
    await User.update({totalexpenses : totalExpense } , {
             where : { id : req.user.id},
             transaction:t
            })
            t.commit()
            console.log('commit')
            //console.log('in then',expense)
            res.status(200).json(expense)       
    }
    
    catch(err){
        console.log(err);
        t.rollback();
        console.log('rollback')
        return res.status(500).json({success:false , error : err});
    };
}

exports.getExpense = (req,res,next)=>{
    console.log('in get expense controller')

    Expense.findAll({where : {userId : req.user.id}})
    .then((expenses)=>{
        // console.log('fetched' , expenses  );
        res.json(expenses);
    })
    .catch()
}

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction()
    try{
        const id = req.params.id        
        console.log('expense id params',id)
        const expense = await Expense.findAll({
            where:{
                id:id,
                userId:req.user.id               
            },
            transaction:t
        })
        const totalExpense = Number(req.user.totalexpenses) - Number(expense[0].amount) ;
        await User.update({totalexpenses : totalExpense } , {
            where : { id : req.user.id},
            transaction:t
           })
           await expense[0].destroy();
           t.commit()
           console.log('commit')
           //console.log('in then',expense)
           res.status(200).json(expense)   

        //.then(result=>res.json('delete'))
       
        console.log('entry deleted')
    }
    catch(e){
        await t.rollback()
        console.log('rollback')
        console.log(e)
    }  
}

exports.app = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../FrontEnd/addExpense.html'));
}