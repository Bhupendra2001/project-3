const validation = require('../validation/validation')
const userModels = require('../models/userModel')
const bookModels = require('../models/bookModel')
const reviewModels = require("../models/reviewModel")
const { isvalidObjectid, validISBN, validName, validDate } = validation

exports.createBook = async (req, res) => {
    try {

        const data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "All fields is mandatory" })

        if (!title) return res.status(400).send({ status: false, msg: "title is mandatory" })
        if (!excerpt) return res.status(400).send({ status: false, msg: "excerpt is mandatory" })
        if (!userId) return res.status(400).send({ status: false, msg: "userId is mandatory" })
        if (!ISBN) return res.status(400).send({ status: false, msg: "ISBN is mandatory" })
        if (!category) return res.status(400).send({ status: false, msg: "category is mandatory" })
        if (!subcategory) return res.status(400).send({ status: false, msg: "subcategory is mandatory" })
        if (!releasedAt) return res.status(400).send({ status: false, msg: "releasedAt is mandatory" })


        if (!validName(title)) return res.status(400).send({ status: false, msg: "invalid title" })

        if (!validName(excerpt)) return res.status(400).send({ status: false, msg: "invalid excerpt" })

        if (!validName(category)) return res.status(400).send({ status: false, msg: "invalid category" })


        if (!isvalidObjectid(userId)) return res.status(400).send({ status: false, msg: "invalid userId" })
        if (!validISBN(ISBN)) { return res.status(400).send({ status: false, msg: " please provide a valid ISBN" }) }

        const userID = await userModels.findOne({ userId })
        if (!userID) return res.status(404).send({ status: false, msg: "user is not present in data" })

        const uniqeTitle = await bookModels.findOne({ title })
        if (uniqeTitle) return res.status(400).send({ status: false, msg: "title should be unique" })
        const uniqeISBN = await bookModels.findOne({ ISBN })
        if (uniqeISBN) return res.status(400).send({ status: false, msg: "ISBN should be unique" })



        const savaData = await bookModels.create(data);
        return res.status(201).send({ status: true, msg: "successfully created ", savaData })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

exports.getbooks = async (req, res) => {

    let query = req.query

    let w = Object.keys(query)

    if (!["userId", "category", "subcategory"].includes(...w)) return res.status(400).send({ msg: "query shoud be wrong" })

    quer.isDeleted = false

    const data = await bookModels.find(quer).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
    if (data.length == 0) return res.status(400).send({ status: false, msg: "data not found" })


    return res.status(200).send({ status: true, message: "Books list", data: data })

}




exports.getbook = async (req, res) => {

    const bookId = req.params.bookId
    if (!isvalidObjectid(bookId)) return res.status(400).send({ status: false, msg: "invalid bookId" })


    const data = await bookModels.findOne({ _id: bookId, isDeleted: false }).select({ ISBN: 0, __v: 0 })
    if (!data) return res.status(400).send({ status: false, msg: "books is not found" })

    let review = await reviewModels.find({ bookId: bookId, isDeleted: false }).select({ isDeleted: 0 })

    let datar = {
        status: true,
        msg: "Book List",
        data: data,
        reviewData: []
    }

    if (review.length == 0) return res.status(200).send({ data: datar })

    let data2 = {
        status: true,
        msg: "Book List",
        data: data,
        reviewData: review
    }


    if (review.length > 0) return res.status(200).send({ msg: data2 })

}

exports.updateBooks = async function (req, res) {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "body should contain any title,excerpt,ISBN", });

        let bookId = req.params.bookId;
        if (!bookId) return res.status(400).send({ status: false, msg: "id cant be empty" });
        if (!isvalidObjectid(bookId)) return res.status(400).send({ status: false, message: "not valid book id" });

        if (data.ISBN) {
            if (!validISBN(data.ISBN)) { return res.status(400).send({ status: false, msg: " please provide a valid ISBN" }) }
        }

        if (data.releasedAt) {
            if (!validDate(data.releasedAt)) return res.status(400).send({ status: false, message: "Date should be in (YYYY-MM-DD) format", });
        }

        let validBookId = await bookModels.findOne({ _id: bookId });

        if (!validBookId || validBookId.isDeleted)
            return res.status(400).send({ status: false, msg: "book not found" });


        if (validBookId.title == data.title || validBookId.ISBN == data.ISBN || validBookId.excerpt == data.excerpt || validBookId.releasedAt == data.releasedAt)
            return res.status(400).send({ status: false, msg: "title or ISBN or releasedAt or excerpt are already present" })


        let valid = await bookModels.findOne({ $or: [{ title: data.title }, { ISBN: data.ISBN }] })
        if (valid) { return res.status(400).send({ status: false, message: "title and ISBN should be unique" }) }

        let UpdateABook = await bookModels.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            {
                $set: {
                    title: data.title,
                    excerpt: data.excerpt,
                    ISBN: data.ISBN,
                    releasedAt: data.releasedAt,
                    updatedAt: Date.now()
                },
            },
            { new: true }
        );

        return res.status(200).send({ status: true, data: UpdateABook });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};


exports.bookDelete = async (req, res) => {

    try {
        let bookId = req.params.bookId;

        if (!bookId) return res.status(400).send({ status: false, message: "please enter bookId" })

        if (!isvalidObjectid(bookId)) return res.status(400).send({ status: false, msg: "bookId is not valid" })

        let book = await bookModels.findById(bookId)

        if (!book) return res.status(404).send({ status: true, message: "Book not found" })

        if (book.isDeleted) { return res.status(400).send({ status: false, msg: "book already deleted" }) }

        let book1 = await bookModels.findOneAndUpdate(
            { _id: bookId},
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true });

        if (!book1) return res.status(404).send({ message: "this is wrong id" })
        res.status(200).send({ status: true, message: "Book Deleted Successfully", data: book1 });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message, message: " server error" });
    }
};




