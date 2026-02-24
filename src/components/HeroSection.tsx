'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ─── Animated counter hook ─── */
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          function animate(now: number) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

/* ─── SVG Illustrations ─── */
function ToothIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main tooth body */}
      <path
        d="M60 8C45 8 32 18 32 35C32 48 28 58 25 68C19 88 24 120 38 124C48 127 52 108 60 108C68 108 72 127 82 124C96 120 101 88 95 68C92 58 88 48 88 35C88 18 75 8 60 8Z"
        fill="url(#toothGrad)"
        stroke="white"
        strokeWidth="2"
        strokeOpacity="0.5"
      />
      {/* Highlight */}
      <path
        d="M50 20C44 22 40 28 40 35C40 42 42 50 44 56"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      {/* Sparkle on tooth */}
      <circle cx="48" cy="30" r="2" fill="white" fillOpacity="0.8" />
      <defs>
        <linearGradient id="toothGrad" x1="25" y1="8" x2="95" y2="124" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0FDFA" />
          <stop offset="1" stopColor="#99F6E4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SmileIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Smile arc */}
      <path
        d="M30 40 Q100 95 170 40"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.4"
      />
      {/* Teeth row */}
      <rect x="55" y="35" width="14" height="18" rx="4" fill="white" fillOpacity="0.3" />
      <rect x="73" y="33" width="14" height="20" rx="4" fill="white" fillOpacity="0.35" />
      <rect x="91" y="33" width="14" height="20" rx="4" fill="white" fillOpacity="0.35" />
      <rect x="109" y="33" width="14" height="20" rx="4" fill="white" fillOpacity="0.35" />
      <rect x="127" y="35" width="14" height="18" rx="4" fill="white" fillOpacity="0.3" />
    </svg>
  )
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  )
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function DentalMirrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="22" r="18" stroke="white" strokeWidth="2.5" strokeOpacity="0.4" />
      <circle cx="30" cy="22" r="12" fill="white" fillOpacity="0.1" />
      <line x1="30" y1="40" x2="30" y2="110" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
  )
}

/* ─── Main Hero Component ─── */
export default function HeroSection() {
  const stat1 = useCounter(12, 1800)
  const stat2 = useCounter(5000, 2200)
  const stat3 = useCounter(98, 2000)

  return (
    <section className="hero-section relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-600 to-teal-800 min-h-[92vh] flex items-center">
      {/* ── Animated Background Elements ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="hero-orb hero-orb-1 absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-teal-400/20 blur-3xl" />
        <div className="hero-orb hero-orb-2 absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-teal-300/15 blur-3xl" />
        <div className="hero-orb hero-orb-3 absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-white/5 blur-2xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating decorative elements */}
        <SparkleIcon className="hero-float hero-float-1 absolute top-[15%] left-[8%] w-5 h-5 text-teal-200/40" />
        <SparkleIcon className="hero-float hero-float-2 absolute top-[25%] right-[12%] w-4 h-4 text-white/30" />
        <SparkleIcon className="hero-float hero-float-3 absolute bottom-[30%] left-[15%] w-3 h-3 text-teal-100/30" />
        <CrossIcon className="hero-float hero-float-4 absolute top-[60%] left-[5%] w-6 h-6 text-teal-200/20" />
        <CrossIcon className="hero-float hero-float-5 absolute top-[10%] right-[30%] w-4 h-4 text-white/15" />
        <SparkleIcon className="hero-float hero-float-6 absolute bottom-[15%] right-[8%] w-6 h-6 text-teal-100/25" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="space-y-8">
            <div className="hero-fade-up hero-delay-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm font-medium text-teal-50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-200 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-100" />
                </span>
                Clinica Stomatologica Premium
              </span>
            </div>

            <h1 className="hero-fade-up hero-delay-2 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              Zambetul tau{' '}
              <span className="relative inline-block">
                <span className="relative z-10">merita</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-teal-300/30 rounded-sm -rotate-1" />
              </span>
              <br />
              <span className="hero-text-gradient">grija de exceptie</span>
            </h1>

            <p className="hero-fade-up hero-delay-3 text-lg sm:text-xl text-teal-50/90 max-w-lg leading-relaxed">
              Tehnologie de ultima generatie, echipa cu experienta si un mediu
              creat pentru confortul tau. Sanatatea dentara incepe aici.
            </p>

            <div className="hero-fade-up hero-delay-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/programare"
                className="hero-btn-primary group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white px-7 py-4 text-base font-semibold text-teal-700 shadow-xl shadow-teal-900/20 hover:shadow-2xl hover:shadow-teal-900/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                Programeaza Consultatie
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/servicii"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border-2 border-white/30 backdrop-blur-sm px-7 py-4 text-base font-semibold text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Descopera Serviciile
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Animated Stats */}
            <div className="hero-fade-up hero-delay-5 grid grid-cols-3 gap-6 pt-6 border-t border-white/15">
              <div ref={stat1.ref} className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                  {stat1.count}<span className="text-teal-200">+</span>
                </p>
                <p className="text-sm text-teal-100/70 mt-1">Ani Experienta</p>
              </div>
              <div ref={stat2.ref} className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                  {stat2.count}<span className="text-teal-200">+</span>
                </p>
                <p className="text-sm text-teal-100/70 mt-1">Pacienti Fericiti</p>
              </div>
              <div ref={stat3.ref} className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                  {stat3.count}<span className="text-teal-200">%</span>
                </p>
                <p className="text-sm text-teal-100/70 mt-1">Rata de Succes</p>
              </div>
            </div>
          </div>

          {/* Right: Illustration Composition */}
          <div className="hero-fade-up hero-delay-3 relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-[520px] aspect-square">
              {/* Background circle glow */}
              <div className="absolute inset-[10%] rounded-full bg-teal-400/10 blur-2xl hero-pulse" />

              {/* Main circle container */}
              <div className="absolute inset-[8%] rounded-full border-2 border-white/10 hero-spin-slow" />
              <div className="absolute inset-[16%] rounded-full border border-dashed border-white/8" />

              {/* Center tooth - main illustration */}
              <div className="absolute inset-0 flex items-center justify-center hero-float-gentle">
                <ToothIllustration className="w-40 h-48 drop-shadow-2xl" />
              </div>

              {/* Orbiting elements */}
              <div className="hero-orbit hero-orbit-1 absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="hero-orbit hero-orbit-2 absolute inset-0">
                <div className="absolute bottom-[5%] right-[5%]">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19.5 12.572l-7.5 7.428l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="hero-orbit hero-orbit-3 absolute inset-0">
                <div className="absolute top-[20%] left-0 -translate-x-1/2">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                    <SparkleIcon className="w-6 h-6 text-teal-100" />
                  </div>
                </div>
              </div>

              {/* Smile decoration */}
              <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 hero-float-gentle-delayed">
                <SmileIllustration className="w-48" />
              </div>

              {/* Dental mirror - right side */}
              <div className="absolute top-[15%] right-[2%] hero-float hero-float-7 opacity-60">
                <DentalMirrorIcon className="w-12 h-24" />
              </div>

              {/* Sparkle accents */}
              <div className="absolute top-[12%] right-[25%] hero-sparkle">
                <SparkleIcon className="w-4 h-4 text-teal-100" />
              </div>
              <div className="absolute bottom-[25%] left-[12%] hero-sparkle hero-sparkle-delayed">
                <SparkleIcon className="w-3 h-3 text-white/60" />
              </div>
              <div className="absolute top-[40%] right-[8%] hero-sparkle hero-sparkle-delayed-2">
                <SparkleIcon className="w-5 h-5 text-teal-200/50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 sm:h-20">
          <path d="M0 80V40C240 10 480 0 720 20C960 40 1200 50 1440 30V80H0Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
