export const COLLEGE_NAME = 'Jai Narain College of Technology';
export const COLLEGE_SHORT = 'JNCT';
export const APP_NAME = 'CampusShare';
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'akshratiwari425@gmail.com';

export const BRANCHES = [
  { value: 'CSE', label: 'Computer Science & Engineering' },
  { value: 'ECE', label: 'Electronics & Communication Engineering' },
  { value: 'ME',  label: 'Mechanical Engineering' },
  { value: 'CE',  label: 'Civil Engineering' },
  { value: 'IT',  label: 'Information Technology' },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const RESOURCE_TYPES = [
  { value: 'notes',       label: 'Lecture Notes' },
  { value: 'pyq',         label: 'Previous Year Questions' },
  { value: 'assignment',  label: 'Assignment' },
  { value: 'lab',         label: 'Lab Manual' },
  { value: 'syllabus',    label: 'Syllabus' },
  { value: 'other',       label: 'Other' },
];

// RGPV syllabus subjects mapped by branch and semester
export const SUBJECTS = {
  CSE: {
    1: ['Mathematics I', 'Physics', 'Chemistry', 'Basic Electrical Engineering', 'Engineering Graphics', 'Communication Skills'],
    2: ['Mathematics II', 'Basic Electronics', 'Programming in C', 'Environmental Studies', 'Workshop Practice', 'Basic Mechanical Engineering'],
    3: ['Mathematics III', 'Data Structures', 'Digital Electronics', 'Object Oriented Programming (Java)', 'Discrete Mathematics', 'Computer Organization'],
    4: ['Theory of Computation', 'Operating Systems', 'Database Management Systems', 'Computer Networks', 'Software Engineering', 'Design & Analysis of Algorithms'],
    5: ['Compiler Design', 'Web Technologies', 'Microprocessors & Interfaces', 'Elective I', 'Elective II', 'Industrial Training'],
    6: ['Artificial Intelligence', 'Machine Learning', 'Cloud Computing', 'Information Security', 'Elective III', 'Project I'],
    7: ['Big Data Analytics', 'Internet of Things', 'Mobile Application Development', 'Elective IV', 'Elective V', 'Project II'],
    8: ['Project III (Major Project)', 'Seminar', 'Industrial Training / Internship'],
  },
  ECE: {
    1: ['Mathematics I', 'Physics', 'Chemistry', 'Basic Electrical Engineering', 'Engineering Graphics', 'Communication Skills'],
    2: ['Mathematics II', 'Basic Electronics', 'Programming in C', 'Environmental Studies', 'Workshop Practice', 'Electrical Machines'],
    3: ['Mathematics III', 'Electronic Devices & Circuits', 'Signals & Systems', 'Network Analysis', 'Digital Electronics', 'Electromagnetic Fields'],
    4: ['Analog Communication', 'Digital Communication', 'Microprocessors', 'Control Systems', 'VLSI Design', 'Linear Integrated Circuits'],
    5: ['Antenna & Wave Propagation', 'Microwave Engineering', 'DSP', 'Elective I', 'Elective II', 'Minor Project'],
    6: ['Wireless Communication', 'Embedded Systems', 'Optical Fiber Communication', 'Information Theory & Coding', 'Elective III', 'Project I'],
    7: ['Advanced Communication Systems', 'RADAR & TV Engineering', 'Satellite Communication', 'Elective IV', 'Elective V', 'Project II'],
    8: ['Project III (Major Project)', 'Seminar', 'Industrial Training / Internship'],
  },
  ME: {
    1: ['Mathematics I', 'Physics', 'Chemistry', 'Basic Electrical Engineering', 'Engineering Graphics', 'Communication Skills'],
    2: ['Mathematics II', 'Basic Electronics', 'Programming in C', 'Environmental Studies', 'Workshop Practice', 'Engineering Materials'],
    3: ['Mathematics III', 'Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Theory of Machines', 'Manufacturing Processes I'],
    4: ['Heat & Mass Transfer', 'Machine Design', 'Metrology & Instrumentation', 'Manufacturing Processes II', 'Dynamics of Machines', 'Industrial Engineering'],
    5: ['Refrigeration & Air Conditioning', 'Automobile Engineering', 'Power Plant Engineering', 'Elective I', 'Elective II', 'Minor Project'],
    6: ['CNC & Automation', 'Robotics', 'Finite Element Analysis', 'Operations Research', 'Elective III', 'Project I'],
    7: ['Advanced Manufacturing', 'Tribology', 'Mechatronics', 'Elective IV', 'Elective V', 'Project II'],
    8: ['Project III (Major Project)', 'Seminar', 'Industrial Training / Internship'],
  },
  CE: {
    1: ['Mathematics I', 'Physics', 'Chemistry', 'Basic Electrical Engineering', 'Engineering Graphics', 'Communication Skills'],
    2: ['Mathematics II', 'Basic Electronics', 'Programming in C', 'Environmental Studies', 'Workshop Practice', 'Building Materials'],
    3: ['Mathematics III', 'Surveying', 'Structural Analysis I', 'Fluid Mechanics', 'Geotechnical Engineering I', 'Building Construction'],
    4: ['Structural Analysis II', 'Concrete Technology', 'Transportation Engineering I', 'Environmental Engineering I', 'Geotechnical Engineering II', 'Water Resources Engineering'],
    5: ['Design of Steel Structures', 'Design of RCC Structures', 'Transportation Engineering II', 'Environmental Engineering II', 'Elective I', 'Minor Project'],
    6: ['Estimation & Costing', 'Construction Management', 'Remote Sensing & GIS', 'Geotechnical Engineering III', 'Elective II', 'Project I'],
    7: ['Bridge Engineering', 'Advanced Structural Design', 'Elective III', 'Elective IV', 'Elective V', 'Project II'],
    8: ['Project III (Major Project)', 'Seminar', 'Industrial Training / Internship'],
  },
  IT: {
    1: ['Mathematics I', 'Physics', 'Chemistry', 'Basic Electrical Engineering', 'Engineering Graphics', 'Communication Skills'],
    2: ['Mathematics II', 'Basic Electronics', 'Programming in C', 'Environmental Studies', 'Workshop Practice', 'Basic Mechanical Engineering'],
    3: ['Mathematics III', 'Data Structures', 'Digital Electronics', 'Object Oriented Programming', 'Discrete Mathematics', 'Computer Organization'],
    4: ['Operating Systems', 'Database Management Systems', 'Computer Networks', 'Software Engineering', 'Design & Analysis of Algorithms', 'Web Development'],
    5: ['Compiler Design', 'Information Security', 'Mobile Computing', 'Elective I', 'Elective II', 'Industrial Training'],
    6: ['Artificial Intelligence', 'Cloud Computing', 'Data Mining', 'Software Testing', 'Elective III', 'Project I'],
    7: ['Big Data', 'IoT & Embedded Systems', 'DevOps', 'Elective IV', 'Elective V', 'Project II'],
    8: ['Project III (Major Project)', 'Seminar', 'Industrial Training / Internship'],
  },
};

export const getAllSubjects = (branch, semester) => {
  if (!branch || !semester) return [];
  return SUBJECTS[branch]?.[semester] || [];
};

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export const MAX_FILE_SIZE = 700 * 1024; // 700KB (Firestore doc limit is 1MB; free plan, no Storage)
