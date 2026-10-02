import apiClient from './apiClient';

export interface AuthStatusResponse {
  isAuthenticated: boolean;
  user?: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    googleId?: string;
    age?: number;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

export const authApi = {
  checkAuthStatus: async (): Promise<AuthStatusResponse> => {
    const response = await apiClient.get<AuthStatusResponse>('/auth/status');
    return response.data;
  },

  logoutUser: async (): Promise<{ message: string }> => {
    const response = await apiClient.get('/auth/logout');
    return response.data;
  },

  submitProfileData: async (profileDetails: Record<string, unknown>): Promise<unknown> => {
    const response = await apiClient.post('/auth/update-profile', profileDetails);
    return response.data;
  }
};
