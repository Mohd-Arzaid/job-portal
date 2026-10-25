"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  UserRound,
  LogOut,
  ChevronDown,
  BriefcaseBusiness,
  LoaderCircle,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import useLogout from "@/hooks/use-logout";

export default function Navbar() {
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Reference for the complete profile dropdown area
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const { handleLogout, isLoggingOut } = useLogout();

  const isRecruiter = user?.role === "recruiter";
  const fullName = user?.fullName || user?.fullname || "User";
  const profilePhoto = user?.profile?.profilePhoto;

  const navLinks = isRecruiter
    ? [
        { href: "/", label: "Home" },
        { href: "/jobs", label: "Find Jobs" },
        { href: "/recruiter/dashboard", label: "Dashboard" },
        { href: "/recruiter/jobs/create", label: "Post a Job" },
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

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-1 text-2xl font-bold tracking-tight text-neutral-950"
        >
          Job<span className="text-neutral-400">Portal</span>
          <span className="ml-1.5 size-1.5 rounded-full bg-neutral-900" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-full border border-neutral-200/80 bg-neutral-50/80 p-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenus}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-white hover:text-neutral-950"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link
                href="/login"
                onClick={closeMenus}
                className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 sm:inline-flex"
              >
                Log in
              </Link>

              <Link
                href="/register"
                onClick={closeMenus}
                className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-700 active:scale-[0.98]"
              >
                Get started
              </Link>
            </>
          ) : (
            <div ref={profileRef} className="relative">
              {/* Profile Button: Circular Image + Name */}
              <button
                type="button"
                onClick={() => setIsProfileOpen((open) => !open)}
                aria-expanded={isProfileOpen}
                aria-label="Open profile menu"
                className={`flex items-center gap-2.5 rounded-full border p-1.5 pr-3 transition-all duration-200 ${
                  isProfileOpen
                    ? "border-neutral-300 bg-neutral-50"
                    : "border-transparent hover:border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={fullName}
                    className="size-9 shrink-0 rounded-full border border-neutral-200 object-cover"
                  />
                ) : (
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="hidden max-w-28 truncate text-sm font-semibold text-neutral-800 sm:block">
                  {fullName}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-neutral-500 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[280px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/[0.08]">
                  {/* User Image + Name Only */}
                  <div className="border-b border-neutral-100 px-4 py-4">
                    <div className="flex items-center gap-3">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt={fullName}
                          className="size-11 shrink-0 rounded-full border border-neutral-200 object-cover"
                        />
                      ) : (
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                          {fullName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <p className="truncate text-sm font-semibold text-neutral-950">
                        {fullName}
                      </p>
                    </div>
                  </div>

                  <div className="p-2">
                    <DropdownLink
                      href="/profile"
                      icon={<UserRound size={17} />}
                      label="My Profile"
                      onClick={closeMenus}
                    />

                    {!isRecruiter && (
                      <DropdownLink
                        href="/applied-jobs"
                        icon={<FileText size={17} />}
                        label="Applied Jobs"
                        onClick={closeMenus}
                      />
                    )}

                    {isRecruiter && (
                      <DropdownLink
                        href="/recruiter/dashboard"
                        icon={<BriefcaseBusiness size={17} />}
                        label="Recruiter Dashboard"
                        onClick={closeMenus}
                      />
                    )}

                    <div className="my-2 border-t border-neutral-100" />

                    <button
                      type="button"
                      disabled={isLoggingOut}
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoggingOut ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <LogOut size={17} />
                      )}

                      {isLoggingOut ? "Logging out..." : "Log out"}
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
            className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:bg-neutral-100 md:hidden"
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-neutral-100 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="mt-3 border-t border-neutral-100 pt-3">
                {/* Mobile User Image + Name Only */}
                <div className="flex items-center gap-3 px-3 py-3">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt={fullName}
                      className="size-11 shrink-0 rounded-full border border-neutral-200 object-cover"
                    />
                  ) : (
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <p className="truncate text-sm font-semibold text-neutral-950">
                    {fullName}
                  </p>
                </div>

                <DropdownLink
                  href="/profile"
                  icon={<UserRound size={17} />}
                  label="My Profile"
                  onClick={closeMenus}
                />

                {!isRecruiter && (
                  <DropdownLink
                    href="/applied-jobs"
                    icon={<FileText size={17} />}
                    label="Applied Jobs"
                    onClick={closeMenus}
                  />
                )}

                {isRecruiter && (
                  <DropdownLink
                    href="/recruiter/dashboard"
                    icon={<BriefcaseBusiness size={17} />}
                    label="Recruiter Dashboard"
                    onClick={closeMenus}
                  />
                )}

                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {isLoggingOut ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <LogOut size={17} />
                  )}

                  {isLoggingOut ? "Logging out..." : "Log out"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4">
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="flex h-11 items-center justify-center rounded-full border border-neutral-200 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenus}
                  className="flex h-11 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white transition hover:bg-neutral-700"
                >
                  Get started
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
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
    >
      {icon}
      {label}
    </Link>
  );
}
