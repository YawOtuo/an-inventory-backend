const db = require('../models');

// Access the Item model
const item = db.Item;

exports.getAllItems = (req, res) => {
    item.findAll()
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

