import { useState, useEffect, useRef } from "react";

const STREAM_URL = "https://radioweb-u71993.vm.elestio.app/listen/frecuencia/radio.mp3";
const STATION_API = "https://radioweb-u71993.vm.elestio.app/api/nowplaying/1";

interface NowPlaying {
  artist: string;
  title: string;
  listeners: number;
}

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({
    artist: "Radio Frecuencia",
    title: "Emisión en directo",
    listeners: 0,
  });
  const [bars, setBars] = useState<number[]>(Array(48).fill(6));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animRef = useRef<number>(0);

  // 📡 NOW PLAYING
  useEffect(() => {
    let mounted = true;

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(STATION_API);
        const data = await res.json();

        if (!mounted) return;

        setNowPlaying({
          artist: data.now_playing?.song?.artist || "Radio Frecuencia",
          title: data.now_playing?.song?.title || "Emisión en directo",
          listeners: data.listeners?.current || 0,
        });
      } catch (e) {
        console.error("NowPlaying error:", e);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // 🎚️ VISUALIZER (estable)
  useEffect(() => {
    const animate = () => {
      setBars((prev) =>
        prev.map(() => Math.max(4, Math.random() * 70))
      );
      animRef.current = requestAnimationFrame(animate);
    };

    if (audioRef.current && !audioRef.current.paused) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animRef.current);
      setBars((prev) => prev.map((b) => Math.max(4, b * 0.85)));
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [playing, loading]);

  // 🎧 EVENTOS AUDIO
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const onPlay = () => {
      setPlaying(true);
      setLoading(false);
    };

    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onError = () => {
      console.error("Stream error");
      setPlaying(false);
      setLoading(false);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [audioRef.current]);

  // ▶️ PLAY / PAUSE
  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(STREAM_URL);
      audioRef.current.volume = volume;
    }

    if (playing) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
      setPlaying(false);
    } else {
      setLoading(true);

      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(() => {
          setPlaying(false);
          setLoading(false);
        });
    }
  };

  // 🔊 VOLUMEN
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <section className="bg-[#292524] border-t border-[#E8E3DB]/10">
      <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px] py-[120px]">

        <div className="max-w-[720px] flex flex-col gap-[64px]">

          {/* HEADER */}
          <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.2em] font-['Space_Grotesk'] text-[#E8E3DB]/50">
            
            <div className="flex items-center gap-[10px]">
              <div className="relative">
                <div className={`w-[6px] h-[6px] ${playing ? "bg-[#9B1A2A]" : "bg-[#E8E3DB]/20"}`} />
                {playing && (
                  <div className="absolute inset-0 bg-[#9B1A2A] opacity-40 animate-ping" />
                )}
              </div>
              <span>
                {loading ? "CARGANDO" : playing ? "EN ANTENA" : "OFFLINE"}
              </span>
            </div>

            <span>{nowPlaying.listeners} OYENTES · 320KBPS · MADRID</span>
          </div>

          {/* TRACK */}
          <div className="flex flex-col gap-[10px]">
            <p className="font-['Newsreader'] text-[64px] md:text-[84px] text-[#E8E3DB]">
              {nowPlaying.artist}
            </p>

            <p className="font-['Newsreader'] italic text-[20px] md:text-[24px] text-[#E8E3DB]/35">
              {nowPlaying.title}
            </p>
          </div>

          {/* VISUALIZER */}
          <div className="flex items-end gap-[2px] h-[70px]">
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

          {/* CONTROLES */}
          <div className="flex items-center justify-between">

            <button
              onClick={togglePlay}
              className="w-[64px] h-[64px] border border-[#9B1A2A] flex items-center justify-center hover:bg-[#9B1A2A]/10 transition-all duration-200"
            >
              {playing ? (
                <div className="flex gap-[4px]">
                  <div className="w-[4px] h-[18px] bg-[#E8E3DB]" />
                  <div className="w-[4px] h-[18px] bg-[#E8E3DB]" />
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[12px] border-l-[#E8E3DB] border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent ml-[4px]" />
              )}
            </button>

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
