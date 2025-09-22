import axios from 'axios'

// Базовый клиент с API-ключом
const client = axios.create({
  baseURL: 'http://109.73.206.144:6969/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export async function fetchEndpoint(endpoint, params = {}) {
  const token = import.meta.env.VITE_API_KEY || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'
  const response = await client.get(`/${endpoint}`, {
    params: { ...params, key: token, limit: Math.min(params.limit || 500, 500) }
  })
  return response.data
}

export default client
