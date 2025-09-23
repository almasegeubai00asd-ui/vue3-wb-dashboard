// ...existing code...
import axios from 'axios'

const client = axios.create({
  // отправляем все через Vercel-function /api/api-proxy
  baseURL: '/api/api-proxy',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export async function fetchEndpoint(endpoint, params = {}) {
  const token = import.meta.env.VITE_API_KEY || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'
  console.log('Fetching', endpoint, params)

  // проксируем через api-proxy, передавая endpoint как query
  const response = await client.get('/', {
    params: {
      endpoint,
      ...params,
      key: token,
      limit: Math.min(params.limit || 500, 500)
    }
  })

  return response.data
}

export default client
// ...existing code...