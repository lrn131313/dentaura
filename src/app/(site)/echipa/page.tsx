import { createSupabaseServer } from '@/lib/supabase-server'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone } from 'lucide-react'
import type { Doctor } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echipa Medicala | DentAura',
  description:
    'Cunoaste echipa de medici DentAura. Specialisti cu experienta, dedicati sanatatii tale dentare.',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default async function EchipaPage() {
  const supabase = await createSupabaseServer()

  const { data: doctors, error: doctorsError } = await supabase
    .from('doctors')
    .select('*')
    .order('name')

  if (doctorsError) {
    console.error('Error fetching doctors:', doctorsError)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-500">
          A aparut o eroare la incarcarea echipei medicale. Te rugam sa incerci mai tarziu.
        </p>
      </div>
    )
  }

  const { data: doctorServices } = await supabase
    .from('doctor_services')
    .select('doctor_id, services(name)')
    .order('doctor_id')

  // Map doctor_id to list of service names
  // Explicit type for join result
  interface DoctorServiceJoin {
    doctor_id: string
    services: { name: string } | { name: string }[] | null
  }

  const servicesByDoctor = ((doctorServices as unknown as DoctorServiceJoin[]) ?? []).reduce<
    Record<string, string[]>
  >((acc, row) => {
    if (!row.services) return acc
    if (!acc[row.doctor_id]) acc[row.doctor_id] = []
    if (Array.isArray(row.services)) {
      row.services.forEach((s) => acc[row.doctor_id].push(s.name))
    } else {
      acc[row.doctor_id].push(row.services.name)
    }
    return acc
  }, {})

  return (
    <>
      {/* Hero */}
      <section className="bg-teal-600 pt-32 pb-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Echipa Noastra
          </h1>
          <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
            Medici cu experienta, dedicati sanatatii tale dentare.
          </p>
        </div>
      </section>

      {/* Doctors */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {(!doctors || doctors.length === 0) && (
            <p className="text-center text-slate-500">
              Nu exista medici disponibili momentan.
            </p>
          )}

          {(doctors as Doctor[] | null)?.map((doctor, index) => {
            const isEven = index % 2 === 1
            const services = servicesByDoctor[doctor.id] ?? []

            return (
              <div
                key={doctor.id}
                className={`flex flex-col ${
                  isEven ? 'md:flex-row-reverse' : 'md:flex-row'
                } gap-8 rounded-xl border border-slate-200 bg-white p-6 md:p-8 transition-shadow hover:shadow-lg`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200">
                    <span className="text-4xl font-bold text-teal-700">
                      {getInitials(doctor.name)}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-center">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {doctor.name}
                  </h2>
                  <p className="mt-1 text-lg font-medium text-teal-600">
                    {doctor.specialty}
                  </p>

                  {doctor.bio && (
                    <p className="mt-3 text-slate-500 leading-relaxed">
                      {doctor.bio}
                    </p>
                  )}

                  {services.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {services.map((serviceName) => (
                        <Badge
                          key={serviceName}
                          variant="secondary"
                          className="bg-teal-50 text-teal-700 border-teal-200"
                        >
                          {serviceName}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    {doctor.email && (
                      <a
                        href={`mailto:${doctor.email}`}
                        className="inline-flex items-center gap-1.5 hover:text-teal-600 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {doctor.email}
                      </a>
                    )}
                    {doctor.phone && (
                      <a
                        href={`tel:${doctor.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-teal-600 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {doctor.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
