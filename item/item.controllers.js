const db = require('../models');
const { Op } = require('sequelize');


// Access the Item model
const item = db.Item;

function paginate(data, page, perPage) {
    // Simulated data (replace with actual data source)
    const allData = data
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = allData.slice(startIndex, endIndex);
    return paginatedData;
}

exports.getAllItems = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 100;

    item.findAll()
        .then((response) => {
            res.send(paginate(response, page, perPage));
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Internal Server Error'); // Handle the error and send an appropriate response to the client
        });
};


exports.addItem = (req, res) => {
    const data = req.body
    item.create(data)
        .then((response) => {
            res.status(201).json(response)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Internal Server Error'); // Handle the error and send an appropriate response to the client
        });
};


exports.updateItem = (req, res) => {
    const itemId = req.params.id; // Extract the item ID from the request parameters
    const newData = req.body; // New data to update the item

    item.findByPk(itemId) // Assuming 'item' is your Sequelize model
        .then((existingItem) => {
            if (!existingItem) {
                return res.status(404).json({ error: 'Item not found' });
            }

            existingItem.update(newData)
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


exports.deleteItem = (req, res) => {
    const itemId = req.params.id; // Extract the item ID from the request parameters

    item.findByPk(itemId) // Assuming 'item' is your Sequelize model
        .then((existingItem) => {
            if (!existingItem) {
                return res.status(404).json({ error: 'Item not found' });
            }

            existingItem.destroy()
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






exports.searchItem = (req, res) => {
    const { keyword } = req.query; // Extract the search keyword from the query parameters

    item.findAll({
        where: {
            [Op.or]: [
                { type: { [Op.like]: `%${keyword}%` } }, // Use [Op.like] for case-insensitive search
                { description: { [Op.like]: `%${keyword}%` } }, // Use [Op.like] for case-insensitive search
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




