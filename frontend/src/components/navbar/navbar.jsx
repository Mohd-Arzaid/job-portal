"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  UserRound,
  LogOut,
  ChevronDown,
  BriefcaseBusiness,
  Building2,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isRecruiter = user?.role === "recruiter";

  const navLinks = isRecruiter
    ? [
        { href: "/admin/companies", label: "Companies" },
        { href: "/admin/jobs", label: "Manage Jobs" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/jobs", label: "Find Jobs" },
        { href: "/browse", label: "Browse Jobs" },
      ];

  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const closeMobileMenu = () => setIsMenuOpen(false);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="inline-flex shrink-0 items-center gap-1 text-center text-2xl font-bold tracking-tight text-neutral-950"
        >
          <span>Job</span>
          <span className="text-neutral-500">Portal</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-neutral-100 text-neutral-950"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="hidden h-9 items-center rounded-md px-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950 sm:inline-flex"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98]"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((open) => !open)}
                aria-expanded={isProfileOpen}
                aria-label="Open profile menu"
                className="flex items-center gap-2 rounded-lg border border-neutral-200 p-1.5 pr-3 transition-colors hover:bg-neutral-100"
              >
                <div className="flex size-8 items-center justify-center rounded-md bg-neutral-100 text-sm font-semibold text-neutral-800">
                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <span className="hidden max-w-28 truncate text-sm font-medium text-neutral-800 sm:block">
                  {user.fullName}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-neutral-500 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg shadow-black/5">
                  <div className="border-b border-neutral-100 px-4 py-4">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {user.fullName}
                    </p>

                    <p className="mt-1 text-xs capitalize text-neutral-500">
                      {user.role}
                    </p>
                  </div>

                  <div className="p-2">
                    {isRecruiter ? (
                      <>
                        <DropdownLink
                          href="/admin/companies"
                          icon={<Building2 size={17} />}
                          label="My Company"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <DropdownLink
                          href="/admin/jobs"
                          icon={<BriefcaseBusiness size={17} />}
                          label="Manage Jobs"
                          onClick={() => setIsProfileOpen(false)}
                        />
                      </>
                    ) : (
                      <DropdownLink
                        href="/profile"
                        icon={<UserRound size={17} />}
                        label="My Profile"
                        onClick={() => setIsProfileOpen(false)}
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setUser(null);
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="inline-flex size-9 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950 md:hidden"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-neutral-100 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`block rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-neutral-100 text-neutral-950"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {!user && (
              <div className="grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex h-10 items-center justify-center rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="flex h-10 items-center justify-center rounded-lg bg-neutral-900 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function DropdownLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
    >
      {icon}
      {label}
    </Link>
  );
}
