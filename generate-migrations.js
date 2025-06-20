const SequelizeAutoMigrations = require('sequelize-auto-migrations');
const path = require('path');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');

// Configure your Sequelize instance
const sequelize = new Sequelize({
  dialect: 'mysql', // Your database dialect
  host: 'localhost', // Your database host
  username: 'yourusername', // Your database username
  password: 'yourpassword', // Your database password
  database: 'yourdatabase', // Your database name
});

// Initialize SequelizeAutoMigrations
const migrations = new SequelizeAutoMigrations(sequelize);

// Specify the directory where your models are located
const modelsDir = path.join(__dirname, 'models');

// Specify the directory where you want to store the generated migrations
const migrationsDir = path.join(__dirname, 'migrations');

// Generate migrations based on your models
migrations
  .migrate({
    modelsDir,
    migrationsDir,
  })
  .then(() => {
    console.log('Migrations generated successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error generating migrations:', err);
    process.exit(1);
  });
