import api from './axios';

// Types
export interface Scholarship {
  _id: string;
  title: string;
  org: string;
  website?: string;
  description?: string;
  amount: number;
  amountDisplay?: string;
  deadline: string;
  applicationOpens?: string;
  awardNotification?: string;
  renewable?: boolean;
  renewalDetails?: string;
  region?: string;
  location?: string;
  tags?: string[];
  categories?: string[];
  demographics?: string[];
  eligibility?: string[];
  eligibilityLevel?: string[];
  minGPA?: number;
  citizenshipRequired?: string[];
  majorsRequired?: string[];
  requirements?: string[];
  essayRequired?: boolean;
  essayPrompt?: string;
  essayWordCount?: {
    min?: number;
    max?: number;
  };
  essayCriteria?: string[];
  transcriptRequired?: boolean;
  lorRequired?: number;
  portfolioRequired?: boolean;
  awardDetails?: string[];
  awardsPerYear?: number;
  applicantsPerYear?: number;
  timeline?: Array<{
    date: string;
    label: string;
  }>;
  competition?: {
    acceptanceRate?: string;
    similarProfile?: string[];
    percentile?: number;
  };
  orgInfo?: {
    type?: string;
    founded?: string;
    totalAwarded?: string;
    contact?: string;
    phone?: string;
  };
  notes?: {
    whyFit?: string[];
    improve?: string[];
  };
  featured?: boolean;
  verified?: boolean;
  active?: boolean;
  // Computed fields
  matchScore?: number;
  match?: number; // Backend may return either matchScore or match
  saved?: boolean;
  daysUntilDeadline?: number;
}

export interface ScholarshipFilters {
  page?: number;
  limit?: number;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  deadline?: string;
  categories?: string[];
  demographics?: string[];
  eligibilityLevel?: string[];
  location?: string;
  essayRequired?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ScholarshipsResponse {
  success: boolean;
  data: Scholarship[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ScholarshipResponse {
  success: boolean;
  data: Scholarship;
}

export interface FilterOptions {
  success: boolean;
  data: {
    categories: string[];
    demographics: string[];
    eligibilityLevels: string[];
    locations: string[];
    amountRanges: Array<{ label: string; min: number; max: number }>;
  };
}

// Scholarships API functions
export const scholarshipsApi = {
  /**
   * Get all scholarships with optional filters
   */
  getScholarships: async (filters?: ScholarshipFilters): Promise<ScholarshipsResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const response = await api.get<ScholarshipsResponse>(`/scholarships?${params.toString()}`);
    return response.data;
  },

  /**
   * Search scholarships by query
   */
  searchScholarships: async (query: string, filters?: ScholarshipFilters): Promise<ScholarshipsResponse> => {
    const params = new URLSearchParams({ q: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<ScholarshipsResponse>(`/scholarships/search?${params.toString()}`);
    return response.data;
  },

  /**
   * Get scholarship by ID
   */
  getScholarshipById: async (id: string): Promise<ScholarshipResponse> => {
    const response = await api.get<ScholarshipResponse>(`/scholarships/${id}`);
    return response.data;
  },

  /**
   * Get featured scholarships
   */
  getFeaturedScholarships: async (limit?: number): Promise<ScholarshipsResponse> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get<ScholarshipsResponse>(`/scholarships/featured${params}`);
    return response.data;
  },

  /**
   * Get upcoming deadlines
   */
  getUpcomingDeadlines: async (days?: number): Promise<ScholarshipsResponse> => {
    const params = days ? `?days=${days}` : '';
    const response = await api.get<ScholarshipsResponse>(`/scholarships/deadlines${params}`);
    return response.data;
  },

  /**
   * Get recommended scholarships (requires auth)
   */
  getRecommendedScholarships: async (limit?: number): Promise<ScholarshipsResponse> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get<ScholarshipsResponse>(`/scholarships/recommended${params}`);
    return response.data;
  },

  /**
   * Get saved scholarships (requires auth)
   */
  getSavedScholarships: async (): Promise<ScholarshipsResponse> => {
    const response = await api.get<ScholarshipsResponse>('/scholarships/saved');
    return response.data;
  },

  /**
   * Save a scholarship (requires auth)
   */
  saveScholarship: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/scholarships/${id}/save`);
    return response.data;
  },

  /**
   * Unsave a scholarship (requires auth)
   */
  unsaveScholarship: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/scholarships/${id}/save`);
    return response.data;
  },

  /**
   * Get filter options for dropdowns
   */
  getFilterOptions: async (): Promise<FilterOptions> => {
    const response = await api.get<FilterOptions>('/scholarships/filters');
    return response.data;
  },
};

export default scholarshipsApi;

