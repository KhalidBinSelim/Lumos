import api from './axios';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  profileCompleteness?: number;
  // Profile fields from onboarding
  dateOfBirth?: string;
  country?: string;
  state?: string;
  city?: string;
  phone?: string;
  // Academic info
  educationLevel?: string;
  schoolName?: string;
  gradeYear?: string;
  graduationYear?: number;
  gpa?: number;
  gpaScale?: number;
  major?: string;
  minor?: string;
  // Background
  gender?: string;
  ethnicities?: string[];
  firstGen?: boolean;
  citizenship?: string;
  incomeRange?: string;
  // Documents
  resume?: string;
  transcript?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

// Auth API functions
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/login', credentials);
    return response.data;
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>('/users/profile');
    return response.data;
  },

  /**
   * Update user profile (for onboarding and profile edits)
   */
  updateProfile: async (data: Partial<User>): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>('/users/profile', data);
    return response.data;
  },

  /**
   * Upload document (resume, transcript, etc.)
   */
  uploadDocument: async (file: File, type: 'resume' | 'transcript' | 'other'): Promise<{ success: boolean; data: { url: string } }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/users/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Logout - clear local storage
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authApi;

