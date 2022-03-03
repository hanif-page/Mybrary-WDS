const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const Book = require("../models/book")
const mongoose = require("mongoose")
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const Author = require("../models/author")
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// All Books Route
router.get('/', async (req, res) => {
    let query = Book.find()
    if(req.query.title != null && req.query.title != ""){
        query = query.regex("title", new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ""){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ""){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try  
    {
        const books = await query.exec()
        res.render("books/index", { 
            books: books,
            searchOptions: req.query
        })
    }
    catch {res.redirect("/")}

    // res.send("All Books")
})

// New Book Route 
router.get("/new", async (req, res) => {
    // res.render("books/new")

    renderNewPage(res, new Book())

    // res.send("New Book")
})

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
    // res.render("books/index")

    const fileName = req.file != null ? req.file.filename : null
    // if(mongoose.Types.ObjectId.isValid(req.body.author)) {
    //     // insert the try catch here
    // } else res.send(`Author ID : ${req.body.author} not valid!`)

    const book = new Book({
        title: req.body.title,
        author: req.body.author.trim(),
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName, 
        description: req.body.description,
    })
    try
    {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`) // render from 'views' as root folder 
    }
    catch(err)  
    {
        if(book.coverImageName != null) removeBookCover(book.coverImageName)
        renderNewPage(res, book, true)
    }
})
 
function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false, errMsg = "Error Creating Book"){
    try 
    {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if(hasError) params.errMsg = errMsg
        res.render("books/new", params)
    }
    catch(err)
    {
        // use redirect to return 30x status code (often 302). The thing is, use redirect for navigate to another url, if there's an error.
        res.redirect("/books")
    }
}

module.exports = router

