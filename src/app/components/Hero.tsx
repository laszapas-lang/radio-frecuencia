export default function Hero() {
  return (
    <>
      <div className="bg-[#292524] relative">
        
        {/* CONTENIDO */}
        <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px] py-[120px]">
          <div className="max-w-[800px] flex flex-col gap-[32px]">
            
            <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#9B1A2A] uppercase tracking-[0.15em]">
              EMISIÓN 001 / TRANSMISIÓN DIGITAL
            </p>

            <h1 className="font-['Newsreader',serif] italic text-[64px] md:text-[96px] leading-[1.1] text-[#E8E3DB]">
              Radio Frecuencia
            </h1>

            <p className="font-['Space_Grotesk',sans-serif] text-[18px] leading-[1.6] text-[#E8E3DB] max-w-[600px]">
              Música en español sin interrupciones. Curaduría independiente desde el margen.
            </p>

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

        {/* ONDA */}
        <div className="w-full h-[220px] md:h-[260px] flex items-center justify-center bg-[#1a1714] overflow-hidden">
          
          <svg
            viewBox="0 0 800 200"
            className="w-full max-w-[1000px]"
            fill="none"
          >
            <path
              stroke="#9B1A2A"
              strokeWidth="2"
              fill="none"
            >
              <animate
                attributeName="d"
                dur="6s"
                repeatCount="indefinite"
                values="
                M0 100 Q100 100 200 100 T400 100 T600 100 T800 100;
                M0 100 Q100 60 200 100 T400 140 T600 80 T800 100;
                M0 100 Q100 140 200 100 T400 60 T600 120 T800 100;
                M0 100 Q100 80 200 100 T400 120 T600 60 T800 100;
                M0 100 Q100 100 200 100 T400 100 T600 100 T800 100
                "
              />
            </path>
          </svg>

        </div>

      </div>
    </>
  );
}
