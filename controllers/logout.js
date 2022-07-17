const { Session, User } = require('../models')
const router = require('express').Router()

router.delete('/', async (req,res) => {
  const sessions = await Session.findAll({
    where: {
      user_id: req.body.userId
    }
  })

  if (sessions.length>0) {
    await Session.destroy({
      where: {
        user_id: req.body.userId
      }
    }) 
    const user = await User.findByPk(req.body.userId)
    user.disabled = true
    await user.save()
    res.status(200).send(`sessions for user ${req.body.userId} deleted`).end()

  } else {
    res.status(404).send(`User ${req.body.userId} not found`)
  }
})

module.exports = router