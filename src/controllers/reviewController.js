const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel')


const { validRating, validName, isvalidObjectid } = require("../validation/validation")

const createReview = async function (req, res) {

    try {

        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: "Oooh... bookID should be present" });
        if (!isvalidObjectid(bookId)) return res.status(400).send({ status: false, message: "Oooh... invalid userId" });

        let bookByBookId = await bookModel.findById(bookId)
        if (!bookByBookId || bookByBookId.isDeleted) return res.status(404).send({ status: false, message: "Oooh... Book not found" })

        let data = req.body

        if (Object.keys(data).length == 0 || Object.keys(data).length > 4) return res.status(400).send({ status: false, message: "Oooh... req body is empty" })

        let { reviewedBy, rating, review } = data

        if (!rating) return res.status(400).send({ status: false, message: "Oooh... rating is required" })

        if (!validName(reviewedBy)) return res.status(400).send({ status: false, message: "Oooh... invalid name" })
        if (!validRating(rating)) return res.status(400).send({ status: false, message: "Oooh... invalid Rating" });
        if (!validName(review)) return res.status(400).send({ status: false, message: "Oooh... invalid review" })

        let creatData = {
            bookId: bookId,
            reviewedBy: reviewedBy,
            reviewedAt: Date.now(),
            rating: rating,
            review: review
        }

        const bookdata = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }) 
       if(bookdata.isDeleted)return res.status(400).send({status:false,msg:"book is already deleted"})

        let saveddata = await reviewModel.create(creatData)

        let data2 = {
            ...bookdata._doc,
            reviewData: saveddata
        }

        return res.status(201).send({ status: true, msg: "review added successfully", Data: data2 })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


const updateReview = async (req, res) => {
    try {
        let params1 = req.params.bookId
        let params2 = req.params.reviewId
        let body = req.body
        let bodydata = Object.keys(body)

        if (params1 == undefined || params2 == undefined || Object.keys(body).length == 0 || Object.keys(body).length > 3) return res.status(400).send({ status: false, msg: "Oooh Something is missing" })
        if (!["reviewedBy", "rating", "review"].includes(...bodydata)) return res.status(400).send({ status: false, msg: "Oooh... request body is wrong" })

        if (!isvalidObjectid(params1) || !isvalidObjectid(params2)) return res.status(400).send({ status: false, msg: "Oooh... blogId or review are wrong" })

        let book = await bookModel.findOne({ _id: params1, isDeleted: false })
        if (!book) {
            return res.status(400).send({ status: false, msg: "Oooh... Book is not present" })
        }
        let review = await reviewModel.findOne({ _id: params2, isDeleted: false })
        if (!review) {
            return res.status(400).send({ status: false, msg: "Oooh... review is not present" })
        }
        if (review.bookId != params1) return res.status(401).send({ status: false, msg: "Oooh... bookId is not maching from blog" })

        let updateReview = await reviewModel.findOneAndUpdate({ _id: review }, {

            $set: {
                "reviewedBy": body.reviewedBy,
                "rating": body.rating,
                "review": body.review,
                "reviewedAt": Date.now()
            }

        }, { new: true }

        )
        return res.status(201).send({ status: true, Data: updateReview })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}


const deleteReview = async (req, res) => {
    try {

        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        if (!bookId) return res.status(400).send({ status: false, message: "Oooh... bookID should be present" })
        if (!reviewId) return res.status(400).send({ status: false, message: "Oooh... reviewId should be present" })
        if (!isvalidObjectid(bookId)) return res.status(400).send({ status: false, message: "Oooh... invalid bookId" })
        if (!isvalidObjectid(reviewId)) return res.status(400).send({ status: false, message: "Oooh... invalid reviewId" })


        let books_find = await bookModel.findById(bookId)
        if (!books_find || books_find.isDeleted) return res.status(404).send({ status: false, message: "Oooh... Book not found" })
        let review_find = await reviewModel.findById(reviewId)
        if (!review_find || review_find.isDeleted) return res.status(404).send({ status: false, message: "Oooh... Review not found or Riview is Deleted" })

        if (review_find.bookId != bookId) return res.status(401).send({ status: false, msg: "Oooh... bookId is not maching from books" })

        const review = await reviewModel.findOneAndUpdate(
            { _id: reviewId },
            { $set: { isDeleted: true } },
            { new: true });

        await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })

        return res.status(201).send({ status: true, data: review })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports = { createReview, updateReview, deleteReview }