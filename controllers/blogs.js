const router = require('express').Router()
const { Op } = require('sequelize')
const {Blog, User} = require('../models')
const {tokenExtractor, sessionCheck, blogFinder} = require('../util/middleware')


router.get('/', async (req, res) => {

  if (req.query.search) {
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where: {
        [Op.or]: {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          },
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      }, 
      order: [['likes', 'DESC']]
    })
    res.json(blogs)
  } else {
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      }, 
      order: [['likes', 'DESC']]
    })
    res.json(blogs)
  }
})

router.post('/', tokenExtractor, sessionCheck, async (req, res, next) => {
  try{
    if (req.validSession) {
      const user = await User.findByPk(req.decodedToken.id)
      const blog = await Blog.create({...req.body, userId: user.id})
      res.json(blog)          
    }
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

router.delete('/:id', blogFinder, tokenExtractor, sessionCheck, async (req, res) => {
  if (req.validSession) {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.blog) {
  
      if (user.id===req.blog.userId) {    
          await req.blog.destroy()
          res.status(204).end()
        } else {
          res.status(401).send("You don't have permission to delete this blog").end()
        }
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