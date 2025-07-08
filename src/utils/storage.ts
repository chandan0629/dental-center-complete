import { User, Patient, Incident } from '../types';

// Mock data
export const mockUsers: User[] = [
  { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
  { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" },
  { id: "3", role: "Patient", email: "jane@entnt.in", password: "patient123", patientId: "p2" }
];

export const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    dob: "1990-05-10",
    contact: "1234567890",
    healthInfo: "No allergies",
    email: "john@entnt.in"
  },
  {
    id: "p2",
    name: "Jane Smith",
    dob: "1985-08-15",
    contact: "0987654321",
    healthInfo: "Diabetic, allergic to penicillin",
    email: "jane@entnt.in"
  },
  {
    id: "p3",
    name: "Bob Johnson",
    dob: "1978-12-03",
    contact: "5555555555",
    healthInfo: "High blood pressure",
    email: "bob@entnt.in"
  }
];

export const mockIncidents: Incident[] = [
  {
    id: "i1",
    patientId: "p1",
    title: "Toothache",
    description: "Upper molar pain",
    comments: "Sensitive to cold",
    appointmentDate: "2025-07-10T10:00:00",
    cost: 80,
    treatment: "Root canal treatment",
    status: "Completed",
    nextDate: "2025-08-10T10:00:00",
    files: []
  },
  {
    id: "i2",
    patientId: "p2",
    title: "Dental Cleaning",
    description: "Regular dental cleaning",
    comments: "Good oral hygiene",
    appointmentDate: "2025-07-12T14:00:00",
    cost: 120,
    treatment: "Professional cleaning",
    status: "Scheduled",
    files: []
  },
  {
    id: "i3",
    patientId: "p1",
    title: "Follow-up",
    description: "Post-treatment checkup",
    comments: "Monitor healing progress",
    appointmentDate: "2025-07-15T09:00:00",
    status: "Scheduled",
    files: []
  }
];

const STORAGE_KEYS = {
  USERS: 'dental_users',
  PATIENTS: 'dental_patients',
  INCIDENTS: 'dental_incidents',
  CURRENT_USER: 'dental_current_user'
};

// Initialize localStorage with mock data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(mockPatients));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INCIDENTS)) {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(mockIncidents));
  }
};

// User operations
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Patient operations
export const getPatients = (): Patient[] => {
  const patients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
  return patients ? JSON.parse(patients) : [];
};

export const savePatients = (patients: Patient[]) => {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
};

// Incident operations
export const getIncidents = (): Incident[] => {
  const incidents = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
  return incidents ? JSON.parse(incidents) : [];
};

export const saveIncidents = (incidents: Incident[]) => {
  localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
};

// File operations
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
