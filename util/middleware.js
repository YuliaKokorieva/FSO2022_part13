const jwt = require('jsonwebtoken')
const {SECRET} = require('../util/config')
const {Blog, Session} = require('../models')


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
  next()
}

const sessionCheck = async (req,res,next) => {
  const session = await Session.findAll({
    where: {
      token: req.get('authorization').substring(7)
    }
  })
  if (session.length>0) {
    req.validSession = true
  } else {
    res.status(401).send('Your session expired, you need to login')
  }
  next()
}

const blogFinder = async (req,res,next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}



module.exports={tokenExtractor, sessionCheck, blogFinder}