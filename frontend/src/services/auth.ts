import api from './api';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  GenerateRequest,
  GenerateResponse
} from '../types';

export const authService = {
  // Register a new user
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', credentials);
    return response.data;
  },

  // Login a user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  // Generate content
  generate: async (data: GenerateRequest): Promise<GenerateResponse> => {
    const response = await api.post<GenerateResponse>('/api/generate', data);
    return response.data;
  }
};

export default authService;