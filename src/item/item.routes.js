const { getAllItems, addItem, searchItem, deleteItem, updateItem, getOneItem, getItemsBelowRefillLimit } = require("./item.controllers")
const express = require('express')


const router = express.Router()

router.get('', getAllItems)

router.get('/:id', getOneItem)

router.get('/op/below-optimum/shops/:shopId', getItemsBelowRefillLimit)



router.post('', addItem)

router.put('/:id', updateItem)

router.delete('/:id', deleteItem)

//search for an item

router.get('/search/search', searchItem)





module.exports = router;