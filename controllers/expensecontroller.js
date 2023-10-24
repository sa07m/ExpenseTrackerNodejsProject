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

exports.getExpense = (req, res, next) => {
    const itemsPerPage = 10;
    const currentPage = parseInt(req.query.page) || 1;
    const offset = (currentPage - 1) * itemsPerPage;

    Expense.findAndCountAll({
        where: { userId: req.user.id },
        offset,
        limit: itemsPerPage
    })
        .then(async result => {
            const totalItems = result.count;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            // const hasNextPage = currentPage < totalPages;
            // const hasPreviousPage = currentPage > 1;

            res.json({
                expenses: result.rows,
                totalPages,
            });
        })
        .catch(err => console.log(err));
}


// exports.getExpense = (req,res,next)=>{

//     const itemsParPage = 2;
//     //const of = ((req.query.page || 1) - 1);
//     const currentPage = parseInt(req.query.page) || 1;
//     console.log(of, '63 PER OFF HAI ');
//     Expense.findAll({
//         where: { userId: req.user.id },
//         offset: of * itemsParPage,
//         limit: itemsParPage
//     })
    
//         .then(async result => {
//             let pre; let nex; let prev; let nextv;
//             if (of === 0) {
//                 pre = false;
//             } else {
//                 pre = true;
//                 prev = of;
//             }
//             const ans = await nextt(req.user.id, (of + 1) * itemsParPage, itemsParPage);
//             if (ans === true) {
//                 nex = true;
//                 nextv = Number(of) + Number(2);
//             } else {
//                 nex = false;
//             }
//             console.log(prev, 'PREVIOUSBUTTON');
//             console.log(pre, 'PREBUTTON');
//             // console.log(nex, 'nexIOUSBUTTON');
//             // console.log(nextv, 'nextvOUSBUTTON');
//             // console.log(result, 'resuyltyBUTTON');
//             console.log(result,'RESULT IN BUTTONS OF GET');
//             res.json({ result, pre, nex, nextv, prev })
//         }).catch(err=> console.log(err));
// }

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
    catch(e){p
        await t.rollback()
        console.log('rollback')
        console.log(e)
    }  
}

exports.app = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../FrontEnd/addExpense.html'));
}