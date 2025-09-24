import express from 'express'
import axios from 'axios'

const router = express.Router()

const BASE_URL = process.env.BACKEND_URL || 'https://109.73.206.144:6969'
const API_KEY = process.env.VITE_API_KEY || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

router.get('/*', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const params = {
      ...req.query,
      key: API_KEY,
      dateFrom: req.query.dateFrom || today,
      dateTo: req.query.dateTo || today
    }
    const url = `${BASE_URL}${req.path}`
    console.log('Proxying:', url, params)
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
