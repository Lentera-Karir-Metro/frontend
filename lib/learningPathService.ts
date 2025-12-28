/**
 * @fileoverview Service untuk API Learning Path
 */
import { apiGet, apiPost, apiPut, apiDelete } from './api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const LEARNING_PATH_API = `${API_BASE_URL}/admin/learning-paths`;

export interface LearningPath {
  id: string;
  title: string;
  description?: string;
  total_modules?: number;
  total_courses?: number;
  courses?: Course[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  thumbnail_url?: string;
  price?: number;
  category?: string;
  status?: string;
  modules?: Module[];
  LearningPathCourse?: {
    sequence_order: number;
  };
}

export interface Module {
  id: string;
  title?: string;
  sequence_order?: number;
}

export interface PaginationResponse {
  success: boolean;
  data: LearningPath[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

/**
 * Mendapatkan semua learning paths dengan pagination dan filter
 */
export const getAllLearningPaths = async (
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<PaginationResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await apiGet(`${LEARNING_PATH_API}?${queryParams}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch learning paths');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error fetching learning paths:', error);
    throw error;
  }
};

/**
 * Mendapatkan learning path berdasarkan ID
 */
export const getLearningPathById = async (id: string): Promise<LearningPath> => {
  try {
    const response = await apiGet(`${LEARNING_PATH_API}/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch learning path');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error fetching learning path:', error);
    throw error;
  }
};

/**
 * Membuat learning path baru
 */
export const createLearningPath = async (
  title: string,
  description: string,
  courseIds: string[],
  thumbnail?: File | null
): Promise<LearningPath> => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('course_ids', JSON.stringify(courseIds));
    
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(LEARNING_PATH_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create learning path');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error creating learning path:', error);
    throw error;
  }
};

/**
 * Mengupdate learning path
 */
export const updateLearningPath = async (
  id: string,
  title: string,
  description: string,
  courseIds: string[],
  thumbnail?: File | null
): Promise<LearningPath> => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('courses', JSON.stringify(courseIds));
    
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${LEARNING_PATH_API}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update learning path');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error updating learning path:', error);
    throw error;
  }
};

/**
 * Menghapus learning path
 */
export const deleteLearningPath = async (id: string): Promise<void> => {
  try {
    const response = await apiDelete(`${LEARNING_PATH_API}/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete learning path');
    }
  } catch (error: any) {
    console.error('Error deleting learning path:', error);
    throw error;
  }
};
