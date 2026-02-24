'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Appointment } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import {
  CalendarDays,
  CalendarCheck,
  Clock,
  MessageSquare,
  Check,
  X,
} from 'lucide-react'

interface AppointmentWithRelations extends Appointment {
  services: { name: string } | null
  doctors: { name: string } | null
}

interface Stats {
  totalAppointments: number
  todayAppointments: number
  pendingAppointments: number
  unreadMessages: number
}

const statusConfig = {
  pending: { label: 'In asteptare', variant: 'outline' as const, className: 'border-yellow-500 text-yellow-700 bg-yellow-50' },
  confirmed: { label: 'Confirmat', variant: 'outline' as const, className: 'border-green-500 text-green-700 bg-green-50' },
  cancelled: { label: 'Anulat', variant: 'outline' as const, className: 'border-red-500 text-red-700 bg-red-50' },
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    unreadMessages: 0,
  })
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0]

    const [
      { count: totalAppointments },
      { count: todayAppointments },
      { count: pendingAppointments },
      { count: unreadMessages },
      { data: recentAppointments },
    ] = await Promise.all([
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('appointment_date', today),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      supabase
        .from('appointments')
        .select('*, services(name), doctors(name)')
        .order('created_at', { ascending: false })
        .limit(10),
    ])

    setStats({
      totalAppointments: totalAppointments ?? 0,
      todayAppointments: todayAppointments ?? 0,
      pendingAppointments: pendingAppointments ?? 0,
      unreadMessages: unreadMessages ?? 0,
    })

    setAppointments((recentAppointments as AppointmentWithRelations[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    const run = async () => {
      await fetchData()
    }
    void run()
  }, [fetchData])

  async function updateStatus(id: string, status: 'confirmed' | 'cancelled') {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error('Eroare la actualizare', { description: error.message })
      return
    }

    toast.success(
      status === 'confirmed'
        ? 'Programare confirmata'
        : 'Programare anulata'
    )
    fetchData()
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  function formatTime(timeStr: string) {
    return timeStr.slice(0, 5)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Se incarca...</p>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Programari',
      value: stats.totalAppointments,
      icon: CalendarDays,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Programari Azi',
      value: stats.todayAppointments,
      icon: CalendarCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'In Asteptare',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'Mesaje Necitite',
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Programari Recente</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nu exista programari
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pacient</TableHead>
                    <TableHead>Serviciu</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ora</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt) => {
                    const config = statusConfig[apt.status]
                    return (
                      <TableRow key={apt.id}>
                        <TableCell className="font-medium">
                          {apt.patient_name}
                        </TableCell>
                        <TableCell>{apt.services?.name ?? '-'}</TableCell>
                        <TableCell>{apt.doctors?.name ?? '-'}</TableCell>
                        <TableCell>{formatDate(apt.appointment_date)}</TableCell>
                        <TableCell>{formatTime(apt.start_time)}</TableCell>
                        <TableCell>
                          <Badge variant={config.variant} className={config.className}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {apt.status === 'pending' && (
                            <div className="flex items-center gap-1">
                              <Button
                                size="xs"
                                variant="ghost"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => updateStatus(apt.id, 'confirmed')}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => updateStatus(apt.id, 'cancelled')}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
