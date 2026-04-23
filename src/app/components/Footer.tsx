export default function Footer() {
  return (
    <div className="bg-[#292524] border-t border-[#E8E3DB]/20">
      <div className="max-w-[1280px] mx-auto px-[64px] py-[64px]">
        <div className="flex flex-col gap-[48px]">
          {/* Main row */}
          <div className="flex justify-between items-start">
            <p className="font-['Newsreader',serif] italic text-[36px] text-[#E8E3DB]">
              Radio Frecuencia
            </p>
            <div className="flex gap-[24px]">
              <p className="font-['Space_Grotesk',sans-serif] text-[12px] text-[#E8E3DB] uppercase tracking-[0.1em]">
                FICHA TÉCNICA
              </p>
              <p className="font-['Space_Grotesk',sans-serif] text-[12px] text-[#E8E3DB] uppercase tracking-[0.1em]">
                ·
              </p>
              <p className="font-['Space_Grotesk',sans-serif] text-[12px] text-[#E8E3DB] uppercase tracking-[0.1em]">
                CONTACTO
              </p>
            </div>
          </div>

          {/* Copyright */}
          <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/40 uppercase tracking-[0.1em]">
            ©2026 RADIO FRECUENCIA. EMISIÓN CONTINUA.
          </p>
        </div>
      </div>
    </div>
  );
}
