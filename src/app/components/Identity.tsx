export default function Identity() {
  return (
    <div className="bg-[#292524] py-[120px]">
      <div className="max-w-[1280px] mx-auto px-[64px]">
        <div className="max-w-[900px] flex flex-col gap-[48px]">
          
          {/* Texto principal */}
          <p className="font-['Newsreader',serif] italic text-[42px] leading-[1.5] text-[#E8E3DB]">
            Selección de música en español. Sin interrupciones.
          </p>

          {/* Línea roja */}
          <div className="w-[120px] h-[2px] bg-[#9B1A2A]" />

          {/* BLOQUE VISUAL */}
          <div className="flex flex-col gap-[12px]">

            {/* MAPA EDITORIAL */}
            <div className="w-full h-[400px] relative overflow-hidden bg-[#1a1714]">

              {/* textura tipo mapa */}
              <svg
                viewBox="0 0 800 400"
                className="w-full h-full opacity-[0.1]"
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

              {/* puntos activos */}
              <div className="absolute inset-0">
                {[
                  { left: "20%", top: "40%", delay: "0s" },
                  { left: "45%", top: "55%", delay: "0.6s" },
                  { left: "70%", top: "35%", delay: "1.2s" },
                  { left: "85%", top: "60%", delay: "0.9s" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{ left: p.left, top: p.top }}
                  >
                    <div
                      className="w-[6px] h-[6px] bg-[#9B1A2A] rounded-full"
                      style={{
                        boxShadow: "0 0 16px #9B1A2A",
                        animation: `pulse 2.5s infinite`,
                        animationDelay: p.delay,
                      }}
                    />
                  </div>
                ))}
              </div>

            </div>

            {/* caption */}
            <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#E8E3DB]/60 uppercase tracking-[0.15em]">
              FREQUENCY MODULE V.09
            </p>

          </div>

        </div>
      </div>

      {/* animación */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1.6); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.4; }
        }
      `}</style>

    </div>
  );
}
