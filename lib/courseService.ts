/**
 * @fileoverview Service untuk API Course
 */
import { apiGet, apiPost, apiPut, apiDelete } from './api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const COURSE_API = `${API_BASE_URL}/admin/courses`;

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  price?: number;
  discount_amount?: number;
  category?: string;
  mentor_name?: string;
  mentor_title?: string;
  mentor_photo_profile?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  modules?: Module[];
  quizzes?: Quiz[];
}

export interface Module {
  id: string;
  title?: string;
  type?: string;
  sequence_order?: number;
  video_url?: string;
  ebook_url?: string;
}

export interface Quiz {
  id: string;
  title?: string;
  description?: string;
  passing_score?: number;
}

export interface CreateCourseData {
  title: string;
  description?: string;
  price?: number;
  discount_amount?: number;
  category?: string;
  category_id?: string;
  mentor_id?: string;
  mentor_name?: string;
  mentor_title?: string;
  status?: string;
  thumbnail?: File;
  mentor_photo?: File;
}

/**
 * Mendapatkan semua courses
 */
export const getAllCourses = async (search?: string): Promise<Course[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);

    const url = search ? `${COURSE_API}?${queryParams}` : COURSE_API;
    const response = await apiGet(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch courses');
    }

    const data = await response.json();

    // API backend bisa mengembalikan array langsung atau object dengan data property
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

/**
 * Mendapatkan course berdasarkan ID
 */
export const getCourseById = async (id: string): Promise<Course> => {
  try {
    const response = await apiGet(`${COURSE_API}/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch course');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

/**
 * Membuat course baru dengan upload file
 */
export const createCourse = async (data: CreateCourseData): Promise<Course> => {
  try {
    const formData = new FormData();

    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.discount_amount !== undefined) formData.append('discount_amount', data.discount_amount.toString());
    if (data.category) formData.append('category', data.category);
    if (data.mentor_name) formData.append('mentor_name', data.mentor_name);
    if (data.mentor_title) formData.append('mentor_title', data.mentor_title);
    if (data.status) formData.append('status', data.status);

    // Append files dengan field name yang sesuai dengan backend
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail, data.thumbnail.name);
    }
    if (data.mentor_photo) {
      formData.append('mentor_photo', data.mentor_photo, data.mentor_photo.name);
    }

    // Untuk FormData, jangan set Content-Type header (browser akan set otomatis dengan boundary)
    const token = localStorage.getItem('token');
    const response = await fetch(COURSE_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
      throw new Error(errorData.message || errorData.error || 'Failed to create course');
    }

    const result = await response.json();
    return result.course || result;
  } catch (error: any) {
    console.error('Error creating course:', error);
    throw new Error(error.message || 'Gagal membuat course. Silakan coba lagi.');
  }
};

/**
 * Mengupdate course
 */
export const updateCourse = async (id: string, data: CreateCourseData): Promise<Course> => {
  try {
    const formData = new FormData();

    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.discount_amount !== undefined) formData.append('discount_amount', data.discount_amount.toString());
    if (data.category) formData.append('category', data.category);
    if (data.mentor_id) formData.append('mentor_id', data.mentor_id);
    if (data.mentor_name) formData.append('mentor_name', data.mentor_name);
    if (data.mentor_title) formData.append('mentor_title', data.mentor_title);
    if (data.status) formData.append('status', data.status);

    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
    if (data.mentor_photo) formData.append('mentor_photo', data.mentor_photo);

    const token = localStorage.getItem('token');
    const response = await fetch(`${COURSE_API}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update course');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error updating course:', error);
    throw error;
  }
};

/**
 * Menghapus course
 */
export const deleteCourse = async (id: string): Promise<void> => {
  try {
    const response = await apiDelete(`${COURSE_API}/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete course');
    }
  } catch (error: any) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

