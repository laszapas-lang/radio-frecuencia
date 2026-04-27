import { useEffect, useState } from "react";
import { STATION_API } from "../constants";

interface Song {
  artist: string;
  title: string;
  art: string;
}

export default function Identity() {
  const [current, setCurrent] = useState<Song | null>(null);
  const [history, setHistory] = useState<Song[]>([]);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(STATION_API);
        const data = await res.json();

        const np = data.now_playing?.song;
        if (np) {
          setCurrent({ artist: np.artist, title: np.title, art: np.art });
          setImgError(false);
        }

        const hist: Song[] = (data.song_history || [])
          .slice(0, 5)
          .map((item: any) => ({
            artist: item.song?.artist || "",
            title: item.song?.title || "",
            art: item.song?.art || "",
          }));
        setHistory(hist);
      } catch {}
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="identity" className="bg-[#292524] py-[120px]">
      <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px]">
        <div className="flex flex-col gap-[48px]">

          {/* TEXTO EDITORIAL */}
          <p className="font-['Newsreader',serif] italic text-[42px] leading-[1.5] text-[#E8E3DB] max-w-[900px]">
            Selección de música en español. Sin interrupciones.
          </p>

          <div className="w-[120px] h-[2px] bg-[#9B1A2A]" />

          {/* HEADER SECCIÓN */}
          <div className="flex items-center gap-[8px]">
            <div className="w-[6px] h-[6px] bg-[#9B1A2A]" />
            <p className="font-['Space_Grotesk'] text-[11px] text-[#E8E3DB]/50 uppercase tracking-[0.2em]">
              Ahora suena
            </p>
          </div>

          {/* CANCIÓN ACTUAL — carátula grande + info */}
          {current && (
            <div className="flex gap-[32px] items-start">
              <div className="shrink-0 w-[140px] h-[140px] bg-[#1a1714] overflow-hidden">
                {current.art && !imgError ? (
                  <img
                    src={current.art}
                    alt={current.title}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-[32px] h-[32px] border border-[#E8E3DB]/10 rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center gap-[8px] pt-[8px]">
                <p className="font-['Newsreader'] text-[28px] md:text-[36px] leading-none text-[#E8E3DB]">
                  {current.artist}
                </p>
                <p className="font-['Newsreader'] italic text-[18px] md:text-[22px] text-[#E8E3DB]/60">
                  {current.title}
                </p>
              </div>
            </div>
          )}

          {/* HISTORIAL — 5 canciones anteriores */}
          {history.length > 0 && (
            <div className="flex flex-col gap-0 border-t border-[#E8E3DB]/10">
              <p className="font-['Space_Grotesk'] text-[11px] text-[#E8E3DB]/30 uppercase tracking-[0.2em] py-[20px]">
                Anteriores
              </p>
              {history.map((song, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[16px] py-[14px] border-b border-[#E8E3DB]/10 group"
                >
                  {/* Carátula pequeña */}
                  <div className="shrink-0 w-[44px] h-[44px] bg-[#1a1714] overflow-hidden">
                    {song.art ? (
                      <img
                        src={song.art}
                        alt={song.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-[14px] h-[14px] border border-[#E8E3DB]/10 rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-[2px] min-w-0">
                    <p className="font-['Space_Grotesk'] text-[13px] text-[#E8E3DB]/80 truncate">
                      {song.artist}
                    </p>
                    <p className="font-['Space_Grotesk'] text-[12px] text-[#E8E3DB]/40 truncate">
                      {song.title}
                    </p>
                  </div>

                  {/* Número */}
                  <p className="shrink-0 ml-auto font-['Space_Grotesk'] text-[11px] text-[#E8E3DB]/20 tabular-nums">
                    -{i + 1}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
