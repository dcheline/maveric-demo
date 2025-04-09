// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Generic fetch wrapper with error handling
const fetchWrapper = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Example API methods
export const api = {
  // Get data
  get: (endpoint) => fetchWrapper(endpoint, { method: 'GET' }),
  
  // Create data
  post: (endpoint, data) => fetchWrapper(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update data
  put: (endpoint, data) => fetchWrapper(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete data
  delete: (endpoint) => fetchWrapper(endpoint, { method: 'DELETE' }),
};

export default api; 