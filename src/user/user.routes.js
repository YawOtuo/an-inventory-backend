// userRoutes.js
const express = require('express');
const UserController = require('./user.controller');
const router = express.Router();

// Routes for basic user operations
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

router.get('/:id/de-accept', UserController.deacceptUser);
router.get('/:id/accept', UserController.acceptUser);

router.get('/getUserByUid/:uid', UserController.getUserByUid);

router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
