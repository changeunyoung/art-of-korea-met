export default function Footer() {
  return (
    <footer className="border-t border-light-gray bg-background mt-24">
      <div className="mx-auto max-w-content px-6 md:px-10 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="text-xs text-text-gray leading-relaxed text-justify">
          <p className="uppercase tracking-widest2">HS313 · Digital Humanities</p>
          <p className="uppercase tracking-widest2">Capstone Project</p>
          <p className="mt-3">Clara Eunyoung Chang</p>
          <p className="mt-3">Taejae University · Spring 2026</p>
          <div className="mt-4 flex items-center gap-4">
            <a
              href="mailto:eunyoung@taejae.ac.kr"
              aria-label="Email"
              className="text-text-gray hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 6 10 7 10-7" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/clarachxng/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-text-gray hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/eunyoungclarachang/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-text-gray hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <rect x="2" y="2" width="20" height="20" rx="3" />
                <line x1="7" y1="10" x2="7" y2="17" />
                <circle cx="7" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
                <path d="M11 17v-4.5a2.5 2.5 0 0 1 5 0V17" />
                <line x1="11" y1="10" x2="11" y2="17" />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex justify-end flex-1">
          <img src="/images/logo/logo_final.webp" alt="Art of Korea" className="h-40 w-auto mr-0 mt-3" />
        </div>
      </div>
    </footer>
  );
}
