import RecruiterSidebar from "../recruiter/recruiter-sidebar";

export default function RecruiterLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-neutral-50/60">
      <RecruiterSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
