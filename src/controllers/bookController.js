const validation = require('../validation/validation')
const userModels = require('../models/userModel')
const bookModels = require('../models/bookModel')
const { isvalidObjectid, validName } = validation 

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


        if (validName(title)) return res.status(400).send({ status: false, msg: "invalid title" })

        if (validName(excerpt)) return res.status(400).send({ status: false, msg: "invalid excerpt" })

        if (validName(category)) return res.status(400).send({ status: false, msg: "invalid category" })
        

        if (isvalidObjectid(userId)) return res.status(400).send({ status: false, msg: "invalid userId" })
        if(validISBN(ISBN)){return res .status(400).send({status :false , msg:" please provide a valid ISBN"})}

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

