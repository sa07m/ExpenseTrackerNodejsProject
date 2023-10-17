const express = require('express')
const bcrypt = require('bcrypt')
const UserModel = require('../models/model')

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
              console.log(err);
              return res.status(500).json({ error: 'Hashing error' });
            }
      
            UserModel.create({ name, email, password: hash })
              .then((result) => {
                res.status(200).json({ message: 'Successfully created new user' });
              })
              .catch((err) => res.status(500).json({ error: 'Database error' }));
          });
        } catch (e) {
          res.status(500).json({ error: 'Server error' });
        }
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
                if(result)
                    res.status(200).json({message:'Valid user'})
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

   
    


