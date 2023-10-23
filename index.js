const express = require('express')
const app = express()
const models = require('./models')
const itemRoutes = require('./item/item.routes');
const inventoryRoutes = require('./inventory/routes');

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')


app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))



require('dotenv').config();

app.use(express.json({ extended: false }))

app.use('/items', itemRoutes)

app.use('/inventory', inventoryRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

models.sequelize.sync().then((req) => {
  app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`)
  })
})

module.exports = app;



