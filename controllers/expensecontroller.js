const Expense = require('../models/expenses');
const User = require('../models/user')

const path = require('path');

exports.postExpense =(req,res,next)=>{
    console.log('in post expense controller')
    const userId = req.user.id ; 
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    Expense.create({amount : amount , description : description , category : category , userId : userId})
    .then((expense)=>{
        const totalExpense = Number(req.user.totalexpenses) + Number(amount) ;
        User.update({totalexpenses : totalExpense } , { where : { id : req.user.id}})
        .then(()=>{
            res.status(200).json({expense:expense})
        })
        .catch(err=>{
            throw new Error(err);
        })
    })
    .catch(err => {
        throw new Error(err);
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({success:false , error : err});
    });
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
    try{
        const id = req.params.id
        
        console.log('expense id params',id)

        await Expense.destroy({
            where:{
                id:id,
                userId:req.user.id
            }
        })
        .then(result=>res.json('delete'))
        .catch(err=>console.log(err))
        console.log('entry deleted')
    }
    catch(e){
        console.log(e)
    }  
}