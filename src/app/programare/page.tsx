'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Service, Doctor, WorkingHours } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { format, addDays, isBefore, startOfDay } from 'date-fns'
import { ro } from 'date-fns/locale'
import {
  Check,
  Clock,
  ArrowLeft,
  User,
  CalendarDays,
  Loader2,
} from 'lucide-react'

/* ───────────────────────── helpers ───────────────────────── */

const STEP_LABELS = [
  'Alege Serviciul',
  'Alege Medicul',
  'Alege Data si Ora',
  'Datele Tale',
]

function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number,
  bookedSlots: { start_time: string; end_time: string }[]
): { time: string; available: boolean }[] {
  const slots: { time: string; available: boolean }[] = []
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  for (let m = startMinutes; m + durationMinutes <= endMinutes; m += 30) {
    const h = Math.floor(m / 60)
    const min = m % 60
    const slotStart = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
    const slotEndMin = m + durationMinutes
    const slotEndH = Math.floor(slotEndMin / 60)
    const slotEndMinPart = slotEndMin % 60
    const slotEnd = `${String(slotEndH).padStart(2, '0')}:${String(slotEndMinPart).padStart(2, '0')}`

    const isBooked = bookedSlots.some((booked) => {
      const bookedStartMin =
        parseInt(booked.start_time.split(':')[0]) * 60 +
        parseInt(booked.start_time.split(':')[1])
      const bookedEndMin =
        parseInt(booked.end_time.split(':')[0]) * 60 +
        parseInt(booked.end_time.split(':')[1])
      const currentStartMin = m
      const currentEndMin = m + durationMinutes
      return currentStartMin < bookedEndMin && currentEndMin > bookedStartMin
    })

    slots.push({ time: slotStart, available: !isBooked })
  }

  return slots
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/* ───────────────────────── component ───────────────────────── */

export default function ProgramarePage() {
  // Step state
  const [step, setStep] = useState(1)

  // Data state
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookedSlots, setBookedSlots] = useState<
    { start_time: string; end_time: string }[]
  >([])

  // Patient state
  const [patientName, setPatientName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [notes, setNotes] = useState('')

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  /* ── Fetch services on mount ── */
  useEffect(() => {
    async function fetchServices() {
      setLoadingServices(true)
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category, name')

      if (error) {
        toast.error('Eroare la incarcarea serviciilor.')
      } else {
        setServices((data as Service[]) ?? [])
      }
      setLoadingServices(false)
    }
    fetchServices()
  }, [])

  /* ── Fetch doctors when service is selected ── */
  useEffect(() => {
    if (!selectedService) return
    async function fetchDoctors() {
      setLoadingDoctors(true)
      const { data, error } = await supabase
        .from('doctor_services')
        .select('doctor_id, doctors(*)')
        .eq('service_id', selectedService!.id)

      if (error) {
        toast.error('Eroare la incarcarea medicilor.')
        setLoadingDoctors(false)
        return
      }

      const doctorList: Doctor[] =
        data
          ?.map((ds: any) => ds.doctors)
          .filter(Boolean) ?? []
      setDoctors(doctorList)
      setLoadingDoctors(false)
    }
    fetchDoctors()
  }, [selectedService])

  /* ── Fetch working hours when doctor is selected ── */
  useEffect(() => {
    if (!selectedDoctor) return
    async function fetchWorkingHours() {
      const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .eq('doctor_id', selectedDoctor!.id)

      if (error) {
        toast.error('Eroare la incarcarea programului medicului.')
        return
      }
      setWorkingHours((data as WorkingHours[]) ?? [])
    }
    fetchWorkingHours()
  }, [selectedDoctor])

  /* ── Fetch booked slots when date is selected ── */
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return
    async function fetchBookedSlots() {
      setLoadingSlots(true)
      const dateStr = format(selectedDate!, 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('doctor_id', selectedDoctor!.id)
        .eq('appointment_date', dateStr)
        .in('status', ['pending', 'confirmed'])

      if (error) {
        toast.error('Eroare la verificarea disponibilitatii.')
        setLoadingSlots(false)
        return
      }
      setBookedSlots(
        (data as { start_time: string; end_time: string }[]) ?? []
      )
      setLoadingSlots(false)
    }
    fetchBookedSlots()
  }, [selectedDoctor, selectedDate])

  /* ── Navigation helpers ── */
  const goToStep = useCallback((s: number) => {
    setStep(s)
  }, [])

  const handleSelectService = useCallback(
    (service: Service) => {
      setSelectedService(service)
      setSelectedDoctor(null)
      setDoctors([])
      setSelectedDate(undefined)
      setSelectedTime(null)
      setBookedSlots([])
      setStep(2)
    },
    []
  )

  const handleSelectDoctor = useCallback(
    (doctor: Doctor) => {
      setSelectedDoctor(doctor)
      setSelectedDate(undefined)
      setSelectedTime(null)
      setBookedSlots([])
      setStep(3)
    },
    []
  )

  const handleSelectTime = useCallback(
    (time: string) => {
      setSelectedTime(time)
      setStep(4)
    },
    []
  )

  const resetForm = useCallback(() => {
    setStep(1)
    setSelectedService(null)
    setSelectedDoctor(null)
    setDoctors([])
    setWorkingHours([])
    setSelectedDate(undefined)
    setSelectedTime(null)
    setBookedSlots([])
    setPatientName('')
    setPatientEmail('')
    setPatientPhone('')
    setNotes('')
  }, [])

  /* ── Submit handler ── */
  const handleSubmit = async () => {
    if (!patientName.trim()) {
      toast.error('Te rugam sa introduci numele complet.')
      return
    }
    if (!patientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail)) {
      toast.error('Te rugam sa introduci o adresa de email valida.')
      return
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 10) {
      toast.error('Te rugam sa introduci un numar de telefon valid.')
      return
    }
    if (!selectedService || !selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Date incomplete. Te rugam sa reiei procesul.')
      return
    }

    setIsSubmitting(true)

    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const [h, m] = selectedTime.split(':').map(Number)
    const endMinutes = h * 60 + m + selectedService.duration_minutes
    const endH = Math.floor(endMinutes / 60)
    const endM = endMinutes % 60
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`

    const { error } = await supabase.from('appointments').insert({
      service_id: selectedService.id,
      doctor_id: selectedDoctor.id,
      patient_name: patientName.trim(),
      patient_email: patientEmail.trim(),
      patient_phone: patientPhone.trim(),
      appointment_date: dateStr,
      start_time: selectedTime,
      end_time: endTime,
      status: 'pending',
      notes: notes.trim() || null,
    })

    setIsSubmitting(false)

    if (error) {
      toast.error('A aparut o eroare. Te rugam sa incerci din nou.')
      return
    }

    toast.success(
      'Programarea a fost inregistrata cu succes! Veti primi o confirmare pe email.'
    )
    resetForm()
  }

  /* ── Calendar disabled days ── */
  const workingDays = workingHours.map((wh) => wh.day_of_week)

  const isDateDisabled = (date: Date) => {
    if (isBefore(date, startOfDay(new Date()))) return true
    // day_of_week: 0 = Sunday, 1 = Monday ... 6 = Saturday (JS getDay convention)
    const dayOfWeek = date.getDay()
    return !workingDays.includes(dayOfWeek)
  }

  /* ── Time slots for selected date ── */
  const timeSlotsForDate = (() => {
    if (!selectedDate || !selectedService) return []
    const dayOfWeek = selectedDate.getDay()
    const wh = workingHours.find((w) => w.day_of_week === dayOfWeek)
    if (!wh) return []
    return generateTimeSlots(
      wh.start_time,
      wh.end_time,
      selectedService.duration_minutes,
      bookedSlots
    )
  })()

  /* ─────────────────────── RENDER ─────────────────────── */

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Programare Online
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Alege serviciul, medicul si ora potrivita in doar cativa pasi.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step Indicator */}
          <Card className="mb-8">
            <CardContent className="py-6">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {STEP_LABELS.map((label, i) => {
                  const stepNum = i + 1
                  const isCompleted = step > stepNum
                  const isCurrent = step === stepNum
                  return (
                    <div key={label} className="flex items-center flex-1 last:flex-0">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                            isCompleted
                              ? 'bg-teal-600 text-white'
                              : isCurrent
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            stepNum
                          )}
                        </div>
                        <span
                          className={`mt-2 text-xs font-medium text-center hidden sm:block ${
                            isCurrent
                              ? 'text-teal-600'
                              : isCompleted
                                ? 'text-teal-600'
                                : 'text-gray-400'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                      {i < STEP_LABELS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                            step > stepNum ? 'bg-teal-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* ─── STEP 1: Choose Service ─── */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Alege serviciul dorit
              </h2>

              {loadingServices ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                  <span className="ml-3 text-gray-500">
                    Se incarca serviciile...
                  </span>
                </div>
              ) : services.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    Nu exista servicii disponibile momentan.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedService?.id === service.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        {service.category && (
                          <Badge
                            variant="secondary"
                            className="ml-2 text-xs shrink-0"
                          >
                            {service.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration_minutes} min
                        </span>
                        <span className="font-medium text-teal-700">
                          {service.price_min} RON
                          {service.price_max && service.price_max !== service.price_min
                            ? ` - ${service.price_max} RON`
                            : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── STEP 2: Choose Doctor ─── */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Alege medicul
              </h2>

              {loadingDoctors ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                  <span className="ml-3 text-gray-500">
                    Se incarca medicii disponibili...
                  </span>
                </div>
              ) : doctors.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    Nu exista medici disponibili pentru serviciul selectat.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => handleSelectDoctor(doctor)}
                      className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                        selectedDoctor?.id === doctor.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg shrink-0">
                          {getInitials(doctor.name)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {doctor.specialty}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => goToStep(1)}
                className="mt-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Inapoi
              </Button>
            </div>
          )}

          {/* ─── STEP 3: Choose Date & Time ─── */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Alege data si ora
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-teal-600" />
                      Selecteaza data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date)
                        setSelectedTime(null)
                      }}
                      disabled={isDateDisabled}
                      fromDate={new Date()}
                      toDate={addDays(new Date(), 60)}
                      locale={ro}
                      className="rounded-md mx-auto"
                    />
                  </CardContent>
                </Card>

                {/* Time Slots */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-teal-600" />
                      Selecteaza ora
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!selectedDate ? (
                      <p className="text-gray-400 text-center py-8">
                        Selecteaza mai intai o data din calendar.
                      </p>
                    ) : loadingSlots ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                        <span className="ml-2 text-gray-500">
                          Se verifica disponibilitatea...
                        </span>
                      </div>
                    ) : timeSlotsForDate.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        Nu exista sloturi disponibile pentru aceasta zi. Selecteaza o alta data.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlotsForDate.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => handleSelectTime(slot.time)}
                            className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                              !slot.available
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                                : selectedTime === slot.time
                                  ? 'bg-teal-500 text-white shadow-md'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:border-teal-500 hover:text-teal-600 cursor-pointer'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Button
                variant="outline"
                onClick={() => goToStep(2)}
                className="mt-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Inapoi
              </Button>
            </div>
          )}

          {/* ─── STEP 4: Patient Details ─── */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Completeaza datele tale
              </h2>

              {/* Booking Summary */}
              <Card className="mb-6 bg-teal-50 border-teal-200">
                <CardContent className="py-5">
                  <h3 className="font-semibold text-teal-800 mb-3">
                    Rezumatul programarii
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-teal-600 font-medium">
                        Serviciu:
                      </span>{' '}
                      <span className="text-gray-800">
                        {selectedService?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-teal-600 font-medium">
                        Medic:
                      </span>{' '}
                      <span className="text-gray-800">
                        {selectedDoctor?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-teal-600 font-medium">Data:</span>{' '}
                      <span className="text-gray-800">
                        {selectedDate
                          ? format(selectedDate, 'dd MMMM yyyy', { locale: ro })
                          : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-teal-600 font-medium">Ora:</span>{' '}
                      <span className="text-gray-800">{selectedTime}</span>
                    </div>
                    <div>
                      <span className="text-teal-600 font-medium">
                        Durata:
                      </span>{' '}
                      <span className="text-gray-800">
                        {selectedService?.duration_minutes} min
                      </span>
                    </div>
                    <div>
                      <span className="text-teal-600 font-medium">Pret:</span>{' '}
                      <span className="text-gray-800">
                        {selectedService?.price_min} RON
                        {selectedService?.price_max &&
                        selectedService.price_max !== selectedService.price_min
                          ? ` - ${selectedService.price_max} RON`
                          : ''}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Form */}
              <Card>
                <CardContent className="py-6 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">
                      Nume complet <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="patientName"
                      type="text"
                      placeholder="ex: Popescu Maria"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientEmail">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      placeholder="ex: maria@email.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientPhone">
                      Telefon <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="patientPhone"
                      type="tel"
                      placeholder="ex: 0712 345 678"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Observatii (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Mentiuni speciale, alergii, tratamente in curs..."
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => goToStep(3)}
                      className="sm:w-auto"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Inapoi
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Se trimite...
                        </>
                      ) : (
                        'Confirma Programarea'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
