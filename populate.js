require('dotenv').config()
const connectDB = require('./db/connect')

const Product = require('./models/product')

const products = require('./products.json')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await Product.deleteMany()
    await Product.create(products)
  } catch (error) {
    console.log(error)
  }
}

start()
