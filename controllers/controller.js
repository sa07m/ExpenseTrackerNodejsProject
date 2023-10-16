const express = require('express')
const UserModel = require('../models/model')

exports.postDetails = async (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    await UserModel.findOne({
        where:{
            email:email
        }
    })
    .then(result=>{
        if(!result){
        console.log('in post controller'+name+email+password)

        const data = UserModel.create({
            name:name,
            email:email,
            password:password
        })
        .then(result=>res.json(result))
        .catch(err=>console.log(err))
    }
    else{
        res.json()
    }
    })
    .catch(err=>console.log(err))
}

