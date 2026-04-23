export default function Hero() {
  return (
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

      {/* Imagen editorial abstracta */}
      <div className="w-full h-[400px] relative overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 680 400"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.85 }}
        >
          <rect width="680" height="400" fill="#171514"/>

          <g stroke="#E8E3DB" strokeWidth="0.3" opacity="0.06">
            <line x1="113" y1="0" x2="113" y2="400"/>
            <line x1="226" y1="0" x2="226" y2="400"/>
            <line x1="340" y1="0" x2="340" y2="400"/>
            <line x1="453" y1="0" x2="453" y2="400"/>
            <line x1="566" y1="0" x2="566" y2="400"/>
          </g>

          <rect x="40" y="195" width="600" height="1" fill="#9B1A2A" opacity="0.6"/>

          <text x="40" y="170" fontFamily="monospace" fontSize="10" fill="#E8E3DB" opacity="0.35" letterSpacing="4">
            EMISIÓN · 001 · TRANSMISIÓN DIGITAL
          </text>
          <text x="40" y="220" fontFamily="monospace" fontSize="9" fill="#9B1A2A" opacity="0.7" letterSpacing="3">
            MÚSICA INDEPENDIENTE ESPAÑOLA
          </text>

          <g opacity="0.4" fontFamily="monospace" fontSize="9" fill="#E8E3DB" letterSpacing="2">
            <text x="500" y="120">320 KBPS</text>
            <text x="500" y="140">24 / 7</text>
            <text x="500" y="160">AAC+</text>
            <text x="500" y="180">STEREO</text>
          </g>

          <g stroke="#E8E3DB" strokeWidth="0.4" opacity="0.08">
            <line x1="500" y1="280" x2="640" y2="280"/>
            <line x1="500" y1="300" x2="640" y2="300"/>
            <line x1="500" y1="320" x2="640" y2="320"/>
            <line x1="500" y1="340" x2="640" y2="340"/>
            <line x1="500" y1="360" x2="640" y2="360"/>
            <line x1="500" y1="280" x2="500" y2="360"/>
            <line x1="520" y1="280" x2="520" y2="360"/>
            <line x1="540" y1="280" x2="540" y2="360"/>
            <line x1="560" y1="280" x2="560" y2="360"/>
            <line x1="580" y1="280" x2="580" y2="360"/>
            <line x1="600" y1="280" x2="600" y2="360"/>
            <line x1="620" y1="280" x2="620" y2="360"/>
            <line x1="640" y1="280" x2="640" y2="360"/>
          </g>

          <g fill="#9B1A2A" opacity="0.7">
            <rect x="521" y="281" width="18" height="18"/>
            <rect x="561" y="301" width="18" height="18"/>
            <rect x="541" y="321" width="18" height="18"/>
            <rect x="601" y="281" width="18" height="18"/>
            <rect x="581" y="341" width="18" height="18"/>
            <rect x="621" y="321" width="18" height="18"/>
          </g>

          <g fill="#E8E3DB" opacity="0.08">
            <rect x="501" y="281" width="18" height="18"/>
            <rect x="521" y="301" width="18" height="18"/>
            <rect x="581" y="281" width="18" height="18"/>
            <rect x="601" y="321" width="18" height="18"/>
            <rect x="541" y="341" width="18" height="18"/>
            <rect x="621" y="301" width="18" height="18"/>
            <rect x="501" y="341" width="18" height="18"/>
          </g>

          <line x1="40" y1="380" x2="460" y2="270" stroke="#9B1A2A" strokeWidth="0.5" opacity="0.2"/>

          <rect x="640" y="20" width="20" height="1" fill="#9B1A2A" opacity="0.6"/>
          <rect x="659" y="20" width="1" height="20" fill="#9B1A2A" opacity="0.6"/>
          <rect x="20" y="379" width="20" height="1" fill="#9B1A2A" opacity="0.6"/>
          <rect x="20" y="360" width="1" height="20" fill="#9B1A2A" opacity="0.6"/>

        </svg>
      </div>
    </div>
  );
}
