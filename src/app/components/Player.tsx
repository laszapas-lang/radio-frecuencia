import { useState, useEffect, useRef } from "react";

const STREAM_URL = "https://radioweb-u71993.vm.elestio.app/listen/frecuencia/radio.mp3";
const STATION_API = "https://radioweb-u71993.vm.elestio.app/api/nowplaying/1";

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const [track, setTrack] = useState({
    artist: "Radio Frecuencia",
    title: "Emisión en directo",
    artwork: "",
  });

  const [progress, setProgress] = useState(30);
  const [currentTime, setCurrentTime] = useState("02:45");
  const [duration, setDuration] = useState("05:12");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // FETCH DATA
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(STATION_API);
        const data = await res.json();

        setTrack({
          artist: data.now_playing?.song?.artist || "Radio Frecuencia",
          title: data.now_playing?.song?.title || "Emisión en directo",
          artwork: data.now_playing?.song?.art || "",
        });
      } catch {}
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 15000);
    return () => clearInterval(interval);
  }, []);

  // PLAY / PAUSE
  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(STREAM_URL);
      audioRef.current.volume = volume;
    }

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }

    setPlaying(!playing);
  };

  // MUTE
  const toggleMute = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <section className="bg-[#292524] border-t border-[#E8E3DB]/10">
      <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px] py-[100px]">

        <div className="border border-[#E8E3DB]/10 p-[48px]">

          {/* HEADER */}
          <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] text-[#E8E3DB]/50 font-['Space_Grotesk']">
            <div className="flex items-center gap-[8px]">
              <div className="w-[6px] h-[6px] bg-[#9B1A2A]" />
              AHORA SUENA
            </div>

            <div>LATENCY: 24MS / 320KBPS</div>
          </div>

          {/* CONTENIDO */}
          <div className="flex justify-between items-start mt-[40px]">

            {/* IZQUIERDA */}
            <div className="flex gap-[24px]">

              {/* COVER */}
              {track.artwork && (
                <img
                  src={track.artwork}
                  alt=""
                  className="w-[90px] h-[90px] object-cover"
                />
              )}

              {/* TEXTO */}
              <div>
                <h1 className="font-['Newsreader'] italic text-[64px] leading-none text-[#E8E3DB]">
                  {track.artist}
                </h1>
                <p className="italic text-[20px] text-[#E8E3DB]/50 mt-[8px]">
                  {track.title}
                </p>
              </div>

            </div>

            {/* VISUALIZER */}
            <div className="flex items-end gap-[2px] h-[40px]">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-[#E8E3DB]/60"
                  style={{
                    height: `${Math.random() * 30 + 4}px`,
                    background: i % 5 === 0 ? "#9B1A2A" : undefined,
                  }}
                />
              ))}
            </div>

          </div>

          {/* PLAYER */}
          <div className="flex items-center gap-[20px] mt-[50px]">

            {/* PLAY */}
            <button
              onClick={togglePlay}
              className="w-[64px] h-[64px] bg-[#9B1A2A] flex items-center justify-center"
            >
              {playing ? (
                <div className="flex gap-[4px]">
                  <div className="w-[4px] h-[18px] bg-white" />
                  <div className="w-[4px] h-[18px] bg-white" />
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent ml-[4px]" />
              )}
            </button>

            {/* BLOQUE DERECHA */}
            <div className="flex-1 flex flex-col gap-[10px]">

              {/* LINEA */}
              <div className="w-full h-[1px] bg-[#E8E3DB]/20 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-[#9B1A2A]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* TIEMPOS */}
              <div className="flex justify-between text-[11px] text-[#E8E3DB]/40 font-['Space_Grotesk']">
                <span>{currentTime}</span>
                <span>{duration}</span>
              </div>

              {/* ICONOS (PERFECTAMENTE ALINEADOS) */}
              <div className="flex justify-end items-center gap-[20px] mt-[6px]">

                {/* MUTE */}
                <button
                  onClick={toggleMute}
                  className="opacity-70 hover:opacity-100 transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 10V14H7L12 19V5L7 10H3Z"
                      stroke="#E8E3DB"
                      strokeWidth="1.5"
                    />
                    {!muted && (
                      <path
                        d="M16 9C17.5 10.5 17.5 13.5 16 15"
                        stroke="#E8E3DB"
                        strokeWidth="1.5"
                      />
                    )}
                  </svg>
                </button>

                {/* VOLUMEN (MISMO ALTO VISUAL) */}
                <div className="flex items-end gap-[3px] h-[20px] opacity-70">
                  {[6, 10, 14, 18].map((h, i) => (
                    <div
                      key={i}
                      className="w-[3px] bg-[#E8E3DB]"
                      style={{ height: h }}
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>

          {/* FOOT */}
          <div className="text-[11px] text-[#E8E3DB]/40 mt-[40px] uppercase tracking-[0.2em] font-['Space_Grotesk']">
            EMISIÓN CONTINUA · 24/7
          </div>

        </div>
      </div>
    </section>
  );
}
