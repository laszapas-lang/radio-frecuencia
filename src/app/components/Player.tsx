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

  const [bars, setBars] = useState<number[]>(Array(60).fill(10));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const animRef = useRef<number>(0);

  // ─── FETCH NOW PLAYING ───
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(STATION_API);
        const data = await res.json();
        setNowPlaying({
          artist: data.now_playing?.song?.artist || "Radio Frecuencia",
          title: data.now_playing?.song?.title || "Emisión en directo",
          listeners: data.listeners?.current || 0,
        });
      } catch {}
    };

    fetchData();
    const i = setInterval(fetchData, 15000);
    return () => clearInterval(i);
  }, []);

  // ─── VISUALIZER ───
  useEffect(() => {
    const animate = () => {
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);

        const step = Math.floor(data.length / 60);

        setBars(
          Array.from({ length: 60 }, (_, i) => {
            const v = data[i * step] / 255;
            return Math.max(5, v * 60);
          })
        );
      }

      animRef.current = requestAnimationFrame(animate);
    };

    if (playing) {
      animate();
    } else {
      cancelAnimationFrame(animRef.current);
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [playing]);

  // ─── PLAY ───
  const togglePlay = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(STREAM_URL);
      audioRef.current.volume = volume;
    }

    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      const source = ctx.createMediaElementSource(audioRef.current);

      source.connect(analyser);
      analyser.connect(ctx.destination);

      analyserRef.current = analyser;
      ctxRef.current = ctx;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      if (ctxRef.current?.state === "suspended") {
        await ctxRef.current.resume();
      }

      audioRef.current.play();
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

        <div className="max-w-[900px] flex flex-col gap-[56px]">

          {/* TOP */}
          <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.15em] font-['Space_Grotesk'] text-[#E8E3DB]/60">
            <div className="flex items-center gap-[8px]">
              <div className={`w-[6px] h-[6px] ${playing ? "bg-[#9B1A2A]" : "bg-[#E8E3DB]/20"}`} />
              <span>{playing ? "EN ANTENA" : "OFFLINE"}</span>
            </div>

            <span>{nowPlaying.listeners} OYENTES · 320KBPS</span>
          </div>

          {/* TRACK */}
          <div className="flex flex-col gap-[8px]">
            <p className="font-['Newsreader'] text-[48px] md:text-[64px] leading-[1.1] text-[#E8E3DB]">
              {nowPlaying.artist}
            </p>

            <p className="font-['Newsreader'] italic text-[22px] text-[#E8E3DB]/50">
              {nowPlaying.title}
            </p>
          </div>

          {/* VISUAL LINE */}
          <div className="w-full h-[70px] relative overflow-hidden">
            <svg viewBox="0 0 600 70" className="w-full h-full">
              <path
                d={bars.reduce((acc, val, i) => {
                  const x = (i / bars.length) * 600;
                  const y = 35 - val / 2;
                  return i === 0 ? `M ${x} ${y}` : acc + ` L ${x} ${y}`;
                }, "")}
                fill="none"
                stroke="#9B1A2A"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* CONTROLES */}
          <div className="flex items-center gap-[32px]">

            <button
              onClick={togglePlay}
              className="w-[56px] h-[56px] border border-[#9B1A2A] flex items-center justify-center hover:bg-[#9B1A2A]/10 transition"
            >
              {playing ? (
                <div className="flex gap-[4px]">
                  <div className="w-[4px] h-[16px] bg-[#E8E3DB]" />
                  <div className="w-[4px] h-[16px] bg-[#E8E3DB]" />
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[10px] border-l-[#E8E3DB] border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-[3px]" />
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

            <span className="text-[11px] uppercase tracking-[0.15em] text-[#E8E3DB]/40 font-['Space_Grotesk']">
              EMISIÓN CONTINUA · 24/7
            </span>

          </div>

        </div>
      </div>
    </section>
  );
}
