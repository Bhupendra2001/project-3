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
            bookId:bookId,
            reviewedBy: reviewedBy,
            reviewedAt: Date.now(),
            rating: rating,
            review: review
            
        }

        await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } })

        let saveddata = await reviewModel.create(creatData)
        return res.status(201).send({ status: true, data: saveddata })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


exports.updateReview=async (req,res)=>{
try{
let params1=req.params.bookId
let params2=req.params.reviewId
let body=req.body
let bodydata=Object.keys(body)

if(params1==undefined|| params2==undefined|| Object.keys(body).length==0 || Object.keys(body).length>3) return res.status(400).send({status:false,msg:"Oooh Something is missing"})
if(!["reviewedBy","rating","review"].includes(...bodydata)) return res.status(400).send({status:false,msg:"req.body is wrong"})

if(!isvalidObjectid(params1)|| !isvalidObjectid(params2)) return res.status(400).send({status:false,msg:"! blogId or review are wrong"})

let book =await bookModel.findOne({_id:params1, isDeleted:false})
if (!book){
    return res.status(400).send({status:false,msg:"Oooh... Book is not present"})
}
let review=await reviewModel.findOne({_id:params2,isDeleted:false})
if(!review){
    return res.status(400).send({status:false, msg:"Oooh... review is not present"})
}
if(review.bookId=!params1)return res.status(401).send({status:false,msg:"Oooh... bookId is not maching from blog"})

let updateReview= await reviewModel.findOneAndUpdate({_id:review},{

    $set:{
"reviewedBy":body.reviewedBy,
"rating":body.rating,
"review":body.review,
"reviewedAt": Date.now()
    }

} ,{new:true}

)
return res.status(201).send({status:true,msg:updateReview})
}
catch(err){
    return res.status(500).send({status:false,msg:err.message})
}

}
