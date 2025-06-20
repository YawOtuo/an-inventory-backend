const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/item.routes.js']

swaggerAutogen(outputFile, endpointsFiles)