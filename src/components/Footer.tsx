import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const navigationLinks = [
  { href: "/", label: "Acasa" },
  { href: "/servicii", label: "Servicii" },
  { href: "/echipa", label: "Echipa" },
  { href: "/programare", label: "Programare" },
  { href: "/contact", label: "Contact" },
];

const serviciiLinks = [
  { href: "/servicii#consultatie", label: "Consultatie" },
  { href: "/servicii#implantologie", label: "Implantologie" },
  { href: "/servicii#ortodontie", label: "Ortodontie" },
  { href: "/servicii#estetica", label: "Estetica" },
  { href: "/servicii#protetica", label: "Protetica" },
];

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2C9.5 2 7 3.5 6 6c-1.5 3.5-1 7 0 10 .7 2.2 1.5 4 2.5 5.5.4.6 1 .5 1.3-.1.5-1.2 1-3 2.2-3 1.2 0 1.7 1.8 2.2 3 .3.6.9.7 1.3.1 1-1.5 1.8-3.3 2.5-5.5 1-3 1.5-6.5 0-10-1-2.5-3.5-4-6-4z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <ToothIcon className="size-7 text-teal-400 transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold tracking-tight text-white">
                DentAura
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Clinica dentara moderna in Bucuresti, dedicata sanatatii si
              zambetului tau. Tehnologie avansata, echipa experimentata si
              tratamente personalizate.
            </p>
          </div>

          {/* Navigatie */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navigatie
            </h3>
            <ul className="mt-4 space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicii */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Servicii
            </h3>
            <ul className="mt-4 space-y-3">
              {serviciiLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-teal-400" />
                <span className="text-sm text-slate-400">
                  Str. Victoriei 120, Sector 1, Bucuresti
                </span>
              </li>
              <li>
                <a
                  href="tel:+40721234567"
                  className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-teal-400"
                >
                  <Phone className="size-4 shrink-0 text-teal-400" />
                  +40 721 234 567
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@dentaura.ro"
                  className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-teal-400"
                >
                  <Mail className="size-4 shrink-0 text-teal-400" />
                  contact@dentaura.ro
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-teal-400" />
                <div className="text-sm text-slate-400">
                  <p>Luni - Vineri: 09:00 - 17:00</p>
                  <p>Sambata: 09:00 - 13:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-center text-sm text-slate-500">
            &copy; 2026 DentAura. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}
