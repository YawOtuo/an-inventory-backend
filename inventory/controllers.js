const db = require('../models');
const { Op } = require('sequelize');


// Access the Item model
const item = db.Item;
const inventory = db.Inventory;


function paginate(data, page, perPage) {
    const allData = data
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = allData.slice(startIndex, endIndex);
    return paginatedData;
}

exports.getAllInventory = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 100;

    inventory.findAll({
        include: [{
            model: item,
            attributes: ['id', 'name', 'quantity','category'], // Specify the attributes you want to retrieve from the Item model
        }],
    })
        .then((response) => {
            res.send(paginate(response, page, perPage));
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};


exports.addInventory = (req, res) => {
    const data = req.body
    inventory.create(data)
        .then((response) => {
            res.status(201).json(response)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Internal Server Error'); // Handle the error and send an appropriate response to the client
        });
};


exports.updateInventory = (req, res) => {
    const id = req.params.id; // Extract the item ID from the request parameters
    const newData = req.body; // New data to update the item

    inventory.findByPk(id) // Assuming 'item' is your Sequelize model
        .then((eixisingInventoryRecord) => {
            if (!eixisingInventoryRecord) {
                return res.status(404).json({ error: 'Item not found' });
            }

            eixisingInventoryRecord.update(newData)
                .then((updatedItem) => {
                    res.status(200).json(updatedItem);
                })
                .catch((updateError) => {
                    console.error(updateError);
                    res.status(500).send('Internal Server Error');
                });
        })
        .catch((findError) => {
            console.error(findError);
            res.status(500).send('Internal Server Error');
        });
};


exports.deleteInventory = (req, res) => {

    const id = req.params.id; // Extract the item ID from the request parameters

    inventory.findByPk(id) // Assuming 'item' is your Sequelize model
        .then((eixisingInventoryRecord) => {
            if (!eixisingInventoryRecord) {
                return res.status(404).json({ error: 'Item not found' });
            }

            eixisingInventoryRecord.destroy()
                .then(() => {
                    res.status(204).end(); // Respond with a 204 (No Content) status to indicate successful deletion
                })
                .catch((deleteError) => {
                    console.error(deleteError);
                    res.status(500).send('Internal Server Error');
                });
        })
        .catch((findError) => {
            console.error(findError);
            res.status(500).send('Internal Server Error');
        });
};






exports.searchInventory = (req, res) => {
    const { keyword } = req.query; // Extract the search keyword from the query parameters

    inventory.findAll({
        where: {
            [Op.or]: [
                { action: { [Op.like]: `%${keyword}%` } }, // Use [Op.like] for case-insensitive search
                { price: { [Op.like]: `%${keyword}%` } }, // Use [Op.like] for case-insensitive search
                { quantity: { [Op.like]: `%${keyword}%` } }, // Use [Op.like] for case-insensitive search

            ],
        },
    })
        .then((searchResults) => {
            res.status(200).json(searchResults);
        })
        .catch((searchError) => {
            console.error(searchError);
            res.status(500).send('Internal Server Error');
        });
};




