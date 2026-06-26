export default function Footer() {
  return (
    <footer className="border-t border-light-gray bg-background mt-24">
      <div className="mx-auto max-w-content px-6 md:px-10 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="text-xs text-text-gray leading-relaxed text-justify">
          <p className="uppercase tracking-widest2">HS313 · Digital Humanities</p>
          <p className="uppercase tracking-widest2">Capstone Project</p>
          <p className="mt-3">Clara Eunyoung Chang</p>
          <p className="mt-3">Taejae University · Spring 2026</p>
        </div>
        <div className="flex justify-end flex-1">
          <img src="/images/logo/logo_final.webp" alt="Art of Korea" className="h-40 w-auto mr-0" />
        </div>
      </div>
    </footer>
  );
}
