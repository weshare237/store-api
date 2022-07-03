const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ featured: true })
  res.status(200).json(products)
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query
  const queryObject = {}

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }
  if (company) {
    queryObject.company = company
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }

  let result = Product.find(queryObject)
  if (sort) {
    const sortList = sort.split(',').join(' ')
    result.sort(sortList)
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    result.select(fieldsList)
  }

  const products = await result
  res.status(200).json(products)
}

module.exports = { getAllProductsStatic, getAllProducts }
