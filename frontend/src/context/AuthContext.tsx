import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '../types';
import { getToken, removeToken, setToken, isTokenValid } from '../utils/token';
import authService from '../services/auth';
import { jwtDecode } from 'jwt-decode';

// Define context types
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

// Create the context
const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Define action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'AUTH_LOADED' };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    case 'AUTH_LOADED':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for token and validate on initial load
  useEffect(() => {
    const validateAuth = async () => {
      if (isTokenValid()) {
        try {
          // Try to decode the token to get user info
          const token = getToken()!;
          const decoded: any = jwtDecode(token);
          // Optionally, fetch user from backend if needed
          // For now, use decoded info if available
          const user: User = {
            id: decoded.userId,
            name: decoded.name || '',
            email: decoded.email || '',
          };
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        } catch {
          removeToken();
          dispatch({ type: 'AUTH_LOADED' });
        }
      } else {
        removeToken();
        dispatch({ type: 'AUTH_LOADED' });
      }
    };
    validateAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      const { user, token } = await authService.login(credentials);
      setToken(token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    try {
      const { user, token } = await authService.register(credentials);
      setToken(token);
      dispatch({ type: 'REGISTER_SUCCESS', payload: { user, token } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    removeToken();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;