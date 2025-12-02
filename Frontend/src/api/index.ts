// API Service Layer - Central export
export { default as api } from './axios';
export { authApi } from './auth';
export { scholarshipsApi } from './scholarships';
export { applicationsApi } from './applications';

// Re-export types
export type {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse,
  ProfileResponse,
} from './auth';

export type {
  Scholarship,
  ScholarshipFilters,
  ScholarshipsResponse,
  ScholarshipResponse,
  FilterOptions,
} from './scholarships';

export type {
  Application,
  ApplicationStatus,
  ApplicationsResponse,
  ApplicationResponse,
  CreateApplicationData,
  UpdateApplicationData,
  EssayDraft,
  ApplicationRequirement,
} from './applications';

