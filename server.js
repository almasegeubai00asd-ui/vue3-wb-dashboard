import express from 'express'
import path from 'path'
import proxy from './api/proxy.js'

const app = express()
const PORT = process.env.PORT || 3000

// Подключаем статическую папку SPA
app.use(express.static(path.join(__dirname, 'dist')))

// Для JSON тела в POST/PUT запросах
app.use(express.json())

// Проксируем все /api запросы через proxy.js
app.use('/api', proxy)

// Для SPA: отдаём index.html на все остальные маршруты
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
