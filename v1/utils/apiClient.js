const public_backend_url = process.env.PUBLIC_BACKEND_URL;
const public_backend_api_key = process.env.PUBLIC_API_KEY;

const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

const apiClient = async (endpoint, method = HttpMethod.GET, options = {}) => {
  const url = `${public_backend_url}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': public_backend_api_key,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    method,
    headers
  });

  if (!response.ok) {
    throw new Error(`API Request failed for ${endpoint}: ${response.statusText}`);
  }

  return response.json();
};

module.exports = {
  apiClient,
  HttpMethod
};
