const express = require('express')
const route = express.Router()
const userController = require('../controllers/userController')
const bookController = require("../controllers/bookController")
const review=require("../controllers/reviewController")
const MW = require("../mid/auth")

route.post("/register",  userController.registerUser )
route.post("/logins",  userController.loginUser )
route.post("/books",  MW.Authentication,  bookController.createBook )
route.get("/books",   MW.Authentication,  bookController.getbooks )
route.get("/books/:bookId",  MW.Authentication,  MW.Authrization,  bookController.getbook )
route.put("/books/:bookId",  MW.Authentication,   MW.Authrization,  bookController.updateBooks )
route.delete("/books/:bookId",  MW.Authentication,   MW.Authrization,  bookController.bookDelete )
route.post("/books/:bookId/review",   review.createReview )
route.put("/books/:bookId/review/:reviewId",  review.updateReview )
route.delete("/books/:bookId/review/:reviewId",  review.deleteReview )

module.exports = route