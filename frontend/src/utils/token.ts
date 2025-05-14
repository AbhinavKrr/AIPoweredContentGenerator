// Token utilities for storing and retrieving JWT
export const TOKEN_KEY = 'auth_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Simple token validation check
    // This is a basic check - in a real app, you might want to decode and check expiration
    return token.split('.').length === 3;
  } catch (error) {
    return false;
  }
};