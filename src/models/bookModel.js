const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const books = new mongoose.Schema({

    title: {
        type: String,
        unique: true,
        require: true,
        trim:true
    },
    excerpt: {
        type: String,
        require: true,
        trim:true
    },
    userId: {
        type: ObjectId,
        require: true,
        ref: "user"
    },
    ISBN: {
        type: String,
        require: true,
        unique: true
    },
    category: {
        type: String,
        require: true,
        trim:true
    },
    subcategory: {
        type: [String],
        require: true,
        trim:true
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: "",
    bookCover:String
}, { timestamps: true })

module.exports = mongoose.model("book", books)




