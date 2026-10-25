"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarContent from "./sidebar-content";
import { usePathname } from "next/navigation";

export default function RecruiterSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top Header */}
      <header className="fixed top-0 z-40 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white px-4 lg:hidden">
        <Link
          href="/recruiter/dashboard"
          className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-neutral-950"
        >
          Job<span className="text-neutral-400">Portal</span>
          <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-xs font-semibold text-white">
            Recruiter
          </span>
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg border border-neutral-200 p-2 text-neutral-700 hover:bg-neutral-50"
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-neutral-200 bg-white transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
          aria-label="Close sidebar menu"
        >
          <X size={20} />
        </button>

        <SidebarContent
          pathname={pathname}
          closeSidebar={() => setOpen(false)}
        />
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-neutral-200 bg-white lg:flex">
        <SidebarContent
          pathname={pathname}
          closeSidebar={() => setOpen(false)}
        />
      </aside>
    </>
  );
}
