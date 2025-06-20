const db = require('../../models');
const { Op } = require('sequelize');
const Shop = db.Shop
const User = db.User

const ShopController = {
    // Get all shops
    async getAllShops(req, res) {
        try {
            const shops = await Shop.findAll();
            res.json(shops);
        } catch (error) {
            console.error('Error fetching shops:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Get shop by ID
    async getShopById(req, res) {
        const { id } = req.params;
        try {
            const shop = await Shop.findByPk(id);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            res.json(shop);
        } catch (error) {
            console.error('Error fetching shop by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Create a new shop
    async createShop(req, res) {
        const shopData = req.body;
        try {
            const newShop = await Shop.create(shopData);
            res.status(201).json(newShop);
        } catch (error) {
            console.error('Error creating shop:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Update a shop by ID
    async updateShop(req, res) {
        const { id } = req.params;
        const shopData = req.body;
        try {
            const shop = await Shop.findByPk(id);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            await shop.update(shopData);
            res.json(shop);
        } catch (error) {
            console.error('Error updating shop:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Delete a shop by ID
    async deleteShop(req, res) {
        const { id } = req.params;
        try {
            const shop = await Shop.findByPk(id);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            await shop.destroy();
            res.status(204).end(); // No content
        } catch (error) {
            console.error('Error deleting shop:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Get all users belonging to a shop
    async getShopUsers(req, res) {
        const { shopId } = req.params;
        try {
            const users = await User.findAll({ where: { shopId } });
            res.json(users);
        } catch (error) {
            console.error('Error fetching shop users:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    // Get all users belonging to a shop
    async getShopAcceptedUsers(req, res) {
        const { shopId } = req.params;
        try {
            const users = await User.findAll({
                where: {
                    shopId,
                    acceptedIntoShop: true // Filter users where acceptedIntoShop is true

                }
            });

            res.json(users);
        } catch (error) {
            console.error('Error fetching shop users:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    // Get all users belonging to a shop
    async getShopUnacceptedUsers(req, res) {
        const { shopId } = req.params;
        try {
            const users = await User.findAll({
                where: {
                    shopId,
                    acceptedIntoShop: false // Filter users where acceptedIntoShop is true

                }
            });
            res.json(users);
        } catch (error) {
            console.error('Error fetching shop users:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    // Verify if a shop exists by name
    async verifyShopByName(req, res) {
        const { name } = req.params;
        try {
            const shop = await Shop.findOne({ where: { name } });
            if (shop) {
                return res.json(shop);
            } else {
                return res.json({ exists: false, message: 'Shop does not exist in the database' });
            }
        } catch (error) {
            console.error('Error verifying shop:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

};

module.exports = ShopController;
