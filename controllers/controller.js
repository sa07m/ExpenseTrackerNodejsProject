const express = require('express')
const bcrypt = require('bcrypt')
const UserModel = require('../models/user')
const ExpenseModel = require('../models/expense')
const jwt = require('jsonwebtoken')

function isStringValid(string){
    if(string === undefined || string.length === 0)
        return true
    else
        return false
}

exports.signup = async (req, res, next) => {
    try{
        const {name,email,password} = req.body
        if(isStringValid(name) || isStringValid(email) || isStringValid(password)){
            return res.status(400).json({err:"Bad parameters. Something is missing"})
        }
        
        const existingUser = await UserModel.findOne({
            where: {
              email: email
            }
          });
      
          if (existingUser) {
            return res.status(401).json({ error: 'Email already exists' });
          }
      
          const saltRounds = 10;
          bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                throw new Error('Hashing error')
            }
      
            UserModel.create({ name, email, password: hash })
                res.status(200).json({ message: 'Successfully created new user' });
          });
        } catch (e) {
          res.status(500).json({ error: 'Server error' });
        }
      }
    
function generateAccessToken(id,name){
    console.log(process.env.TOKEN_SECRET)
    return jwt.sign({ id:id, name:name },'12456753211')
}

exports.loginPage = async (req, res, next) => {
    try{
        const {email,password} = req.body
        if(isStringValid(email) || isStringValid(password)){
             return res.status(400).json({err:"Email Id or password is missing ", success:false})
        }
        
        const user = await UserModel.findOne({
            where:{
                email:email
            }
        })
        if(user){
            bcrypt.compare(password, user.password, (err, result)=>{
            
                if(err)
                    throw new Error('something')
                if(result){
                    const token = generateAccessToken(user.id, user.name);
                    console.log('Generated Token:', token); // Log the generated token for debugging
                    res.status(200).json({ message: 'Valid user', token });
                }
                    
                else
                    res.status(400).json({message:'Password did not match'})
            })
        }
        else
            res.status(404).json({message:'user not found'})
    }
    catch(e){
        res.status(500).json({message:'err, success:false'})
    }
}

exports.postExpense = (req, res, next) => {
    const id = req.user.id
    console.log('getting user id',id)
    const {amount,desc,cat} = req.body
    ExpenseModel.create({
        amount:amount,
        desc:desc,
        cat:cat,
        userId:id})
    .then(result=>res.json(result))
    .catch(err=>console.log(err))
}

exports.deleteExpense = async (req, res, next) => {
    try{
        const id = req.params.id
        
        console.log('expense id params',id)

        await ExpenseModel.destroy({
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

exports.getExpense = async (req, res, next) => {
    try{
        const data = await ExpenseModel.findAll({ where:{userId:req.user.id}})
        //.then(expenses=>{
          // console.log(data)
            return res.status(200).json({data, success:true})
        //  })
        // .catch(err=>{
        //     console.log(err)
        //     return res.status(500).json({error:err, success:false})
        // })
        
    }
    catch(e){
        console.log(e)
        res.status(500).json({error:e, success:false})
    }
    
}
   
    


