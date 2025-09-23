import express from 'express'
import axios from 'axios'

const router = express.Router()

// Базовый URL вашего внешнего API
const BASE_URL = 'http://109.73.206.144:6969'

// API-ключ (берется из .env или дефолтный)
const API_KEY = process.env.VITE_API_KEY || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

// Любой GET-запрос к /api/* будет проксироваться на внешний API
router.use(async (req, res) => {
  try {
    const url = `${BASE_URL}${req.path}`

    // Передаем все query-параметры + добавляем ключ
    const params = { ...req.query, key: API_KEY }

    const response = await axios.get(url, { params })
    res.json(response.data)
  } catch (err) {
    console.error('Proxy error:', err.message)
    res.status(err.response?.status || 500).json({
      error: err.message,
      data: err.response?.data || null
    })
  }
})

export default router
