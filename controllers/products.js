const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30, $lt: 70 } })
  res.status(200).json(products)
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query
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

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '=': 'eq',
    }

    const regEx = /\b(<|<=|>|>=|=)\b/g

    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    )

    const options = ['price', 'rating']

    filters = filters.split(',').forEach((element) => {
      const [field, operator, value] = element.split('-')

      if (options.includes(field)) {
        if (queryObject.hasOwnProperty(field)) {
          queryObject[field] = {
            ...queryObject[field],
            [operator]: Number(value),
          }
        } else queryObject[field] = { [operator]: Number(value) }
      }
    })
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

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const products = await result
  res.status(200).json(products)
}

module.exports = { getAllProductsStatic, getAllProducts }
