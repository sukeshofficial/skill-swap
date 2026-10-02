import axios from "axios";

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

//  Global response interceptor to handle unauthorized access (401 errors)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let 401s pass through so callers (like AuthContext) can handle them
    return Promise.reject(error);
  }
);

export default apiClient;