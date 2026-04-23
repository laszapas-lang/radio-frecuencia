export default function Hero() {
  return (
    <div className="bg-[#292524]">

      {/* CONTENIDO */}
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

      {/* BLOQUE EDITORIAL + MAPA */}
      <div className="w-full bg-[#1a1714] relative overflow-hidden">
        
        <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px] py-[80px] flex flex-col gap-[32px]">
          
          {/* Línea roja */}
          <div className="w-full h-[1px] bg-[#9B1A2A]/40" />

          {/* Header */}
          <div className="flex justify-between items-center">
            <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/60 uppercase tracking-[0.15em]">
              SEÑAL GLOBAL
            </p>

            <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/40">
              emisión en directo · 24/7
            </p>
          </div>

          {/* MAPA */}
          <div className="relative w-full h-[260px]">

            {/* fondo abstracto */}
            <svg
              viewBox="0 0 800 400"
              className="w-full h-full opacity-[0.06]"
            >
              <path
                d="M50 200 C150 150, 250 250, 350 200 S550 150, 750 220"
                stroke="#E8E3DB"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M100 300 C200 260, 300 320, 400 300 S600 260, 700 300"
                stroke="#E8E3DB"
                strokeWidth="1"
                fill="none"
              />
            </svg>

            {/* puntos animados */}
            <div className="absolute inset-0">

              {[
                { left: "18%", top: "45%", delay: "0s" },
                { left: "38%", top: "60%", delay: "0.5s" },
                { left: "60%", top: "35%", delay: "1s" },
                { left: "78%", top: "55%", delay: "0.8s" },
              ].map((p, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: p.left, top: p.top }}
                >
                  <div
                    className="w-[6px] h-[6px] bg-[#9B1A2A] rounded-full"
                    style={{
                      boxShadow: "0 0 10px #9B1A2A",
                      animation: `pulse 2.5s infinite`,
                      animationDelay: p.delay,
                    }}
                  />
                </div>
              ))}

            </div>

          </div>

          {/* Texto editorial */}
          <p className="font-['Newsreader',serif] italic text-[20px] md:text-[24px] text-[#E8E3DB]/60 max-w-[520px]">
            La señal se expande. Distintos lugares, una misma escucha.
          </p>

        </div>

      </div>

      {/* ANIMACIÓN INLINE (sin globals.css) */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.6);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.4;
          }
        }
      `}</style>

    </div>
  );
}
