import apiClient from './apiClient';

export const authApi = {
  // 1. DYNAMIC SESSION CHECK: Hits your AuthController.checkStatus endpoint
  // This verifies if the browser has the Passport session cookie active
  checkAuthStatus: async () => {
    const response = await apiClient.get('/auth/status');
    return response.data;
  },

  // 2. LOGOUT: Safely calls the backend logout chain using Axios
  logoutUser: async () => {
    const response = await apiClient.get('/auth/logout');
    return response.data;
  },

  // 3. PROFILE DATA SUBMISSION: For post-login profile setup or updating skills
  submitProfileData: async (profileDetails) => {
    const response = await apiClient.post('/auth/update-profile', profileDetails);
    return response.data;
  }
};
