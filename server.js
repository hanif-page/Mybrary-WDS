if(process.env.NODE_ENV !== "production") 
{
    require("dotenv").config()
}

const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")

// Import Router as middleware function
const indexRouter = require("./routes/index")
const authorRouter = require("./routes/authors")
const bookRouter = require("./routes/books")

// default setting
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

// connect to mongoose
const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection 
db.on('error', error => console.error(error))
db.once('open', () => console.log("connected to mongoose"))

// use the Route from the imported middleware function
app.use('/', indexRouter)
app.use("/authors", authorRouter)
app.use("/books", bookRouter)

// Handling non matching request from the client
// app.use((req, res, next) => {
//     res.status(404).send("<h1>404 Page Not Found</h1>")
// })

const port = process.env.PORT || 3000 
app.listen(port, () => console.log(`server running on port ${port}\nhttp://localhost:${port}`))