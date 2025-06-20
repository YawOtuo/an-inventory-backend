// Endpoint to get recently sold items
const db = require('../../models');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');


// Access the Item model
const item = db.Item;
const inventory = db.Inventory;
exports.getRecentlySoldItems = (req, res) => {
    const shopId = req.params.shopId
    inventory.findAll({
        where: {
            action: 'sell', // Assuming 'sold' is the action for selling an itemm
            shopId: shopId
        },
        order: [['createdAt', 'DESC']],
        include: [{
            model: item,
            attributes: ['id', 'name', 'quantity', 'category', 'createdAt'],
        }],
        limit: 10 // Limit the results to 10 items, you can adjust this number as needed
    })
        .then((recentlySoldItems) => {
            res.status(200).json(recentlySoldItems);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
};

// Endpoint to get recently refilled items
exports.getRecentlyRefilledItems = (req, res) => {
    const shopId = req.params.shopId

    inventory.findAll({
        where: {
            action: 'refill', // Assuming 'refilled' is the action for refilling an item
            shopId: shopId

        },
        include: [{
            model: item,
            attributes: ['id', 'name', 'quantity', 'category', 'createdAt'],
        }],
        order: [['createdAt', 'DESC']], // Order by creation date in descending order to get the most recent items first
        limit: 10 // Limit the results to 10 items, you can adjust this number as needed
    })
        .then((recentlyRefilledItems) => {
            res.status(200).json(recentlyRefilledItems);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
};


exports.searchInventory = async (req, res) => {
    const shopId = req.params.shopId

    try {
        const { qitem } = req.query;

        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 25;
        const offset = (page - 1) * perPage;

        const items = await item.findAll({
            where: {
                name: {
                    [Sequelize.Op.like]: `%${qitem}%`
                },
                shopId: shopId

            }
        });

        const itemIds = items.map(item => item.id);

        const { count, rows: inventories } = await inventory.findAndCountAll({
            where: {
                itemId: {
                    [Sequelize.Op.in]: itemIds
                }
            },
            order: [['createdAt', 'DESC']],

            include: [item],
            limit: perPage,
            offset: offset
        });

        // Formatting the response
        const formattedResponse = {
            totalItems: count,
            totalPages: Math.ceil(count / perPage),
            currentPage: page,
            perPage: perPage,
            items: inventories
        };

        res.json(formattedResponse);
    } catch (error) {
        console.error('Error searching inventory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getInventoryByItemId = async (req, res) => {
    try {
        const itemId = req.params.itemId; // Get 
        const results = await inventory.findAll({
            where: { itemId: itemId },
            include: [item],
            order: [['createdAt', 'DESC']],


            limit: 20,
        });


        const totalCount = await inventory.count({
            where: { itemId: itemId }
        });

        if (!results) {
            return res.status(404).json({ error: 'Inventory not found' });
        }


        res.json({ totalItems: totalCount, inventory: results });

    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
