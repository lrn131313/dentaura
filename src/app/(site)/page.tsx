import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Doctor, Service } from '@/types/database'
import HeroSection from '@/components/HeroSection'

// SVG Icons as components
function ToothIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9.5 2 7 3.5 7 6.5C7 9 6 11 5.5 13C4.5 17 5.5 22 8 22C10 22 10.5 19 12 19C13.5 19 14 22 16 22C18.5 22 19.5 17 18.5 13C18 11 17 9 17 6.5C17 3.5 14.5 2 12 2Z" />
    </svg>
  )
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function CpuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" />
      <path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
    </svg>
  )
}

function HeartPulseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 12.572l-7.5 7.428l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
      <path d="M12 6L12 12" />
      <path d="M9 9h6" />
    </svg>
  )
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  )
}

// Service category icons
function getServiceIcon(category: string | null) {
  switch (category?.toLowerCase()) {
    case 'ortodontie':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 12h8" /><path d="M12 8v8" /><circle cx="12" cy="12" r="10" />
        </svg>
      )
    case 'chirurgie':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
          <path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" />
        </svg>
      )
    case 'estetica':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )
    case 'implantologie':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v6" /><path d="M8 6h8" /><path d="M9 8l3 14" /><path d="M15 8l-3 14" />
        </svg>
      )
    case 'preventie':
      return <ShieldCheckIcon className="w-6 h-6" />
    default:
      return <ToothIcon className="w-6 h-6" />
  }
}

// Helper to get initials from a name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default async function HomePage() {
  // Fetch services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('created_at')
    .limit(6)

  // Fetch doctors
  const { data: doctors } = await supabase
    .from('doctors')
    .select('*')
    .order('name')

  const testimonials = [
    {
      quote: 'Experienta la DentAura a fost exceptionala! Dr. Marinescu mi-a facut un implant fara durere. Recomand cu incredere!',
      name: 'Ana M.',
      location: 'Bucuresti',
    },
    {
      quote: 'Am gasit in sfarsit o clinica unde ma simt in siguranta. Echipa este profesionista si prietenoasa.',
      name: 'Mihai D.',
      location: 'Bucuresti',
    },
    {
      quote: 'Fatete dentare perfecte! Dr. Ionescu este o adevarata artista. Zambetul meu arata incredibil acum.',
      name: 'Elena P.',
      location: 'Bucuresti',
    },
  ]

  const features = [
    {
      icon: <CpuIcon className="w-6 h-6" />,
      title: 'Tehnologie de ultima generatie',
      description:
        'Folosim echipamente digitale moderne, inclusiv radiografie 3D si scanner intraoral, pentru diagnostic precis.',
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: 'Echipa cu experienta',
      description:
        'Medicii nostri au peste 10 ani de practica si se perfectioneaza continuu prin cursuri internationale.',
    },
    {
      icon: <HeartPulseIcon className="w-6 h-6" />,
      title: 'Confort si siguranta',
      description:
        'Mediul nostru este conceput pentru relaxare, cu protocoale stricte de sterilizare si igiena.',
    },
    {
      icon: <WalletIcon className="w-6 h-6" />,
      title: 'Preturi transparente',
      description:
        'Afisam preturile tuturor tratamentelor. Fara costuri ascunse, fara surprize.',
    },
  ]

  return (
    <>
      {/* ====== HERO SECTION ====== */}
      <HeroSection />

      {/* ====== SERVICES PREVIEW ====== */}
      <section id="servicii" className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600 mb-3">
              Serviciile Noastre
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Tratamente complete pentru sanatatea dentara
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services as Service[] | null)?.map((service) => (
              <article
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                  {getServiceIcon(service.category)}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {service.description}
                </p>
                <p className="text-teal-600 font-semibold text-sm">
                  De la {service.price_min} RON
                </p>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/servicii"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-teal-600 px-6 py-3 text-base font-semibold text-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
            >
              Vezi Toate Serviciile
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== WHY CHOOSE US ====== */}
      <section id="de-ce-noi" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              De ce sa alegi DentAura?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TEAM PREVIEW ====== */}
      <section id="echipa" className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Echipa Noastra
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Medici dedicati, cu experienta si pasiune
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(doctors as Doctor[] | null)?.map((doctor) => (
              <article
                key={doctor.id}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-teal-700">
                    {getInitials(doctor.name)}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">
                  {doctor.name}
                </h3>
                <p className="text-teal-600 text-sm font-medium mt-1">
                  {doctor.specialty}
                </p>
                {doctor.bio && (
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                    {doctor.bio}
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/echipa"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-teal-600 px-6 py-3 text-base font-semibold text-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
            >
              Vezi Echipa
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section id="testimoniale" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Ce spun pacientii nostri
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <article
                key={index}
                className="bg-slate-50 rounded-xl p-6 flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-amber-400" />
                  ))}
                </div>
                <QuoteIcon className="w-8 h-8 text-teal-200 mb-3" />
                <p className="italic text-slate-700 leading-relaxed flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section id="programare" className="bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Programeaza-te astazi
          </h2>
          <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
            Procesul de programare dureaza sub 2 minute. Alege serviciul,
            medicul si ora care ti se potriveste.
          </p>
          <div className="mt-8">
            <Link
              href="/programare"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-teal-600 shadow-lg hover:bg-teal-50 transition-colors"
            >
              <CalendarIcon className="w-5 h-5" />
              Programare Online
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
