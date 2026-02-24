'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Appointment } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Search,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Phone,
  Mail,
} from 'lucide-react'

interface AppointmentWithRelations extends Appointment {
  services: { name: string } | null
  doctors: { name: string } | null
}

const statusConfig = {
  pending: { label: 'In asteptare', variant: 'outline' as const, className: 'border-yellow-500 text-yellow-700 bg-yellow-50' },
  confirmed: { label: 'Confirmat', variant: 'outline' as const, className: 'border-green-500 text-green-700 bg-green-50' },
  cancelled: { label: 'Anulat', variant: 'outline' as const, className: 'border-red-500 text-red-700 bg-red-50' },
}

const PAGE_SIZE = 20

export default function AdminProgramariPage() {
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const fetchAppointments = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from('appointments')
      .select('*, services(name), doctors(name)', { count: 'exact' })
      .order('appointment_date', { ascending: false })
      .order('start_time', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    if (search.trim()) {
      query = query.or(`patient_name.ilike.%${search.trim()}%,patient_email.ilike.%${search.trim()}%,patient_phone.ilike.%${search.trim()}%`)
    }

    const { data, count, error } = await query

    if (error) {
      toast.error('Eroare la incarcarea programarilor', { description: error.message })
      setLoading(false)
      return
    }

    setAppointments((data as AppointmentWithRelations[]) ?? [])
    setTotalCount(count ?? 0)
    setLoading(false)
  }, [page, statusFilter, search])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  useEffect(() => {
    setPage(0)
  }, [search, statusFilter])

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
    fetchAppointments()
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

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Programari</h1>
        <p className="text-sm text-muted-foreground">
          {totalCount} programari in total
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cauta dupa nume, email sau telefon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtreaza status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate</SelectItem>
                <SelectItem value="pending">In asteptare</SelectItem>
                <SelectItem value="confirmed">Confirmate</SelectItem>
                <SelectItem value="cancelled">Anulate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">Se incarca...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                {search || statusFilter !== 'all'
                  ? 'Nu s-au gasit programari cu filtrele selectate'
                  : 'Nu exista programari'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pacient</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Serviciu</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ora</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Note</TableHead>
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
                          <TableCell>
                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {apt.patient_email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {apt.patient_phone}
                              </span>
                            </div>
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
                          <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                            {apt.notes || '-'}
                          </TableCell>
                          <TableCell>
                            {apt.status === 'pending' && (
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 w-8 p-0"
                                  onClick={() => updateStatus(apt.id, 'confirmed')}
                                  title="Confirma"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                  onClick={() => updateStatus(apt.id, 'cancelled')}
                                  title="Anuleaza"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Pagina {page + 1} din {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Inapoi
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Inainte
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
