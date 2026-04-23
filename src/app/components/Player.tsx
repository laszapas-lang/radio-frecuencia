export default function Player() {
  return (
    <div className="bg-[#292524] py-[80px]">
      <div className="max-w-[1280px] mx-auto px-[64px]">
        <div className="border border-[#E8E3DB]/10 p-[48px] flex flex-col gap-[32px]">
          {/* Top row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[12px]">
              <div className="w-[8px] h-[8px] bg-[#9B1A2A]" />
              <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB] uppercase tracking-[0.15em]">
                AHORA SUENA
              </p>
            </div>
            <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/40 uppercase tracking-[0.1em]">
              LATENCY: 24MS / 320KBPS
            </p>
          </div>

          {/* Track info */}
          <div className="flex flex-col gap-[8px]">
            <p className="font-['Newsreader',serif] text-[36px] leading-[1.2] text-[#E8E3DB]">
              Los Planetas
            </p>
            <p className="font-['Newsreader',serif] italic text-[24px] text-[#E8E3DB]/60">
              Santos que yo te pinté
            </p>
          </div>

          {/* Play button and Progress bar */}
          <div className="flex items-center gap-[32px]">
            <button className="w-[56px] h-[56px] bg-[#9B1A2A] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 4v12l10-6L6 4z" fill="#E8E3DB" />
              </svg>
            </button>
            <div className="flex-1 flex flex-col gap-[8px]">
              <div className="w-full h-[2px] bg-[#E8E3DB]/20 relative">
                <div className="h-full bg-[#9B1A2A] w-[50%]" />
              </div>
              <div className="flex justify-between">
                <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/60">
                  02:45
                </p>
                <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/60">
                  05:12
                </p>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex justify-between items-center">
            <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#E8E3DB]/60 uppercase tracking-[0.15em]">
              EMISIÓN CONTINUA · 24/7
            </p>
            <div className="flex items-center gap-[16px]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="#E8E3DB" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#E8E3DB" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="18" width="3" height="4" fill="#E8E3DB" />
                <rect x="7" y="13" width="3" height="9" fill="#E8E3DB" />
                <rect x="12" y="8" width="3" height="14" fill="#E8E3DB" />
                <rect x="17" y="3" width="3" height="19" fill="#E8E3DB" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
