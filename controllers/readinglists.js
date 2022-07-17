const router = require('express').Router()
const {ReadingList, User} = require('../models')
const { tokenExtractor, sessionCheck } = require('../util/middleware')

const readinglistitemFinder = async (req,res,next) => {
  req.readinglistitem = await ReadingList.findByPk(req.params.id)
  next()
}

router.post('/', async (req, res, next) => {
  try{
    const item = await ReadingList.create(req.body)
    res.json(item)
  } catch(error) {
    next(error)
  }
})

router.get('/', async(req,res,next) => {
  const readinglists = await ReadingList.findAll()
  res.json(readinglists)
})

router.put('/:id', tokenExtractor, readinglistitemFinder, sessionCheck, async(req,res,next) => {
  if (req.validSession) {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.readinglistitem) {
      if (user.id === req.readinglistitem.userId) {
        req.readinglistitem.read = req.body.read
        await req.readinglistitem.save()
        res.json(req.readinglistitem)
  
      } else {
        res.status(401).send("You don't have permission to modify this readinglist item")
      }
    } else {
      res.status(404).end()
    }
  }
})

module.exports = router