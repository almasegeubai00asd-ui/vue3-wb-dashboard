import express from 'express'
import axios from 'axios'

const router = express.Router()

// Внешний API без /api в конце
const BASE_URL = process.env.BACKEND_URL || 'http://109.73.206.144:6969'

// API-ключ
const API_KEY = process.env.VITE_API_KEY || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

// GET /api/* → проксируем
router.use(async (req, res) => {
  try {
    const url = `${BASE_URL}${req.path}` // /incomes, /orders и т.д.
    const params = { ...req.query, key: API_KEY }
    console.log('[Proxy] URL:', url)
    console.log('[Proxy] params:', params)
    console.log('[Proxy] GET', url, 'Params:', params)

    const response = await axios.get(url, { params })
    res.json(response.data)
  } catch (err) {
    console.error('[Proxy] Error:', err.response?.data || err.message)
    res.status(err.response?.status || 500).json({
      error: err.message,
      data: err.response?.data || null
    })
  }
})

export default router
