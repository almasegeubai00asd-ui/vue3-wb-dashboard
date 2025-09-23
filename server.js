import express from 'express'
import path from 'path'
import proxyRouter from './proxy.js'

const app = express()

// Фронтенд статика
app.use(express.static(path.join(process.cwd(), 'dist')))

// Прокси для API
app.use('/api', proxyRouter)

// Все остальное отдаём фронтенду
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist/index.html'))
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started')
})
