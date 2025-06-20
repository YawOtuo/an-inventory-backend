// userController.js

const db = require('../../models');
const { Op } = require('sequelize');
const User = db.User
const UserController = {

    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Get user by ID
    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    async getUserByUid(req, res) {
        const { uid } = req.params;

        console.log(uid)
        try {
            const user = await User.findOne({ where: { uid } });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user by UID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    // Create a new user
    async createUser(req, res) {
        const userData = req.body;
        userData.acceptedIntoShop = false
        try {
            const newUser = await User.create(userData);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Update a user by ID
    async updateUser(req, res) {
        const { id } = req.params;
        const userData = req.body;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.update(userData);
            res.json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Delete a user by ID
    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.destroy();
            res.status(204).end(); // No content
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async acceptUser(req, res) {
        const { id } = req.params;
        try {
          const user = await User.findByPk(id);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          user.acceptedIntoShop = true;
          await user.save();
          res.json(user);
        } catch (error) {
          console.error('Error accepting user:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      },
    
      // De-accept a user from the shop
      async deacceptUser(req, res) {
        const { id } = req.params;
        try {
          const user = await User.findByPk(id);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          user.acceptedIntoShop = false;
          await user.save();
          res.json(user);
        } catch (error) {
          console.error('Error de-accepting user:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    
};

module.exports = UserController;
