export interface Doctor {
  id: string
  name: string
  specialty: string
  bio: string | null
  image_url: string | null
  email: string | null
  phone: string | null
  created_at: string
}

export interface Service {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  price_min: number
  price_max: number | null
  category: string | null
  created_at: string
}

export interface DoctorService {
  id: string
  doctor_id: string
  service_id: string
}

export interface WorkingHours {
  id: string
  doctor_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export interface Appointment {
  id: string
  service_id: string
  doctor_id: string
  patient_name: string
  patient_email: string
  patient_phone: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes: string | null
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  is_read: boolean
  created_at: string
}
