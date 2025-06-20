// shopRoutes.js
const express = require('express');
const ShopController = require('./shop.controller');
const router = express.Router();

// Routes for basic shop operations
router.get('/', ShopController.getAllShops);
router.get('/:id', ShopController.getShopById);
router.post('/', ShopController.createShop);
router.put('/:id', ShopController.updateShop);
router.delete('/:id', ShopController.deleteShop);
router.get('/verify/:name', ShopController.verifyShopByName);



// Route to get all users belonging to a shop
router.get('/:shopId/users', ShopController.getShopUsers);
router.get('/:shopId/users/accepted/yes', ShopController.getShopAcceptedUsers);
router.get('/:shopId/users/accepted/no', ShopController.getShopUnacceptedUsers);


module.exports = router;
