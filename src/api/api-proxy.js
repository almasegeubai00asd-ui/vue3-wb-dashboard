import axios from 'axios'

export default async function handler(req, res) {
  const { endpoint, ...query } = req.query
  const token = process.env.VITE_API_KEY

  if (!endpoint) {
    res.status(400).json({ error: 'Missing endpoint parameter' })
    return
  }

  try {
    const response = await axios.get(`http://109.73.206.144:6969/api/${endpoint}`, {
      params: { ...query, key: token, limit: 500 }
    })
    res.status(200).json(response.data)
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message })
  }
}