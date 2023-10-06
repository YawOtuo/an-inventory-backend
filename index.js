const express = require('express')
const app = express()
const models = require('./models')
const itemRoutes = require('./routes/item.routes')

require('dotenv').config();

app.use(express.json({ extended: false }))

app.use('/items', itemRoutes)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

models.sequelize.sync().then((req) => {
  app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`)
  })
})

module.exports = app;



