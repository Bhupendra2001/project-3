const validation = require('../validation/validation')
const userModels = require('../models/userModel')
const bookModels = require('../models/bookModel')
const reviewModels = require("../models/reviewModel")
const { isvalidObjectid, validISBN, validName, validDate } = validation

const createBook = async (req, res) => {
    try {

        const data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Are ! All fields is mandatory" })

        if (!title) return res.status(400).send({ status: false, msg: "Oooh... title is mandatory" })
        if (!excerpt) return res.status(400).send({ status: false, msg: "Oooh... excerpt is mandatory" })
        if (!userId) return res.status(400).send({ status: false, msg: "Oooh... userId is mandatory" })
        if (!ISBN) return res.status(400).send({ status: false, msg: "Oooh... ISBN is mandatory" })
        if (!category) return res.status(400).send({ status: false, msg: "Oooh... category is mandatory" })
        if (!subcategory) return res.status(400).send({ status: false, msg: "Oooh... subcategory is mandatory" })
        if (!releasedAt) return res.status(400).send({ status: false, msg: "Oooh... releasedAt is mandatory" })


        if (!validName(title)) return res.status(400).send({ status: false, msg: "Oooh... invalid title" })

        if (!validName(excerpt)) return res.status(400).send({ status: false, msg: "Oooh... invalid excerpt" })

        if (!validName(category)) return res.status(400).send({ status: false, msg: "Oooh... invalid category" })


        if (!isvalidObjectid(userId)) return res.status(400).send({ status: false, msg: "Oooh... invalid userId" })
        if (!validISBN(ISBN)) { return res.status(400).send({ status: false, msg: "Oooh... please provide a valid ISBN" }) }

        const userID = await userModels.findOne({ userId })
        if (!userID) return res.status(404).send({ status: false, msg: "Oooh... user is not present in data" })

        const uniqeTitle = await bookModels.findOne({ title })
        if (uniqeTitle) return res.status(400).send({ status: false, msg: "Oooh... title should be unique" })
        const uniqeISBN = await bookModels.findOne({ ISBN })
        if (uniqeISBN) return res.status(400).send({ status: false, msg: "Oooh... ISBN should be unique" })

        const savaData = await bookModels.create(data);
        return res.status(201).send({ status: true, msg: "successfully created ", savaData })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const getbooks = async (req, res) => {

    try {
        let query = req.query

        let w = Object.keys(query)

        if (!["userId", "category", "subcategory"].includes(...w)) return res.status(400).send({ status: false, msg: "Oooh... query is wrong" })

        query.isDeleted = false

        const data = await bookModels.find(query).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })

        if (data.length == 0) return res.status(400).send({ status: false, msg: "Oooh... data not found" })

        return res.status(200).send({ status: true, message: "Books list", data: data })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}


const getbook = async (req, res) => {

    try {
        const bookId = req.params.bookId
        if (!isvalidObjectid(bookId)) return res.status(400).send({ status: false, msg: "Oooh... invalid bookId" })

        const Bookdata = await bookModels.findOne({ _id: bookId, isDeleted: false }).select({ ISBN: 0, __v: 0 })
        if (!Bookdata) return res.status(400).send({ status: false, msg: "Oooh... books is not found" })

        let review = await reviewModels.find({ bookId: bookId, isDeleted: false }).select({ isDeleted: 0 })

        let data1 = {
            status: true,
            msg: "Book List",
            data: Bookdata,
            reviewData: review
        }

        return res.status(200).send({ ...data1 })
    }
    catch (err) {
        return res.send(500).send({ status: false, msg: err.message })
    }
}

const updateBooks = async function (req, res) {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Areee... body should contain any title,excerpt,ISBN", });

        let bookId = req.params.bookId;
        if (!bookId) return res.status(400).send({ status: false, msg: "Oooo... id cant be empty" });
        if (!isvalidObjectid(bookId)) return res.status(400).send({ status: false, message: "Oooo...  not valid book id" });

        if (data.ISBN) {
            if (!validISBN(data.ISBN)) { return res.status(400).send({ status: false, msg: "Oooo...  please provide a valid ISBN" }) }
        }

        if (data.releasedAt) {
            if (!validDate(data.releasedAt)) return res.status(400).send({ status: false, message: "Oooo... Date should be in (YYYY-MM-DD) format", });
        }

        let validBookId = await bookModels.findOne({ _id: bookId });

        if (!validBookId || validBookId.isDeleted)
            return res.status(400).send({ status: false, msg: "Oooo... book not found" });


        if (validBookId.title == data.title || validBookId.ISBN == data.ISBN || validBookId.excerpt == data.excerpt || validBookId.releasedAt == data.releasedAt)
            return res.status(400).send({ status: false, msg: "Oooo... title or ISBN or releasedAt or excerpt are already present" })


        let valid = await bookModels.findOne({ $or: [{ title: data.title }, { ISBN: data.ISBN }] })
        if (valid) { return res.status(400).send({ status: false, message: "Oooo... title and ISBN should be unique" }) }

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

        return res.status(200).send({ status: true, message: 'Success', data: UpdateABook });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};


const bookDelete = async (req, res) => {

    try {
        let bookId = req.params.bookId;

        if (!bookId) return res.status(400).send({ status: false, message: "Oooo... please enter bookId" })

        if (!isvalidObjectid(bookId)) return res.status(400).send({ status: false, msg: "Oooo... bookId is not valid" })

        let book = await bookModels.findById(bookId)

        if (!book) return res.status(404).send({ status: true, message: "Oooo... Book not found" })

        if (book.isDeleted) { return res.status(400).send({ status: false, msg: "Oooo... book already deleted" }) }

        let book1 = await bookModels.findOneAndUpdate(
            { _id: bookId },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true });

        if (!book1) return res.status(404).send({ status: false, message: "Oooo... this is wrong id" })
        await reviewModels.updateMany({ bookId }, { isDeleted: true })
        return res.status(200).send({ status: true, message: "Book Deleted Successfully" })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};





module.exports = { getbooks, createBook, getbook, updateBooks, bookDelete }
