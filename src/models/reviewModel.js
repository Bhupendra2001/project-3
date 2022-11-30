const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const review = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: "book",
        require: true
    },
    reviewedBy: {
        type: String,
        default: "Guest"
    },
    reviewedAt: {
        type: Date,
        require: true
    },
    rating: {
        type: Number,
        require: true
    },
    review: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timeStamp: true })

module.exports = mongoose.model("review", review)