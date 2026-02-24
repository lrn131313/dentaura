"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Acasa" },
  { href: "/servicii", label: "Servicii" },
  { href: "/echipa", label: "Echipa" },
  { href: "/programare", label: "Programare" },
  { href: "/contact", label: "Contact" },
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

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <ToothIcon className="size-7 text-teal-600 transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold tracking-tight text-teal-600">
            DentAura
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-teal-600 bg-teal-50"
                    : "text-slate-600 hover:text-teal-600 hover:bg-teal-50/50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button asChild className="rounded-lg bg-teal-600 hover:bg-teal-700">
            <Link href="/programare">Programeaza-te</Link>
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Deschide meniul"
          >
            <Menu className="size-5" />
          </Button>

          <SheetContent side="right" className="w-[300px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <ToothIcon className="size-6 text-teal-600" />
                <span className="text-lg font-bold text-teal-600">
                  DentAura
                </span>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-4 pt-4">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "text-teal-600 bg-teal-50"
                          : "text-slate-600 hover:text-teal-600 hover:bg-teal-50/50"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                );
              })}

              <div className="mt-4 pt-4 border-t">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full rounded-lg bg-teal-600 hover:bg-teal-700"
                  >
                    <Link href="/programare">Programeaza-te</Link>
                  </Button>
                </SheetClose>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
