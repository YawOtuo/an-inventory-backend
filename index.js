const express = require('express')
const app = express()
const models = require('./models')
const itemRoutes = require('./item/item.routes');
const inventoryRoutes = require('./inventory/routes');

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')


app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3002',
    'http://localhost:3001',
    "https://an-inventory.vercel.app"


  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Add other CORS headers if needed (e.g., for handling credentials)
  next();
});

require('dotenv').config();

app.use(express.json({ extended: false }))

app.use('/items', itemRoutes)

app.use('/inventories', inventoryRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

models.sequelize.sync().then((req) => {
  app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`)
  })
})

module.exports = app;



