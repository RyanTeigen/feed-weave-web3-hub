
// API configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-api-domain.com'  // Replace with your actual deployed API URL
  : 'http://localhost:8000';

export const API_ENDPOINTS = {
  nonce: `${API_BASE_URL}/auth/nonce`,
  verify: `${API_BASE_URL}/auth/verify`,
} as const;

export { API_BASE_URL };
