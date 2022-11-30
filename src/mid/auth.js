const jwt = require("jsonwebtoken")
const { isValidObjectId } = require('mongoose')
const bookModel = require("../models/bookModel")

const Authentication = async (req, res, next) => {
    try {
        const hedear = req.headers["x-api-key"]

        if (!hedear) return res.status(400).send({ status: false, msg: "Dost... header is not present" })

        jwt.verify(hedear, "group40", function (err, token) {
            if (err) {
                return res.status(401).send({ status: false, msg: "Dost... Token is invalid Or Token has been Expired" })
            }
            else {
                req.userId = token.userId
                next()
            }
        })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


const Authrization = async (req, res, next) => {
    try {
        const userId = req.userId
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, msg: "Oooh... bookId is not present in params" })

        if (!isValidObjectId(bookId)) return res.status(401).send({ status: false, msg: "!Aree... bookId is not valid" })

        let bookData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookData) return res.status(400).send({ status: false, msg: "Ooh.. book is not present" })

        if (bookData.userId != userId) { return res.status(403).send({ status: false, msg: "Oooh... you are not Authrization" }) }

        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}

module.exports = { Authentication, Authrization }