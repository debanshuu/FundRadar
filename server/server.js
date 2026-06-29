import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fundRoutes from './routes/fundRoutes.js'
import overlapRoutes from './routes/overlapRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'MutualFundIQ API is running' })
})

app.use('/api/funds', fundRoutes)
app.use('/api/overlap', overlapRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})