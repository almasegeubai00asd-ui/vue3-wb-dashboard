import express from 'express'
import axios from 'axios'

const router = express.Router()

const BASE_URL = process.env.BACKEND_URL || 'http://109.73.206.144:6969'
const API_KEY = process.env.VITE_API_KEY

router.use(async (req, res) => {
  try {
    const url = `${BASE_URL}${req.path}`

    const params = { ...req.query }
    if (API_KEY) params.key = API_KEY

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
