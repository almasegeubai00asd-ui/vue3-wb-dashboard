import express from 'express'
import axios from 'axios'

const router = express.Router()

// Базовый URL внешнего API
const BASE_URL = 'http://109.73.206.144:6969'

// API-ключ
const API_KEY = process.env.VITE_API_KEY || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

// Любой GET-запрос к /api/* будет проксироваться
router.use(async (req, res) => {
  try {
    // Формируем URL к реальному API
    const url = `${BASE_URL}${req.path}`

    // Пробрасываем query-параметры и ключ
    const params = { ...req.query, key: API_KEY }

    console.log('Proxying request to:', url, 'with params:', params)

    // GET-запрос к внешнему API
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
