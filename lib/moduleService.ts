// lib/moduleService.ts
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/admin`.replace('/api/v1/admin', '/admin');

/**
 * Create a quiz first (required before creating quiz module)
 */
export const createQuiz = async (courseId: string, quizData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            course_id: courseId,
            title: quizData.title,
            pass_threshold: 0.75,
            description: quizData.description || '',
            duration_minutes: quizData.duration_minutes || 0,
            max_attempts: 0,
            questions: quizData.questions
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create quiz');
    }

    return await response.json();
};

/**
 * Create modules for a course
 * Supports multiple file uploads for video or ebook
 */
export const createModules = async (courseId: string, moduleData: {
    title: string;
    files: File[];
    moduleType: 'video' | 'ebook' | 'quiz';
    quizId?: string;
}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('title', moduleData.title);

    // Append files based on module type
    if (moduleData.moduleType === 'video' || moduleData.moduleType === 'ebook') {
        moduleData.files.forEach((file) => {
            formData.append('file', file); // Backend expects 'file' not 'files'
        });
    }

    // If quiz, append quiz_id
    if (moduleData.moduleType === 'quiz' && moduleData.quizId) {
        formData.append('quiz_id', moduleData.quizId);
    }

    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create modules');
    }

    return await response.json();
};

/**
 * Get all modules for a course
 */
export const getModulesByCourse = async (courseId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch modules');
    }

    return await response.json();
};

/**
 * Delete a module
 */
export const deleteModule = async (courseId: string, moduleId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules/${moduleId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete module');
    }

    return await response.json();
};
