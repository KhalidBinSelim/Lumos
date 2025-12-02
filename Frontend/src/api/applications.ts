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
    deadline: string;
    requirements?: string[];
  };
  status: ApplicationStatus;
  progress: number;
  startedAt: string;
  submittedAt?: string;
  decisionAt?: string;
  requirements: ApplicationRequirement[];
  essayDrafts: EssayDraft[];
  notes?: string;
  // Computed fields
  daysUntilDeadline?: number;
}

export interface ApplicationsResponse {
  success: boolean;
  data: Application[];
  stats?: {
    total: number;
    inProgress: number;
    submitted: number;
    won: number;
    rejected: number;
    wonAmount: number;
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
  getApplications: async (status?: ApplicationStatus): Promise<ApplicationsResponse> => {
    const params = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await api.get<ApplicationsResponse>(`/applications${params}`);
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

