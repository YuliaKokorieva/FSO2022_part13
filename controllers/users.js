const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  let  user=null
  if (req.query.read) {
    user = await User.findByPk(req.params.id,
      {
        include: {
          model: Blog,
          as: 'readings',
          attributes: {exclude: ['userId', 'createdAt', 'updatedAt']},
          through: {
            where: {read:req.query.read},
            attributes: ['id','read']
          },          
        },
      })

  } else {
    user = await User.findByPk(req.params.id,
      {
        include: {
          model: Blog,
          as: 'readings',
          attributes: {exclude: ['userId', 'createdAt', 'updatedAt']},
          through: {
            attributes: ['id','read']
          }
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })
  }
  

  if (user) {
    res.json(user)
  } else {
    res.status(404).send('No such user found').end()
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  console.log(`printing user to update: ${user.username}`)
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router