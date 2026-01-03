/**
 * @fileoverview Service untuk User Certificate Generation
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface CourseCompletionStatus {
  course_id: string;
  course_title: string;
  total_modules: number;
  completed_modules: number;
  is_completed: boolean;
  has_certificate: boolean;
  eligible_for_certificate: boolean;
  recommended_template_id?: number;
  existing_certificate?: any;
}

export interface CertificatePreview {
  recipient_name: string;
  course_title: string;
  instructor_name: string;
  completion_date: string;
  template_url: string | null;
  template_name: string;
}

export interface GenerateCertificateRequest {
  course_id: string;
  template_id?: number;
  format?: 'pdf' | 'png';
}

/**
 * Check course completion status
 */
export const checkCourseCompletion = async (courseId: string): Promise<CourseCompletionStatus> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/user-certificates/check/${courseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to check course completion');
  }

  const data = await response.json();
  return data.data;
};

/**
 * Get available templates
 */
export const getAvailableTemplates = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/user-certificates/templates`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch templates');
  }

  const data = await response.json();
  return data.data;
};

/**
 * Preview certificate
 */
export const previewCertificate = async (courseId: string, templateId?: number): Promise<CertificatePreview> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/user-certificates/preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ course_id: courseId, template_id: templateId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to preview certificate');
  }

  const data = await response.json();
  return data.data;
};

/**
 * Generate certificate
 */
export const generateUserCertificate = async (request: GenerateCertificateRequest) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/user-certificates/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate certificate');
  }

  const data = await response.json();
  return data.data;
};
