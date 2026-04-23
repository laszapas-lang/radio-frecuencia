export default function Hero() {
  return (
    <>
      {/* Animaciones */}
      <style jsx global>{`
        @keyframes signalFlow {
          0% { left: -30%; }
          100% { left: 130%; }
        }

        @keyframes signalFlowSlow {
          0% { left: -50%; }
          100% { left: 120%; }
        }

        .animate-signal {
          animation: signalFlow 6s linear infinite;
        }

        .animate-signal-slow {
          animation: signalFlowSlow 9s linear infinite;
        }
      `}</style>

      <div className="bg-[#292524] relative">
        <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px] py-[120px]">
          <div className="max-w-[800px] flex flex-col gap-[32px]">
            
            {/* Eyebrow */}
            <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#9B1A2A] uppercase tracking-[0.15em]">
              EMISIÓN 001 / TRANSMISIÓN DIGITAL
            </p>

            {/* Title */}
            <h1 className="font-['Newsreader',serif] italic text-[64px] md:text-[96px] leading-[1.1] text-[#E8E3DB]">
              Radio Frecuencia
            </h1>

            {/* Subtitle */}
            <p className="font-['Space_Grotesk',sans-serif] text-[18px] leading-[1.6] text-[#E8E3DB] max-w-[600px]">
              Música en español sin interrupciones. Curaduría independiente desde el margen.
            </p>

            {/* CTA */}
            <a
              href="#player"
              className="border border-[#9B1A2A] px-[32px] py-[16px] self-start hover:bg-[#9B1A2A]/10 transition"
            >
              <p className="font-['Space_Grotesk',sans-serif] text-[14px] text-[#E8E3DB] uppercase tracking-[0.1em]">
                ESCUCHAR EN DIRECTO
              </p>
            </a>

          </div>
        </div>

        {/* Línea de señal minimal */}
        <div className="w-full h-[200px] md:h-[260px] flex items-center justify-center bg-[#1a1714] overflow-hidden">
          
          <div className="relative w-full max-w-[800px] h-[2px] bg-[#9B1A2A]/20 overflow-hidden">
            
            {/* base sutil */}
            <div className="absolute inset-0 bg-[#9B1A2A]/20"></div>

            {/* señal principal */}
            <div className="absolute top-0 left-[-30%] w-[30%] h-full bg-[#9B1A2A] opacity-70 blur-[1px] animate-signal"></div>

            {/* señal secundaria */}
            <div className="absolute top-0 left-[-50%] w-[20%] h-full bg-[#9B1A2A] opacity-40 blur-[2px] animate-signal-slow"></div>

          </div>
        </div>

      </div>
    </>
  );
}
