const express = require("express")
const router = express.Router()
const Book = require("../models/book")

router.get('/', async (req, res) => {
    let books;
    try 
    {
        books = await Book.find().sort({ createdAt: "desc" }).limit(10).exec()
    }
    catch(err)
    {
        books = []
    }

    // render from views ('views' as root folder, base on the server.js setting)
    res.render('index', { books: books })
})

module.exports = router