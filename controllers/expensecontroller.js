const Expense = require('../models/expenses');

const path = require('path');

// exports.app = (req,res,next)=>{
//     res.sendFile(path.join(__dirname,  '../expense.html'));
// }

exports.postExpense =(req,res,next)=>{
    console.log('in post expense controller')
    const userId = req.user.id ; 
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    Expense.create({amount : amount , description : description , category : category , userId : userId})
    .then((data)=>res.json(data))
    .catch(err=>console.log(err));
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