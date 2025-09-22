import axios from 'axios'

export async function handler(event, context) {
  try {
    // Читаем query-параметры
    const query = event.queryStringParameters || {}
    
    // Вставляем API ключ
    const key = process.env.VITE_API_KEY || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'
    
    // Формируем URL для настоящего API
    const url = `http://109.73.206.144:6969/api${query.endpoint ? '/' + query.endpoint : ''}`
    
    const params = { ...query, key, limit: Math.min(query.limit || 500, 500) }
    
    const response = await axios.get(url, { params })
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    }
  } catch (err) {
    return {
      statusCode: err.response?.status || 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}
