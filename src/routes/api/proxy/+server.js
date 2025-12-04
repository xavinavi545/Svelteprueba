import axios from 'axios';

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { url, method = 'POST', data = null } = body;

    let response;

    if (method.toUpperCase() === 'GET') {
      const params = data || {};
      response = await axios.get(`http://98.92.120.34/sveltephp/${url}`, { params });
    } else {
      response = await axios.post(`http://98.92.120.34/sveltephp/${url}`, data);
    }

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error en proxy:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
