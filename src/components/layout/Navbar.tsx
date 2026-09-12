"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

import { navigationItems } from "@/data/navigation";
import { PageContainer } from "@/components/layout/PageContainer";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur-sm">
      <PageContainer>
        <nav
          aria-label="Primary navigation"
          className="flex min-h-[4.25rem] items-center justify-between gap-6"
        >
          <Link
            className="font-serif text-xl font-semibold tracking-[-0.03em] text-ink transition-colors hover:text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
            href="/"
            onClick={() => setIsMenuOpen(false)}
          >
            Mingyang Jiang
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navigationItems.map((item) => {
              const isActive = item.href === "/";

              return (
                <Link
                  key={item.href}
                  className={`relative py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 ${
                    isActive
                      ? "text-accent-dark after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent"
                      : "text-muted hover:text-ink"
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              aria-label="Search (coming later)"
              className="rounded-md p-2 text-muted transition-colors hover:bg-accent-soft hover:text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              disabled
              type="button"
            >
              <Search aria-hidden="true" size={17} strokeWidth={1.8} />
            </button>
          </div>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            className="rounded-md p-2 text-ink transition-colors hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            type="button"
          >
            {isMenuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
          </button>
        </nav>

        {isMenuOpen && (
          <div id="mobile-navigation" className="border-t border-line py-3 md:hidden">
            <div className="flex flex-col">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  className={`border-b border-line py-3 text-sm font-medium last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset ${
                    item.href === "/" ? "text-accent-dark" : "text-muted"
                  }`}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </header>
  );
}

