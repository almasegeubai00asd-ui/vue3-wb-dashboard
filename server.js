import express from 'express'
import path from 'path'
import proxy from './api/proxy.js'

const app = express()
const PORT = process.env.PORT || 3000

// Статика Vue (dist) — без /api
app.use(express.static(path.join(process.cwd(), 'dist')))

// Для POST/PUT (если нужно)
app.use(express.json())

// SPA fallback: все остальные маршруты → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
