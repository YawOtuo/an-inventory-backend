const express = require('express')
const { getAllInventory, addInventory, updateInventory, deleteInventory, searchInventory } = require('./controllers')


const router = express.Router()

router.get('', getAllInventory)

router.post('', addInventory)

router.put('/:id', updateInventory)

router.delete('/:id', deleteInventory)

//search for an item

router.get('/search', searchInventory)





module.exports = router;