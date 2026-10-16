import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xl font-semibold tracking-tight text-neutral-950"
            >
              <span>Job</span>
              <span className="text-neutral-400">Portal</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-500">
              Find opportunities that match your skills, connect with great
              companies, and take the next step in your career.
            </p>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-950">
              For Candidates
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/jobs"
                  className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                >
                  Browse Jobs
                </Link>
              </li>

              <li>
                <Link
                  href="/companies"
                  className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                >
                  Explore Companies
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-950">Company</h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 border-t border-neutral-200 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-neutral-500">
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>

          <Link
            href="/jobs"
            className="font-medium text-neutral-700 transition-colors hover:text-neutral-950"
          >
            Find your next opportunity
          </Link>
        </div>
      </div>
    </footer>
  );
}
