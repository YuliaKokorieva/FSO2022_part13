const { Session } = require('../models')

const router = require('express').Router()

router.delete('/', async (req,res) => {
  await Session.destroy({
    where: {
      user_id: req.body.userId
    }
  })
  res.status(204).send(`sessions for user ${req.body.userId} deleted`).end()
})

module.exports = router