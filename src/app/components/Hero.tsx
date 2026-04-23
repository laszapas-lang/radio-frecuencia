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

      {/* BLOQUE EDITORIAL INFERIOR */}
      <div className="w-full bg-[#1a1714]">
       
        <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px] py-[48px] flex flex-col gap-[16px]">
         
          {/* Línea roja (NO TOCADA) */}
          <div className="w-full h-[1px] bg-[#9B1A2A]" />

          {/* Texto técnico */}
          <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/60 uppercase tracking-[0.15em]">
            SEÑAL ACTIVA · 320KBPS · MADRID
          </p>

        </div>

        {/* NUEVO BLOQUE MAPA */}
        <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px] pb-[80px]">

          <div className="w-full h-[320px] relative overflow-hidden">

            {/* textura tipo mapa */}
            <svg
              viewBox="0 0 800 400"
              className="w-full h-full opacity-[0.12]"
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

            {/* puntos (oyentes) */}
            <div className="absolute inset-0">
              {[
                { left: "20%", top: "40%", delay: "0s" },
                { left: "40%", top: "55%", delay: "0.5s" },
                { left: "65%", top: "35%", delay: "1s" },
                { left: "80%", top: "60%", delay: "0.8s" },
              ].map((p, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: p.left, top: p.top }}
                >
                  <div
                    className="w-[6px] h-[6px] bg-[#9B1A2A] rounded-full"
                    style={{
                      boxShadow: "0 0 20px #9B1A2A",
                      animation: `pulse 2.5s infinite`,
                      animationDelay: p.delay,
                    }}
                  />
                </div>
              ))}
            </div>

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
