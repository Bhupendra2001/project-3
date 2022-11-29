const jwt = require("jsonwebtoken")
const { isValidObjectId } = require('mongoose')
const bookModel = require("../models/bookModel")

exports.Authentication = async (req, res, next) => {

    try{ const hedear = req.hedear["x-Api-key"]
    if (!hedear) res.status(400).send({ status: false, msg: "Hedear is not present" })

      jwt.verify(hedear, "group40", function (err, decode) {
        if (err) {
            return res.status(401).send({ status: false, msg: "token is invalid." })
        }
        else {
            req.token = decode.userId
            next()
        }
    })}
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
     }


exports.Authrization = async (req, res, next) => {
try{
    let bookId = req.params.bookId
    if (!bookId) return res.status(400).send({ status: false, msg: "bookId is not present in params" })

    if (!isValidObjectId(bookId)) return res.status(401).send({ status: false, msg: "bookId is not valid" })

    let book = await bookModel.findOne({ _id: bookId,isDeleted:false})
    if (!book) return res.status(400).send({ status: false, msg: "book is not present" })

    if (book.userId !=req.token) { return res.status(403).send({ status: false, msg: "user is not Authrization" })}

    next()

}catch(err){
return res.status(500).send({status:false,msg:err.message})
}
 
}