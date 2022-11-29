const express = require('express');
const route = express.Router()

const userController = require('../controllers/userController');
const bookController = require("../controllers/bookController")
const review=require("../controllers/reviewController")



route.post("/register", userController.registerUser)

route.post("/logins", userController.loginUser)

route.post("/books", bookController.createBook)

route.get("/books", bookController.getbooks)

route.get("/books/:bookId", bookController.getbook)

route.put("/books/:bookId", bookController.updateBooks)

route.delete("/books/:bookId", bookController.bookDelete)

route.post("/books/:bookId/review", review.createReview)

route.put("/books/:bookId/review/:reviewId", review.updateReview)

module.exports = route