const express = require('express');
const route = express.Router()

const userController = require('../controllers/userController');
const bookController = require("../controllers/bookController")
const review=require("../controllers/reviewController")



route.post("/register", userController.registerUser)

route.post("/books", bookController.createBook)

route.post("/logins", userController.loginUser)

route.get("/books", bookController.getbooks)

route.get("/books/:bookId", bookController.getbook)

route.put("/books/:bookId", bookController.updateBooks)

route.delete("/books/:bookId", bookController.bookDelete)

route.post("/books/:bookId/review", review.createReview)

module.exports = route