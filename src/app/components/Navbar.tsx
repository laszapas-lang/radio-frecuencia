export default function Navbar() {
  return (
    <nav className="bg-[#292524] border-b border-[#E8E3DB]/20">
      <div className="max-w-[1280px] mx-auto px-[64px] py-[24px] flex items-center gap-[16px]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#E8E3DB" strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="3" fill="#9B1A2A" />
        </svg>
        <p className="font-['Space_Grotesk',sans-serif] text-[14px] text-[#E8E3DB] uppercase tracking-[0.2em]">
          RADIO FRECUENCIA
        </p>
      </div>
    </nav>
  );
}
