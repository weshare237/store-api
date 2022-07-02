const express = require('express')
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middleware/error-handler')
const app = express()
const port = process.env.PORT || 5000
const notFound = require('./middleware/not-found')
require('dotenv').config()
require('express-async-errors')
const productsRouter = require('./routes/products')

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})

app.use('/api/v1/products', productsRouter)

app.use(notFound)

app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

start()
