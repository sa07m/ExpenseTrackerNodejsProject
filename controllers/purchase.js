const Razorpay = require('razorpay')
const Order = require('../models/orders')
const userController= require('./controller');
const jwt = require('jsonwebtoken')


exports.purchasepremium = async (req, res) => {
    try {
        console.log('in try bolck')
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        //console.log(process.env.RAZORPAY_KEY_ID)
        const amount = 2500
        
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                console.log('in orders create error')
                console.log(err)
                throw new Error(JSON.stringify(err))
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING' })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id })
                })
                .catch(err => {
                    throw new Error(err)
                })

        })
    }
    catch(err){
        console.log(err)
        res.status(403).json({message:'something went wrong', error:err})
    }
}

function generateAccessToken(id,name,ispremiumuser){
    console.log(process.env.TOKEN_SECRET)
    return jwt.sign({ id:id, name:name, ispremiumuser },process.env.TOKEN_SECRET)
}
exports.updateTransactionStatus = async (req, res) => {
    try{
        const {payment_id, order_id} = req.body
        const order = await Order.findOne({where:{orderid:order_id}})
        const promise1 = order.update({paymentid:payment_id, status:'SUCCESSFUL'})
        const promise2 = req.user.update({ispremiumuser:true})

        Promise.all([promise1,promise2]).then(()=>{
            return res.status(202).json({success:true,message:"Transaction successful", token: generateAccessToken(req.user.id,undefined,true)})
        }).catch((err)=>{
            throw new Error(err)
        })
            
                
    }
    catch(err){
        console.log(err)
        res.ststaus(403).json({error:err,message:'something went wrong'})
    }
}

exports.updateTransactionFailed = async(req,res)=>{
    try{
        const {order_id} = req.body
        const order = await Order.findOne({where:{orderid:order_id}})
        await order.update({status:'FAILED'})

        return res.status(400).json({message:'transaction failed'})


    }
    catch(err){
        console.log(err)
        res.status(403).json({message:'something went wrong during updating transaction'},err)
    }
}