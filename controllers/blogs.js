const router = require('express').Router()
const jwt = require('jsonwebtoken')
const {Blog, User} = require('../models')
const {SECRET} = require('../util/config')
const { Op } = require('sequelize')

const blogFinder = async (req,res,next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const tokenExtractor = (req, res, next) => {  
  const authorization = req.get('authorization')  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {    
    try {      
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)    
    } catch{      
      res.status(401).json({ error: 'token invalid' })   
     }  
    }  else {    
      res.status(401).json({ error: 'token missing' })  
    }  
  next()}

router.get('/', async (req, res) => {
  const where ={}

  if (req.query.search) {
    where.title = {
      [Op.substring]: req.query.search
    }
  }
  console.log(where)
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try{
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
    res.json(blog)    
  } catch(error) {
    next(error)
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (req.blog) {

    if (user.id===req.blog.userId) {    
        await req.blog.destroy()
        res.status(204).end()
      } else {
        res.status(401).send("You don't have permission to delete this blog").end()
      }
  }

})

router.put('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    try {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
    } catch (error) {
      next(error)
    }
  } else {
    res.status(404).end()
  }
})



module.exports = router