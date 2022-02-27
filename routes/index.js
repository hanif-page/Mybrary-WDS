const express = require("express")
const router = express.Router()

router.get('/', (req, res) => {
    // render from views ('views' as root folder, base on the server.js setting)
    res.render('index')
})

module.exports = router