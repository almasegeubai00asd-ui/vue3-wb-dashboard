import axios from 'axios';

const client = axios.create({
  baseURL: '/.netlify/functions/proxy', // <-- сюда обращаемся
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export async function fetchEndpoint(endpoint, params = {}) {
  const response = await client.get('', {
    params: { endpoint, ...params } // endpoint передаем как query param
  });
  return response.data;
}

export default client;
