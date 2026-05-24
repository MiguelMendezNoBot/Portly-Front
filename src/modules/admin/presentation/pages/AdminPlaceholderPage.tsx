export function AdminPlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-src-7c6bec">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <h2 className="text-white text-3xl font-bold mb-4">{title}</h2>
      <p className="text-src-9ca3af max-w-md mx-auto">
        Esta sección se encuentra en construcción. Pronto podrás gestionar aquí la información relacionada a <strong>{title.toLowerCase()}</strong>.
      </p>
    </div>
  );
}
