import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Set your API's base URL
  timeout: 5000, // Set a default timeout (e.g., 1000ms = 1 second)
});

export default api;
