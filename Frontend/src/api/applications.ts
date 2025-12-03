import api from './axios';

// Types
export type ApplicationStatus = 'In Progress' | 'Submitted' | 'Under Review' | 'Won' | 'Rejected' | 'Withdrawn';

export interface EssayDraft {
  prompt: string;
  content: string;
  wordCount: number;
  lastEdited: string;
}

export interface ApplicationRequirement {
  name: string;
  completed: boolean;
  dueDate?: string;
}

export interface Application {
  _id: string;
  scholarship: {
    _id: string;
    title: string;
    org: string;
    amount: number;
    amountDisplay?: string;
    deadline: string;
    requirements?: string[];
  };
  status: ApplicationStatus;
  progress: number;
  requirements: Array<{
    _id?: string;
    label: string;
    status: 'completed' | 'pending' | 'missing' | 'draft';
    details?: string;
    dueDate?: string;
    completedAt?: string;
  }>;
  essay?: {
    prompt?: string;
    drafts?: Array<{
      content: string;
      wordCount: number;
      version: number;
      lastUpdated: string;
    }>;
    currentDraft?: number;
    wordLimit?: {
      min: number;
      max: number;
    };
  };
  documents?: Array<{
    _id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
  submittedAt?: string;
  confirmationNumber?: string;
  wonAt?: string;
  rejectedAt?: string;
  decisionExpectedBy?: string;
  awardDetails?: {
    amount?: string;
    disbursement?: string;
    expectedDate?: string;
  };
  feedback?: string;
  nextSteps?: Array<{
    step: string;
    completed: boolean;
    dueDate?: string;
  }>;
  notes?: string;
  timeline?: Array<{
    action: string;
    timestamp: string;
    details?: string;
  }>;
  lastActivityAt?: string;
  createdAt?: string;
  updatedAt?: string;
  // Computed fields
  daysUntilDeadline?: number;
}

export interface ApplicationsResponse {
  success: boolean;
  data: {
    applications: Application[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ApplicationResponse {
  success: boolean;
  data: Application;
}

export interface CreateApplicationData {
  scholarshipId: string;
  notes?: string;
}

export interface UpdateApplicationData {
  status?: ApplicationStatus;
  progress?: number;
  requirements?: ApplicationRequirement[];
  essayDrafts?: EssayDraft[];
  notes?: string;
  submittedAt?: string;
  decisionAt?: string;
}

// Applications API functions
export const applicationsApi = {
  /**
   * Get all applications for current user
   */
  getApplications: async (filters?: { status?: ApplicationStatus; search?: string; page?: number; limit?: number }): Promise<ApplicationsResponse> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    const queryString = params.toString();
    const response = await api.get<ApplicationsResponse>(`/applications${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  /**
   * Get single application by ID
   */
  getApplicationById: async (id: string): Promise<ApplicationResponse> => {
    const response = await api.get<ApplicationResponse>(`/applications/${id}`);
    return response.data;
  },

  /**
   * Create a new application (start applying to a scholarship)
   */
  createApplication: async (data: CreateApplicationData): Promise<ApplicationResponse> => {
    const response = await api.post<ApplicationResponse>('/applications', data);
    return response.data;
  },

  /**
   * Update application (progress, status, requirements, essays)
   */
  updateApplication: async (id: string, data: UpdateApplicationData): Promise<ApplicationResponse> => {
    const response = await api.put<ApplicationResponse>(`/applications/${id}`, data);
    return response.data;
  },

  /**
   * Submit application
   */
  submitApplication: async (id: string): Promise<ApplicationResponse> => {
    const response = await api.post<ApplicationResponse>(`/applications/${id}/submit`);
    return response.data;
  },

  /**
   * Withdraw application
   */
  withdrawApplication: async (id: string): Promise<ApplicationResponse> => {
    const response = await api.post<ApplicationResponse>(`/applications/${id}/withdraw`);
    return response.data;
  },

  /**
   * Record decision (won/rejected)
   */
  recordDecision: async (id: string, decision: 'Won' | 'Rejected', notes?: string): Promise<ApplicationResponse> => {
    const response = await api.post<ApplicationResponse>(`/applications/${id}/decision`, {
      decision,
      notes,
    });
    return response.data;
  },

  /**
   * Delete application
   */
  deleteApplication: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  /**
   * Update essay draft
   */
  updateEssayDraft: async (applicationId: string, essayIndex: number, content: string): Promise<ApplicationResponse> => {
    const response = await api.put<ApplicationResponse>(`/applications/${applicationId}/essay/${essayIndex}`, {
      content,
    });
    return response.data;
  },

  /**
   * Toggle requirement completion
   */
  toggleRequirement: async (applicationId: string, requirementIndex: number, completed: boolean): Promise<ApplicationResponse> => {
    const response = await api.put<ApplicationResponse>(`/applications/${applicationId}/requirement/${requirementIndex}`, {
      completed,
    });
    return response.data;
  },

  /**
   * Get application statistics for dashboard
   */
  getStats: async (): Promise<{
    success: boolean;
    data: {
      total: number;
      inProgress: number;
      submitted: number;
      won: number;
      rejected: number;
      wonAmount: number;
    };
  }> => {
    const response = await api.get('/applications/stats');
    return response.data;
  },
};

export default applicationsApi;

