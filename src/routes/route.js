const express = require('express');
const route=express.Router()

const userController = require('../controllers/userController');
const bookController=require("../controllers/bookController")




route.post("/register",userController.registerUser)

route.post("/books",bookController.createBook)


route.post("/logins", userController.loginUser )


module.exports=route