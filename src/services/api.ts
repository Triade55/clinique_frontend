import axios, { type AxiosInstance, type AxiosError } from 'axios';

// Base URL: reads from env var PUBLIC_API_URL or defaults to Django backend at http://localhost:8000
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_API_URL) ||
  'http://localhost:8000';

// ---------------------------------------------------------------------------
// TypeScript Interfaces based on API_DOCUMENTATION.md
// ---------------------------------------------------------------------------

export interface Specialty {
  id: number;
  name: string;
  price: string;
  is_active: boolean;
}

export interface Slot {
  time: string; // e.g. "08:30"
  available: boolean;
  available_doctors_count?: number;
}

export interface SlotsResponse {
  date: string;
  specialty_id: number;
  total_slots: number;
  slots: Slot[];
}

export interface AppointmentBookingPayload {
  first_name: string;
  last_name: string;
  phone_number: string;
  email?: string;
  specialty_id: number;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:MM
  reason?: string;
  patient_number?: string; // Optional permanent IPP (PAT-YYYY-XXXX)
}

export interface AppointmentDetail {
  id: number;
  booking_reference: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  email?: string;
  specialty: number;
  specialty_name: string;
  specialty_price: string;
  doctor?: number | null;
  doctor_name?: string | null;
  patient?: number | null;
  patient_number?: string | null;
  is_new_patient: boolean;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
  status:
    | 'EN_ATTENTE'
    | 'CONFIRME'
    | 'EN_SALLE_D_ATTENTE'
    | 'EN_CONSULTATION'
    | 'TERMINE'
    | 'ANNULE'
    | 'ABSENT';
  status_label: string;
  invoice?: number | null;
  invoice_number?: string | null;
  rescheduled_count: number;
  created_at: string;
}

export interface AppointmentBookingResponse {
  message: string;
  booking_reference: string;
  appointment: AppointmentDetail;
}

export interface AppointmentLookupPayload {
  reference: string; // e.g. RES-202610-0002
  phone_number: string; // e.g. 0708091011
}

export interface AppointmentLookupItem {
  id: number;
  booking_reference: string;
  full_name: string;
  specialty_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  status_label: string;
}

export interface AppointmentReschedulePayload {
  reference: string;
  phone_number: string;
  new_date: string;
  new_time: string;
}

export interface AppointmentCancelPayload {
  reference: string;
  phone_number: string;
  reason?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// ---------------------------------------------------------------------------
// Axios Instance Configuration
// ---------------------------------------------------------------------------

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach Bearer token for protected staff routes
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('clinique_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Standardized log
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// 🟢 Public Patient Endpoints
// ---------------------------------------------------------------------------

/**
 * 1. Liste des spécialités médicales actives et leurs tarifs
 */
export async function getSpecialties(): Promise<Specialty[]> {
  const { data } = await apiClient.get<Specialty[]>('/api/public/specialties/');
  return data;
}

/**
 * 2. Créneaux disponibles pour une spécialité à une date donnée
 */
export async function getAvailableSlots(
  specialtyId: number,
  date: string
): Promise<SlotsResponse> {
  const { data } = await apiClient.get<SlotsResponse>('/api/public/slots/', {
    params: {
      specialty_id: specialtyId,
      date,
    },
  });
  return data;
}

/**
 * 3. Réserver un rendez-vous en ligne
 */
export async function bookAppointment(
  payload: AppointmentBookingPayload
): Promise<AppointmentBookingResponse> {
  const { data } = await apiClient.post<AppointmentBookingResponse>(
    '/api/public/appointments/',
    payload
  );
  return data;
}

/**
 * 4. Suivi et consultation de son rendez-vous par le patient
 */
export async function lookupAppointment(
  payload: AppointmentLookupPayload
): Promise<AppointmentLookupItem[]> {
  const { data } = await apiClient.post<AppointmentLookupItem[]>(
    '/api/public/appointments/lookup/',
    payload
  );
  return data;
}

/**
 * 5. Reporter son rendez-vous (Patient)
 */
export async function rescheduleAppointment(
  payload: AppointmentReschedulePayload
): Promise<{ message: string; appointment: Partial<AppointmentDetail> }> {
  const { data } = await apiClient.patch<{
    message: string;
    appointment: Partial<AppointmentDetail>;
  }>('/api/public/appointments/reschedule/', payload);
  return data;
}

/**
 * 6. Annuler son rendez-vous (Patient uniquement)
 */
export async function cancelAppointment(
  payload: AppointmentCancelPayload
): Promise<{ message: string; appointment: Partial<AppointmentDetail> }> {
  const { data } = await apiClient.post<{
    message: string;
    appointment: Partial<AppointmentDetail>;
  }>('/api/public/appointments/cancel/', payload);
  return data;
}

// ---------------------------------------------------------------------------
// 🔵 Staff & Auth Endpoints
// ---------------------------------------------------------------------------

export async function loginStaff(
  email: string,
  password: string
): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/api/auth/token/', {
    email,
    password,
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem('clinique_access_token', data.access);
    localStorage.setItem('clinique_refresh_token', data.refresh);
  }
  return data;
}

export function logoutStaff(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('clinique_access_token');
    localStorage.removeItem('clinique_refresh_token');
  }
}
