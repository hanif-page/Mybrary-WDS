const express = require("express")
const router = express.Router()
const Author = require("../models/author")
const Book = require("../models/book")

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}  
    if(req.query.name != null && req.query.name !== "") {
        searchOptions.name = new RegExp(req.query.name.trim(), 'i')
    }

    try {
        // get all authors data, where {} mean is we want all the data inside without any condition
        const authors = await Author.find(searchOptions)

        // render from 'views' as root folder
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        // back to home page
        res.redirect("/")
    }
})

// New Authors Route 
router.get("/new", (req, res) => {
    // render from 'views' as root folder
    res.render("authors/new", { author: new Author()})
})

// Create Authors Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name,
        bookCount: 0 
    })

    // NOTE : all mongodb and mongoose action are asynchrounous, so it's a good thing to use async await and try catch method.
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`) // render from 'views' as root folder 
    } catch(err) {
        // render from 'views' as root folder
        res.render('authors/new', {
            author: author,
            errMsg: `Error creating author`
        })
    }

})

router.get("/:id", async (req, res) => {

    try {   
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()

        res.render(`authors/show`, { author: author, booksByAuthor: books })
    } catch {
        res.redirect("/")
    }

})

// the edit page
router.get("/:id/edit", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)

        // render from 'views' as root folder
        res.render("authors/edit", { author: author })
    } catch(err) {
        res.redirect("/authors")
    }   
    
})

// the action of edit page 
router.put("/:id", async (req, res) => {

    let author; 
    // NOTE : all mongodb and mongoose action are asynchrounous, so it's a good thing to use async await and try catch method.
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name // change the "name" data
        await author.save()
        res.redirect(`/authors/${author.id}`) // render from 'views' as root folder         
    } catch(err) {
        if(author == null) {
            res.redirect("/") 
        } else {
            // render from 'views' as root folder
            res.render('authors/new', {
                author: author,
                errMsg: `Error updating author`
            })
        }
    }
})

router.delete("/:id", async (req, res) => {

    let author; 
    // NOTE : all mongodb and mongoose action are asynchrounous, so it's a good thing to use async await and try catch method.
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`) // render from 'views' as root folder         
    } catch(err) {
        if(author == null) {
            res.redirect("/") 
        } else {
            // render from 'views' as root folder
            res.redirect(`/authors/${author.id}`)
        }
    }
})
 
module.exports = router

