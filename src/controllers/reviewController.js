const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel')


const { validRating, validName, isvalidObjectid } = require("../validation/validation")

exports.createReview = async function (req, res) {

    try {

        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: "bookID should be present" });
        if (!isvalidObjectid(bookId)) return res.status(400).send({ status: false, message: "invalid userId" });

        let bookByBookId = await bookModel.findById(bookId)
        if (!bookByBookId || bookByBookId.isDeleted) return res.status(404).send({ status: false, message: "Book not found" })

        let data = req.body

        if (Object.keys(data).length == 0 || Object.keys(data).length > 3) return res.status(400).send({ status: false, message: "req body is empty" })

        let { reviewedBy, rating, review } = data

        if (!reviewedBy) return res.status(400).send({ status: false, message: "reviewedBy is required" })
        if (!rating) return res.status(400).send({ status: false, message: "rating is required" })

        if (!validName(reviewedBy)) return res.status(400).send({ status: false, message: "invalid name" })
        if (!validRating(rating)) return res.status(400).send({ status: false, message: "invalid Rating" });
        if (!validName(review)) return res.status(400).send({ status: false, message: "invalid review" })

        let creatData = {
            reviewedBy: reviewedBy,
            rating: rating,
            review: review,
            reviewedAt: Date.now()
        }

        await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } })

        let saveddata = await reviewModel.create(creatData)
        return res.status(201).send({ status: true, data: saveddata })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}