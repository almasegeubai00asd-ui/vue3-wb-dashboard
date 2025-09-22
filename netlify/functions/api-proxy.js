import axios from 'axios'

const axios = require('axios');

exports.handler = async function(event, context) {
  const { endpoint, ...query } = event.queryStringParameters;

  const token = process.env.VITE_API_KEY; // берем из Environment Variables

  if (!endpoint) {
    return { statusCode: 400, body: 'Missing endpoint parameter' };
  }

  try {
    const response = await axios.get(`http://109.73.206.144:6969/api/${endpoint}`, {
      params: { ...query, key: token, limit: 500 }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err) {
    return {
      statusCode: err.response?.status || 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

