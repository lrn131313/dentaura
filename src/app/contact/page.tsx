'use client'

import { useState, type FormEvent } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: form.message,
    })

    setLoading(false)

    if (error) {
      toast.error('A aparut o eroare. Te rugam sa incerci din nou.')
      return
    }

    toast.success('Mesajul a fost trimis cu succes! Te vom contacta in curand.')
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Adresa',
      value: 'Str. Victoriei 120, Sector 1, Bucuresti',
    },
    {
      icon: Phone,
      label: 'Telefon',
      value: '+40 721 234 567',
      href: 'tel:+40721234567',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'contact@dentaura.ro',
      href: 'mailto:contact@dentaura.ro',
    },
    {
      icon: Clock,
      label: 'Program',
      value: (
        <div className="space-y-1">
          <p>Luni - Vineri: 09:00 - 17:00</p>
          <p>Sambata: 09:00 - 13:00</p>
          <p>Duminica: Inchis</p>
        </div>
      ),
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-teal-600 pt-32 pb-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Contact
          </h1>
          <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
            Suntem aici pentru tine. Contacteaza-ne cu incredere.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Trimite-ne un mesaj
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Nume *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Numele tau complet"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@exemplu.ro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+40 7XX XXX XXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mesaj *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Scrie-ne mesajul tau..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 text-base font-semibold"
                >
                  {loading ? 'Se trimite...' : 'Trimite Mesajul'}
                </Button>
              </form>
            </div>

            {/* Right: Contact info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Informatii de contact
              </h2>

              {contactInfo.map((item) => {
                const Icon = item.icon
                const content = (
                  <div className="flex gap-4 rounded-xl bg-slate-50 p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100">
                      <Icon className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {item.label}
                      </p>
                      <div className="mt-1 text-slate-900 font-medium">
                        {item.value}
                      </div>
                    </div>
                  </div>
                )

                if ('href' in item && item.href) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      {content}
                    </a>
                  )
                }

                return <div key={item.label}>{content}</div>
              })}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-16 flex h-64 items-center justify-center rounded-xl bg-slate-200">
            <p className="text-slate-500 font-medium">
              Harta va fi integrata aici
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
