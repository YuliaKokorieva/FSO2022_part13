const router = require('express').Router()
const {ReadingList} = require('../models')

router.post('/', async (req, res, next) => {
  try{
    const item = await ReadingList.create(req.body)
    res.json(item)
  } catch(error) {
    next(error)
  }
})

module.exports = router