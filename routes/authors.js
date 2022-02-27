const express = require("express")
const router = express.Router()
const Author = require("../models/author")

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}  
    if(req.query.name != null && req.query.name !== "") {
        searchOptions.name = new RegExp(req.query.name, 'i')
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
        name: req.body.name 
    })

    // NOTE : all mongodb and mongoose action are asynchrounous, so it's a good thing to use async await and try catch method.
    try {
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        
        res.redirect(`authors`) // render from 'views' as root folder 
    } catch(err) {
        // render from 'views' as root folder
        res.render('authors/new', {
            author: author,
            errMsg: `Error creating author`
        })
    }

})
 
module.exports = router

