const { getAllItems, addItem, searchItem, deleteItem, updateItem, getOneItem } = require("./item.controllers")
const express = require('express')


const router = express.Router()

router.get('', getAllItems)

router.get('/:id', getOneItem)


router.post('', addItem)

router.put('/:id', updateItem)

router.delete('/:id', deleteItem)

//search for an item

router.get('/search/search', searchItem)





module.exports = router;