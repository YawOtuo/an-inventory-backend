const db = require('../../models');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const User = db.User



// Access the Item model
const item = db.Item;
const inventory = db.Inventory;



exports.getAllInventoryByShop = (req, res) => {
    const shopId = req.params.shopId
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 25;
    const offset = (page - 1) * perPage;

    inventory.findAndCountAll({
        include: [{
            model: item,
            attributes: ['id', 'name', 'quantity', 'category', 'createdAt', 'image_url'],
        },
        {
            model: User, // Including the User model to get the user's name
            attributes: ['id', 'username'], // Specify that you want the user's ID and name
        }],
        order: [['createdAt', 'DESC']],

        limit: perPage,
        offset: offset,
        where :{
            shopId : shopId
        }
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










exports.getInventoryGeneralSums = (req, res) => {
    let today = new Date();
    const currentHour = today.getHours();

    // If the current hour is between 0 and 3 (exclusive), consider it as the previous day
    // if (currentHour >= 0 && currentHour < 3) {
    //     today.setDate(today.getDate() - 1);
    // }

    // Set start and end dates for the current day
    const startDateDay = new Date(today);
    startDateDay.setHours(0, 0, 0, 0); // Set the time to 00:00:00

    const endDateDay = new Date(today);
    endDateDay.setHours(23, 59, 59, 999); // Set the time to 23:59:59:999

    // Calculate start and end dates for the week
    const startDateWeek = new Date(today);
    startDateWeek.setDate(startDateWeek.getDate() - startDateWeek.getDay()); // Set to the first day of the week (Sunday)

    const endDateWeek = new Date(today);
    endDateWeek.setDate(startDateWeek.getDate() + 6); // Set to the last day of the week (Saturday)
    endDateWeek.setHours(23, 59, 59, 999);

    // Calculate start and end dates for the month
    const startDateMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDateMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endDateMonth.setHours(23, 59, 59, 999);

    // Queries to sum the 'cost' field for each period
    const daySumQuery = inventory.sum('cost', {
        where: {
            createdAt: {
                [Op.between]: [startDateDay, endDateDay]
            }
        }
    });

    const weekSumQuery = inventory.sum('cost', {
        where: {
            createdAt: {
                [Op.between]: [startDateWeek, endDateWeek]
            }
        }
    });

    const monthSumQuery = inventory.sum('cost', {
        where: {
            createdAt: {
                [Op.between]: [startDateMonth, endDateMonth]
            }
        }
    });

    // Execute all queries in parallel
    Promise.all([daySumQuery, weekSumQuery, monthSumQuery])
        .then(([daySum, weekSum, monthSum]) => {
            res.json({ daySum, weekSum, monthSum });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};

