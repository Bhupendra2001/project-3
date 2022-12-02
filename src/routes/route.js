const express = require('express')
const route = express.Router()
const userController = require('../controllers/userController')
const bookController = require("../controllers/bookController")
const review=require("../controllers/reviewController")
const {Authentication,Authrization}=require("../mid/auth")

route.post("/register",  userController.registerUser )
route.post("/login",  userController.loginUser )

route.post("/books",  Authentication,  bookController.createBook )
route.get("/books",   Authentication,  bookController.getbooks )

route.get("/books/:bookId", Authentication,  Authrization,  bookController.getbook )
route.put("/books/:bookId", Authentication,   Authrization,  bookController.updateBooks )
route.delete("/books/:bookId",Authentication, Authrization,  bookController.bookDelete )

route.post("/books/:bookId/review",   review.createReview )
route.put("/books/:bookId/review/:reviewId", review.updateReview )
route.delete("/books/:bookId/review/:reviewId",review.deleteReview )

route.all("/*",(req,res)=>{
    return res.status(404).send({status:false,msg:"your end point is wrong"})
})

module.exports = route