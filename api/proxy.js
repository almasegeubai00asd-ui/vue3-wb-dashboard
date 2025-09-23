// api/proxy.js
import express from 'express'
import axios from 'axios'

const router = express.Router()

// Базовый URL твоего внешнего API
const BASE_URL = 'http://109.73.206.144:6969'

// API-ключ (можно вынести в .env)
const API_KEY = process.env.VITE_API_KEY || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

// Любой GET-запрос на /api/... будет проксироваться
router.get('/*', async (req, res) => {
  try {
    // Формируем полный URL для внешнего API
    const url = `${BASE_URL}${req.path}`

    // Пробрасываем все query-параметры + добавляем ключ
    const params = { ...req.query, key: API_KEY }

    // GET-запрос к реальному API
    const response = await axios.get(url, { params })

    // Возвращаем результат клиенту
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
