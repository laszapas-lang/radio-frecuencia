import { useEffect, useState } from "react";

const STATION_API = "https://TU_AZURACAST.elest.io/api/nowplaying/1";

export default function Identity() {
  const [listeners, setListeners] = useState(0);

  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const res = await fetch(STATION_API);
        const data = await res.json();
        setListeners(data.listeners?.current || 0);
      } catch {}
    };

    fetchListeners();
    const interval = setInterval(fetchListeners, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#292524] py-[120px]">
      <div className="max-w-[1280px] mx-auto px-[64px]">
        <div className="max-w-[900px] flex flex-col gap-[48px]">
          
          {/* TEXTO */}
          <p className="font-['Newsreader',serif] italic text-[42px] leading-[1.5] text-[#E8E3DB]">
            Selección de música en español. Sin interrupciones.
          </p>

          <div className="w-[120px] h-[2px] bg-[#9B1A2A]" />

          {/* BLOQUE MAPA */}
          <div className="flex flex-col gap-[16px]">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <p className="font-['Space_Grotesk'] text-[11px] text-[#E8E3DB]/50 uppercase tracking-[0.15em]">
                RED GLOBAL
              </p>

              <p className="font-['Space_Grotesk'] text-[11px] text-[#E8E3DB] uppercase tracking-[0.15em]">
                {listeners} OYENTES
              </p>
            </div>

            {/* MAPA (más pequeño) */}
            <div className="w-full h-[240px] relative overflow-hidden bg-[#1a1714]">

              {/* MAPA REAL SIMPLIFICADO */}
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full opacity-[0.12]"
              >
                <path
                  d="M120 250 L180 200 L240 210 L280 180 L320 200 L340 240 L300 270 L250 280 L200 270 Z
                     M380 230 L450 200 L520 210 L560 190 L620 210 L650 250 L600 280 L520 270 L450 260 Z
                     M700 240 L740 220 L780 230 L800 260 L760 280 L720 270 Z"
                  fill="#E8E3DB"
                />
              </svg>

              {/* PUNTOS ROJOS */}
              <div className="absolute inset-0">
                {[
                  { left: "22%", top: "55%" },
                  { left: "48%", top: "60%" },
                  { left: "68%", top: "50%" },
                  { left: "80%", top: "65%" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="absolute w-[6px] h-[6px] bg-[#9B1A2A] rounded-full"
                    style={{
                      left: p.left,
                      top: p.top,
                      boxShadow: "0 0 12px #9B1A2A",
                    }}
                  />
                ))}
              </div>

            </div>

            {/* CAPTION */}
            <p className="font-['Space_Grotesk'] text-[10px] text-[#E8E3DB]/60 uppercase tracking-[0.15em]">
              GLOBAL LISTENING SIGNAL
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}
