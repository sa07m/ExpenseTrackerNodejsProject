const express = require('express')
const UserModel = require('../models/model')

exports.postDetails = async (req, res, next) => {
    console.log('in post control')
    const {name,email,password} = req.body

    await UserModel.findOne({
        where:{
            email:email
        }
    })
    .then(result=>{
        if(!result){
        UserModel.create({ name,email,password })
        .then((result)=>{
            res.json(result)
           // res.status(200).json({message:'Successfully created new user'})
            //res.redirect('/login')
        })
        .catch(err=> res.status(500).json(err))
    }
    else{
        res.json()
    }
})
.catch(err=>console.log(err))
}

exports.loginPage = (req, res, next) => {
    const {email,password} = req.body
    UserModel.findOne({
        where:{
            email:email
        }
    })
    .then((result)=>{
        if(result){
            //res.json(result)
            if(password===result.password)
            {
                res.json({message:'Valid user'})
            }
            else{
                res.status(404).json({message:'Password did not match'})
            }
        }
        else{
            res.status(404).json({message:'user not found'})
        }
    })
    .catch(err=>console.log(err))
}

   
    


