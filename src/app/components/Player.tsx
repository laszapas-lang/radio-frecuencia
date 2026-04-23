import { useState, useEffect, useRef } from "react";

const STREAM_URL = "https://TU_AZURACAST.elest.io/radio/8000/radio.mp3";
const STATION_API = "https://TU_AZURACAST.elest.io/api/nowplaying/1";

interface NowPlaying {
  artist: string;
  title: string;
  listeners: number;
}

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({
    artist: "Radio Frecuencia",
    title: "Emisión en directo",
    listeners: 0,
  });
  const [bars, setBars] = useState<number[]>(Array(40).fill(3));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animRef = useRef<number>(0);

  // fake animation (por ahora)
  useEffect(() => {
    const animate = () => {
      setBars((prev) =>
        prev.map((b) => {
          const delta = (Math.random() - 0.5) * 20;
          return Math.max(3, Math.min(60, b + delta));
        })
      );
      animRef.current = requestAnimationFrame(animate);
    };

    if (playing) animate();
    else cancelAnimationFrame(animRef.current);

    return () => cancelAnimationFrame(animRef.current);
  }, [playing]);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(STREAM_URL);
      audioRef.current.volume = volume;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <section className="bg-[#292524] border-t border-[#E8E3DB]/10">
      <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px] py-[100px]">
        <div className="max-w-[800px] flex flex-col gap-[48px]">

          {/* TOP */}
          <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.15em] font-['Space_Grotesk'] text-[#E8E3DB]/60">
            <div className="flex items-center gap-[8px]">
              <div className={`w-[6px] h-[6px] ${playing ? "bg-[#9B1A2A]" : "bg-[#E8E3DB]/20"}`} />
              <span>{playing ? "EN ANTENA" : "AHORA SUENA"}</span>
            </div>

            <span>320KBPS · {nowPlaying.listeners} OYENTES</span>
          </div>

          {/* TRACK */}
          <div className="flex flex-col gap-[6px]">
            <p className="font-['Newsreader',serif] text-[42px] md:text-[56px] leading-[1.1] text-[#E8E3DB]">
              {nowPlaying.artist}
            </p>

            <p className="font-['Newsreader',serif] italic text-[20px] md:text-[24px] text-[#E8E3DB]/50">
              {nowPlaying.title}
            </p>
          </div>

          {/* CONTROLES */}
          <div className="flex items-center gap-[32px]">

            <button
              onClick={togglePlay}
              className="w-[56px] h-[56px] bg-[#9B1A2A] flex items-center justify-center hover:opacity-90 transition"
            >
              {playing ? (
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <rect x="3" y="2" width="4" height="14" fill="#E8E3DB" />
                  <rect x="11" y="2" width="4" height="14" fill="#E8E3DB" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M4 2.5l12 6.5-12 6.5V2.5z" fill="#E8E3DB" />
                </svg>
              )}
            </button>

            <div className="flex-1 flex flex-col gap-[12px]">

              {/* WAVE */}
              <div className="flex items-end gap-[2px] h-[50px]">
                {bars.map((height, i) => (
                  <div
                    key={i}
                    style={{
                      width: 2,
                      height: `${height}px`,
                      background:
                        i % 4 === 0
                          ? "#9B1A2A"
                          : "rgba(232,227,219,0.5)",
                      transition: "height 0.08s linear",
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-between text-[11px] font-['Space_Grotesk'] text-[#E8E3DB]/40">
                <span>EN DIRECTO</span>
                <span>EMISIÓN CONTINUA · 24/7</span>
              </div>

            </div>
          </div>

          {/* VOLUMEN */}
          <div className="flex items-center gap-[12px]">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className="w-[120px]"
              style={{ accentColor: "#9B1A2A" }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
