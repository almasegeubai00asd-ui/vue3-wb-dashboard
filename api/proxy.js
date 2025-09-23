// api/proxy.js
import express from 'express'
import axios from 'axios'

const router = express.Router()

// Базовый URL твоего внешнего API
const BASE_URL = 'http://109.73.206.144:6969'

// API-ключ
const API_KEY = process.env.VITE_API_KEY || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

router.use(async (req, res) => {
  try {
    const url = `${BASE_URL}${req.path}`

    // Пробрасываем все query-параметры + добавляем ключ
    const params = { ...req.query, key: API_KEY }

    // GET-запрос к реальному API
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
