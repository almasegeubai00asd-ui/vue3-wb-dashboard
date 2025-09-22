import axios from 'axios'

const client = axios.create({
  baseURL: '/.netlify/functions/api-proxy', // <-- теперь все запросы идут на функцию
  timeout: 15000
})

export async function fetchEndpoint(endpoint, params = {}) {
  const response = await client.get('', { params: { ...params, endpoint } })
  return response.data
}

export default client
