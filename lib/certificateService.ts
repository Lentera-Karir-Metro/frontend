// lib/certificateService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Certificate {
    id: string;
    user_id: string;
    course_id: string;
    recipient_name: string;
    course_title: string;
    instructor_name: string;
    issued_at: string;
    total_hours: number;
    certificate_url: string;
    status: 'pending' | 'generated';
    createdAt?: string;
    updatedAt?: string;
    User?: {
        id: string;
        username: string;
        email: string;
    };
    Course?: {
        id: string;
        title: string;
    };
}

export interface CertificateCandidate {
    user_id: string;
    user_name: string;
    user_email: string;
    course_id: string;
    course_title: string;
    mentor_name: string;
    completed_at: string;
    status: string;
}

export interface CertificateTemplate {
    id: number;
    name: string;
    file_url: string;
    preview_url?: string;
    is_active: boolean;
}

// Get all certificates (Admin)
export const getAllCertificates = async (): Promise<Certificate[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/certificates/admin/all`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch certificates');
    }

    const data = await response.json();
    return data.data;
};

// Get certificate candidates (users who completed course but no certificate)
export const getCertificateCandidates = async (): Promise<CertificateCandidate[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/certificates/admin/candidates`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch certificate candidates');
    }

    const data = await response.json();
    return data.data;
};

// Get certificate templates
export const getCertificateTemplates = async (): Promise<CertificateTemplate[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/certificates/admin/templates`, {
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

// Generate certificate
export const generateCertificate = async (
    userId: string,
    courseId: string,
    templateId?: number,
    format: 'pdf' | 'png' = 'pdf'
): Promise<Certificate> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/certificates/admin/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            user_id: userId,
            course_id: courseId,
            template_id: templateId,
            format: format
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate certificate');
    }

    const data = await response.json();
    return data.data;
};

// Delete certificate
export const deleteCertificate = async (certificateId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/certificates/admin/${certificateId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete certificate');
    }
};

// Get my certificates (User side)
export const getMyCertificates = async (): Promise<Certificate[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/certificates`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch certificates');
    }

    const data = await response.json();
    return data.data;
};

// Get certificate status for a course (User side)
export const getCertificateStatus = async (courseId: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/certificates/status/${courseId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch certificate status');
    }

    return await response.json();
};
