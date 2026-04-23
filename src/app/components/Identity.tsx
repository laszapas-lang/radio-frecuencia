import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const STATION_API = "https://TU_AZURACAST.elest.io/api/nowplaying/1";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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

  const points = [
    { coordinates: [-3.7, 40.4] },
    { coordinates: [-99.1, 19.4] },
    { coordinates: [-58.4, -34.6] },
    { coordinates: [-74, 40.7] },
    { coordinates: [2.3, 48.8] },
  ];

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
          <div className="flex flex-col gap-[20px] max-w-[420px]">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <p className="font-['Space_Grotesk'] text-[11px] text-[#E8E3DB]/50 uppercase tracking-[0.15em]">
                RED GLOBAL
              </p>

              <p className="font-['Space_Grotesk'] text-[11px] text-[#E8E3DB] uppercase tracking-[0.15em]">
                {listeners} OYENTES
              </p>
            </div>

            {/* MAPA */}
            <div className="w-[420px] h-[420px] bg-[#1a1714]">

              <ComposableMap
                projectionConfig={{ scale: 200 }}
                style={{ width: "100%", height: "100%" }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#E8E3DB"
                        stroke="none"
                        style={{
                          default: { opacity: 0.08 },
                          hover: { opacity: 0.15 },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {points.map((point, i) => (
                  <Marker key={i} coordinates={point.coordinates}>
                    <circle
                      r={3}
                      fill="#9B1A2A"
                      style={{
                        filter: "drop-shadow(0 0 6px #9B1A2A)",
                      }}
                    />
                  </Marker>
                ))}
              </ComposableMap>

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
