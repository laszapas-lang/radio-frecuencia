import imgPlaceholderImage from "figma:asset/d568b164c26b35eebe6a407c03f478bc8049c84b.png";

export default function Identity() {
  return (
    <div className="bg-[#292524] py-[120px]">
      <div className="max-w-[1280px] mx-auto px-[64px]">
        <div className="max-w-[900px] flex flex-col gap-[48px]">
          <p className="font-['Newsreader',serif] italic text-[42px] leading-[1.5] text-[#E8E3DB]">
            Selección alternativa de música en español. Sin interrupciones. Un refugio sonoro contra el algoritmo, diseñado para la escucha atenta y la apreciación del ruido con intención.
          </p>

          <div className="w-[120px] h-[2px] bg-[#9B1A2A]" />

          <div className="flex flex-col gap-[12px]">
            <div className="w-full h-[400px] relative">
              <img alt="" className="w-full h-full object-cover opacity-30" src={imgPlaceholderImage} />
            </div>
            <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#E8E3DB]/60 uppercase tracking-[0.15em]">
              FREQUENCY MODULE V.09
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
