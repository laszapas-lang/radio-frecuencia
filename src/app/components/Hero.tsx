import imgPlaceholderImage from "figma:asset/b4d0118543bc011744949ebbf871f95430182503.png";

export default function Hero() {
  return (
    <div className="bg-[#292524] relative">
      <div className="max-w-[1280px] mx-auto px-[64px] py-[120px]">
        <div className="max-w-[800px] flex flex-col gap-[32px]">
          <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#9B1A2A] uppercase tracking-[0.15em]">
            EMISIÓN 001 / TRANSMISIÓN DIGITAL
          </p>

          <h1 className="font-['Newsreader',serif] italic text-[96px] leading-[1.1] text-[#E8E3DB]">
            Radio<br />Frecuencia
          </h1>

          <p className="font-['Space_Grotesk',sans-serif] text-[18px] leading-[1.6] text-[#E8E3DB] max-w-[600px]">
            Música en español sin interrupciones. Curaduría independiente desde el margen.
          </p>

          <button className="border border-[#9B1A2A] px-[32px] py-[16px] self-start">
            <p className="font-['Space_Grotesk',sans-serif] text-[14px] text-[#E8E3DB] uppercase tracking-[0.1em]">
              ESCUCHAR EN DIRECTO
            </p>
          </button>
        </div>
      </div>

      <div className="w-full h-[400px] relative">
        <img alt="" className="w-full h-full object-cover opacity-40" src={imgPlaceholderImage} />
      </div>
    </div>
  );
}
