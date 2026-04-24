import { useState, useEffect, useRef } from "react";

const STREAM_URL = "https://radioweb-u71993.vm.elestio.app/listen/frecuencia/radio.mp3";
const STATION_API = "https://radioweb-u71993.vm.elestio.app/api/nowplaying/1";

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(40).fill(4));

  const [nowPlaying, setNowPlaying] = useState({
    artist: "Radio Frecuencia",
    title: "En directo",
    art: "",
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(STATION_API);
        const data = await res.json();

        setNowPlaying({
          artist: data.now_playing?.song?.artist || "Radio Frecuencia",
          title: data.now_playing?.song?.title || "En directo",
          art: data.now_playing?.song?.art || "",
        });
      } catch {}
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // VISUALIZER (fake)
  useEffect(() => {
    let raf: number;

    const animate = () => {
      setBars((prev) =>
        prev.map(() => Math.max(3, Math.random() * 25))
      );
      raf = requestAnimationFrame(animate);
    };

    if (playing) raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // PLAY
  const togglePlay = () => {
    if (!audioRef.current) {
      const audio = new Audio(STREAM_URL);
      audio.volume = volume;
      audioRef.current = audio;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      audioRef.current.muted = false;
      setMuted(false);
    }
  };

  return (
    <section className="bg-[#292524] py-[120px] text-[#E8E3DB]">
      <div className="max-w-[1100px] mx-auto px-[40px]">

        <div className="border border-[#E8E3DB]/10 p-[56px] flex flex-col gap-[48px]">

          {/* HEADER */}
          <div className="flex justify-between text-[11px] tracking-[0.2em] uppercase text-[#E8E3DB]/50">
            <div className="flex items-center gap-[10px]">
              <div className="w-[6px] h-[6px] bg-[#9B1A2A]" />
              <span>AHORA SUENA</span>
            </div>
            <span>LATENCY: 24MS / 320KBPS</span>
          </div>

          {/* INFO */}
          <div className="flex gap-[32px] items-center">

            {/* COVER */}
            <div className="w-[110px] h-[110px] bg-black border border-[#E8E3DB]/20 overflow-hidden">
              {nowPlaying.art && (
                <img
                  src={nowPlaying.art}
                  className="w-full h-full object-cover grayscale"
                />
              )}
            </div>

            {/* TEXT + WAVES */}
            <div className="flex-1 flex justify-between items-center">

              <div>
                <h1 className="text-[72px] leading-none font-['Newsreader']">
                  {nowPlaying.artist}
                </h1>
                <p className="italic text-[#E8E3DB]/40 mt-[8px] text-[22px]">
                  {nowPlaying.title}
                </p>
              </div>

              {/* WAVES */}
              <div className="flex items-end gap-[2px] h-[40px]">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 2,
                      height: `${h}px`,
                      background: i % 5 === 0 ? "#9B1A2A" : "#E8E3DB",
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* CONTROLES */}
          <div className="flex items-center gap-[24px]">

            {/* PLAY */}
            <button
              onClick={togglePlay}
              className="w-[70px] h-[70px] bg-[#9B1A2A] flex items-center justify-center"
            >
              {playing ? (
                <div className="flex gap-[4px]">
                  <div className="w-[4px] h-[18px] bg-white" />
                  <div className="w-[4px] h-[18px] bg-white" />
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[14px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-[4px]" />
              )}
            </button>

            {/* BARRA + TIEMPOS */}
            <div className="flex-1 flex flex-col gap-[12px]">

              {/* BARRA */}
              <div className="h-[1.5px] bg-[#E8E3DB]/20 relative">
                <div
                  className="absolute left-0 top-0 h-full bg-[#9B1A2A]"
                  style={{ width: "40%" }}
                />
              </div>

              {/* TIEMPOS + CONTROLES DERECHA */}
              <div className="flex items-center justify-between text-[11px] text-[#E8E3DB]/40">

                <span>02:45</span>

                <div className="flex items-center gap-[24px]">

                  <span>05:12</span>

                  <div className="flex items-center gap-[16px]">

                    {/* MUTE */}
                    <button onClick={toggleMute} className="opacity-70 hover:opacity-100">
                      {muted ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8E3DB" strokeWidth="1.5">
                          <polygon points="5 9 9 9 13 5 13 19 9 15 5 15" />
                          <line x1="16" y1="8" x2="22" y2="16" />
                          <line x1="22" y1="8" x2="16" y2="16" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8E3DB" strokeWidth="1.5">
                          <polygon points="5 9 9 9 13 5 13 19 9 15 5 15" />
                          <path d="M16 9c1.5 1.5 1.5 4.5 0 6" />
                        </svg>
                      )}
                    </button>

                    {/* VOLUME */}
                    <div className="flex items-end gap-[2px] h-[16px]">
                      {[0.2, 0.4, 0.6, 0.8, 1].map((v, i) => (
                        <div
                          key={i}
                          onClick={() => changeVolume(v)}
                          className={`w-[2px] cursor-pointer ${
                            volume >= v ? "bg-[#E8E3DB]" : "bg-[#E8E3DB]/20"
                          }`}
                          style={{ height: `${4 + i * 3}px` }}
                        />
                      ))}
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#E8E3DB]/40">
            EMISIÓN CONTINUA · 24/7
          </div>

        </div>

      </div>
    </section>
  );
}
