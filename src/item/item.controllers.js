const db = require('../../models');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');



// Access the Item model
const item = db.Item;

exports.getAllItems = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const offset = (page - 1) * perPage;

    item.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit: perPage,
        offset: offset,
    })
        .then((result) => {
            const { count, rows } = result;
            const totalPages = Math.ceil(count / perPage);

            res.json({
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                perPage: perPage,
                items: rows,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};


exports.getOneItem = (req, res) => {


    item.findByPk(req.params.id)
        .then((response) => {
            res.send(response);
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
    console.log(keyword)
    item.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${keyword}%` } }, // Use [Op.like] for case-insensitive search
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



exports.getItemsBelowRefillLimit = (req, res) => {
    const shopId = req.params.shopId

    const defaultRefillLimit = 5;

    item.findAll({
        where: {
            quantity: {
                [Op.lt]: Sequelize.fn('COALESCE', Sequelize.col('refill_count'), defaultRefillLimit)
            },
            shopId: shopId

        }
    })
        .then((items) => {
            res.status(200).json(items);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
};

