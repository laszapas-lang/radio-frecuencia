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
          
          {/* Línea roja */}
          <div className="w-full h-[1px] bg-[#9B1A2A]" />

          {/* Texto técnico */}
          <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/60 uppercase tracking-[0.15em]">
            SEÑAL ACTIVA · 320KBPS · MADRID
          </p>

        </div>

      </div>

    </div>
  );
}
