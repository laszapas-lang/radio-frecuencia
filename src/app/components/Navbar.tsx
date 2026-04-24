export default function Navbar() {
  return (
    <nav className="bg-[#292524] border-b border-[#E8E3DB]/20">
      <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px] py-[24px] flex items-center justify-between">

        {/* Logo + Nombre */}
        <div className="flex items-center gap-[16px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="#E8E3DB" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="3" fill="#9B1A2A" />
          </svg>
          <p className="font-['Space_Grotesk',sans-serif] text-[14px] text-[#E8E3DB] uppercase tracking-[0.2em]">
            RADIO FRECUENCIA
          </p>
        </div>

        {/* Links derecha */}
        <div className="flex items-center gap-[32px]">
          <a
            href="/ficha-tecnica"
            className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/50 uppercase tracking-[0.15em] hover:text-[#E8E3DB] transition-colors duration-200"
          >
            FICHA TÉCNICA
          </a>
          <a
            href="mailto:hola@radiofrecuencia.fm"
            className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/50 uppercase tracking-[0.15em] hover:text-[#E8E3DB] transition-colors duration-200"
          >
            CONTACTO
          </a>
        </div>

      </div>
    </nav>
  );
}
