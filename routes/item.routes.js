const { getAllItems, addItem } = require("../controllers/item.controllers")
const express = require('express')
const router = express.Router()

router.get('', getAllItems)

router.post('', addItem)


module.exports = router;