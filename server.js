import express from 'express'
import path from 'path'
import proxy from './api/proxy.js'

const app = express()
const PORT = process.env.PORT || 3000

// Раздаём статику
app.use(express.static(path.join(process.cwd(), 'dist')))

// Проксируем /api → внешний API
app.use('/api', proxy)

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
