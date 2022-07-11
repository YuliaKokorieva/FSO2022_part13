const express = require('express')
const app = express()
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

const errorHandler = (error, req, res, next) => {
  if (error.name==='SequelizeValidationError') {
    return res.status(400).send({error: error.message})
  } else if (error.name==="SequelizeDatabaseError") {
    return res.status(400).send(`Format error: check the format of likes. Error message: ${error.message}`)
  } 

  next(error)
}

app.use(errorHandler)

start()