import Link from 'next/link'
import { Clock } from 'lucide-react'
import { createSupabaseServer } from '@/lib/supabase-server'
import type { Service } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicii & Preturi | DentAura',
  description:
    'Descopera serviciile stomatologice oferite de DentAura. Tratamente complete cu preturi transparente.',
}

const categoryOrder = [
  'General',
  'Estetica',
  'Chirurgie',
  'Implantologie',
  'Ortodontie',
  'Protetica',
  'Endodontie',
]

export default async function ServiciiPage() {
  const supabase = await createSupabaseServer()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('category, name')

  const grouped = (services as Service[] | null)?.reduce<
    Record<string, Service[]>
  >((acc, service) => {
    const cat = service.category ?? 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(service)
    return acc
  }, {})

  const sortedCategories = grouped
    ? Object.keys(grouped).sort(
        (a, b) =>
          (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) -
          (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b))
      )
    : []

  return (
    <>
      {/* Hero */}
      <section className="bg-teal-600 pt-32 pb-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Serviciile Noastre
          </h1>
          <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
            Tratamente stomatologice complete, cu preturi transparente.
          </p>
        </div>
      </section>

      {/* Services by category */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {sortedCategories.length === 0 && (
            <p className="text-center text-slate-500">
              Nu exista servicii disponibile momentan.
            </p>
          )}

          {sortedCategories.map((category) => (
            <div key={category} className="mb-16 last:mb-0">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                {category}
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {grouped![category].map((service) => (
                  <div
                    key={service.id}
                    className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
                  >
                    <h3 className="text-xl font-bold text-slate-900">
                      {service.name}
                    </h3>

                    {service.description && (
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                        {service.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration_minutes} minute</span>
                    </div>

                    <p className="mt-3 text-2xl font-bold text-teal-600">
                      {service.price_max
                        ? `${service.price_min} - ${service.price_max} RON`
                        : `${service.price_min} RON`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/programare"
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Programeaza-te acum
          </Link>
        </div>
      </section>
    </>
  )
}
