const { getAllItems, addItem, searchItem, deleteItem, updateItem } = require("./item.controllers")
const express = require('express')


const router = express.Router()

router.get('', getAllItems)

router.post('', addItem)

router.put('/:id', updateItem)

router.delete('/:id', deleteItem)

//search for an item

router.get('/search', searchItem)





module.exports = router;