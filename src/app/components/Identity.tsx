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
          
          {/* Texto */}
          <p className="font-['Newsreader',serif] italic text-[42px] leading-[1.5] text-[#E8E3DB]">
            Selección de música en español. Sin interrupciones.
          </p>

          <div className="w-[120px] h-[2px] bg-[#9B1A2A]" />

          {/* BLOQUE MAPA */}
          <div className="flex flex-col gap-[16px]">

            {/* CONTADOR */}
            <div className="flex justify-between items-center">
              <p className="font-['Space_Grotesk'] text-[11px] text-[#E8E3DB]/50 uppercase tracking-[0.15em]">
                RED GLOBAL
              </p>

              <p className="font-['Space_Grotesk'] text-[11px] text-[#E8E3DB] uppercase tracking-[0.15em]">
                {listeners} OYENTES
              </p>
            </div>

            {/* MAPA */}
            <div className="w-full h-[400px] relative overflow-hidden bg-[#1a1714]">

              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full opacity-[0.15]"
              >
                <path
                  d="
                  M150 220 L200 180 L260 190 L300 160 L340 180 L360 210 L330 240 L280 260 L230 250 Z
                  M420 200 L480 180 L520 190 L560 170 L600 190 L620 230 L580 260 L520 250 L460 240 Z
                  M700 220 L740 200 L780 210 L800 240 L760 260 L720 250 Z
                  "
                  fill="#E8E3DB"
                />
              </svg>

              {/* puntos */}
              <div className="absolute inset-0">
                {[
                  { left: "20%", top: "45%", delay: "0s" },
                  { left: "45%", top: "55%", delay: "0.6s" },
                  { left: "70%", top: "40%", delay: "1.2s" },
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
            <p className="font-['Space_Grotesk'] text-[10px] text-[#E8E3DB]/60 uppercase tracking-[0.15em]">
              FREQUENCY MODULE · GLOBAL SIGNAL
            </p>

          </div>

        </div>
      </div>

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
