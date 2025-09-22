// netlify/functions/proxy.js
import axios from 'axios';

export async function handler(event, context) {
  const endpoint = event.queryStringParameters.endpoint;
  const token = process.env.VITE_API_KEY || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie';

  // Собираем все остальные параметры
  const params = { ...event.queryStringParameters };
  delete params.endpoint; // убираем endpoint из query params
  params.key = token;
  params.limit = Math.min(params.limit || 500, 500);

  try {
    const response = await axios.get(`http://109.73.206.144:6969/api/${endpoint}`, { params });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data', details: err.message })
    };
  }
}
