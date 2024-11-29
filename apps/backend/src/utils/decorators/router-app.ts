import express from 'express'

const globalRouter = express.Router()

globalRouter.get('/test', (req, res) => {
  res.json({ message: 'test' })
})

export { globalRouter }
