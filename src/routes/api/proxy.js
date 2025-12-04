import axios from 'axios';

export async function POST({ request }) {
  try {
    const body = await request.json(); 
    const { url, method = 'POST', data = null } = body;

    let response;

    if (method.toUpperCase() === 'GET') {
      // Si necesitas pasar query params en GET
      const params = data || {};
      response = await axios.get(`http://98.92.120.34/sveltephp/${url}`, { params });
    } else {
      response = await axios.post(`http://98.92.120.34/sveltephp/${url}`, data);
    }

    return {
      status: 200,
      body: response.data
    };
  } catch (error) {
    console.error('Error en proxy:', error.message);
    return {
      status: 500,
      body: { error: error.message }
    };
  }
}
