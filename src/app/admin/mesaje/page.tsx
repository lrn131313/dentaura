'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { ContactMessage } from '@/types/database'
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
import { CheckCheck, Trash2 } from 'lucide-react'

export default function AdminMesajePage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Eroare la incarcarea mesajelor', { description: error.message })
      setLoading(false)
      // Attempt to handle auth errors or generic failures
      if (error.message.includes('JWT') || error.code === 'PGRST301') {
        router.push('/admin/login')
      }
      return
    }

    setMessages(data ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => {
    const run = async () => {
      await fetchMessages()
    }
    void run()
  }, [fetchMessages])

  async function markAsRead(id: string) {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)

    if (error) {
      toast.error('Eroare la actualizare', { description: error.message })
      return
    }

    toast.success('Mesaj marcat ca citit')
    fetchMessages()
  }

  async function deleteMessage(id: string) {
    const confirmed = window.confirm('Esti sigur ca vrei sa stergi acest mesaj?')
    if (!confirmed) return

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Eroare la stergere', { description: error.message })
      return
    }

    toast.success('Mesaj sters')
    fetchMessages()
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Se incarca...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Mesaje</h1>

      <Card>
        <CardHeader>
          <CardTitle>
            Mesaje de Contact
            {messages.filter((m) => !m.is_read).length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {messages.filter((m) => !m.is_read).length} necitite
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nu exista mesaje
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20px]"><span className="sr-only">Status</span></TableHead>
                    <TableHead>Nume</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead className="min-w-[200px]">Mesaj</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Citit</TableHead>
                    <TableHead>Actiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow key={msg.id} className={!msg.is_read ? 'bg-blue-50/50' : ''}>
                      <TableCell>
                        {!msg.is_read && (
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" />
                        )}
                      </TableCell>
                      <TableCell className={!msg.is_read ? 'font-bold' : 'font-medium'}>
                        {msg.name}
                      </TableCell>
                      <TableCell className={!msg.is_read ? 'font-bold' : ''}>
                        {msg.email}
                      </TableCell>
                      <TableCell>{msg.phone ?? '-'}</TableCell>
                      <TableCell>
                        <p className={`line-clamp-2 text-sm ${!msg.is_read ? 'font-bold' : ''}`}>
                          {msg.message}
                        </p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatDate(msg.created_at)}
                      </TableCell>
                      <TableCell>
                        {msg.is_read ? (
                          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                            Citit
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
                            Necitit
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {!msg.is_read && (
                            <Button
                              size="xs"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => markAsRead(msg.id)}
                              title="Marcheaza ca citit"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="xs"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteMessage(msg.id)}
                            title="Sterge mesajul"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
