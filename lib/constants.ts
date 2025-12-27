/**
 * Shared constants for the application
 * Keep this in sync with backend validation
 */

export const COURSE_CATEGORIES = [
    'Programming',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'AI & Machine Learning',
    'Design',
    'UI/UX Design',
    'Business',
    'Marketing',
    'Cybersecurity',
    'Cloud Computing',
    'DevOps',
    'Database',
    'Soft Skills',
    'Other'
] as const;

export const COURSE_STATUS = ['draft', 'published'] as const;

export type CourseCategory = typeof COURSE_CATEGORIES[number];
export type CourseStatus = typeof COURSE_STATUS[number];
