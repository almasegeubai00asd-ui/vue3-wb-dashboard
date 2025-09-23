import express from 'express'
import axios from 'axios'

const router = express.Router()

// Внешний API без /api на конце
const BASE_URL = process.env.BACKEND_URL || 'http://109.73.206.144:6969'

// API-ключ
const API_KEY = process.env.VITE_API_KEY || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

// Любой GET-запрос к /api/* проксируем
router.use(async (req, res) => {
  try {
    // req.path = /orders, /sales и т.д.
    const url = `${BASE_URL}${req.path}`

    // Пробрасываем все query-параметры + добавляем ключ
    const params = { ...req.query, key: API_KEY }

    console.log('Proxying request to:', url, 'with params:', params)

    const response = await axios.get(url, { params })
    res.json(response.data)
  } catch (err) {
    console.error('Proxy error:', err.response?.data || err.message)
    res.status(err.response?.status || 500).json({
      error: err.message,
      data: err.response?.data || null
    })
  }
})

export default router
