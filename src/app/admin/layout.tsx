'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  CalendarDays,
  MessageSquare,
  LogOut,
  Menu,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/programari', label: 'Programari', icon: CalendarDays },
  { href: '/admin/mesaje', label: 'Mesaje', icon: MessageSquare },
]

function SidebarContent({
  pathname,
  onLogout,
}: {
  pathname: string
  onLogout: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-primary">DentAura</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Panou de administrare</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Deconectare
        </Button>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setAuthenticated(true)
      } else if (!isLoginPage) {
        router.push('/admin/login')
      }
      setLoading(false)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setAuthenticated(true)
        } else if (event === 'SIGNED_OUT') {
          setAuthenticated(false)
          if (!isLoginPage) router.push('/admin/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [isLoginPage, router])

  async function handleLogout() {
    await supabase.auth.signOut()
    setAuthenticated(false)
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Se incarca...</p>
      </div>
    )
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r">
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center gap-3">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <span className="font-bold text-primary">DentAura</span>
        </div>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Meniu navigare</SheetTitle>
          <SidebarContent
            pathname={pathname}
            onLogout={() => {
              setMobileOpen(false)
              handleLogout()
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  )
}
