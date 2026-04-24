import { useState, useEffect, useRef } from "react";

const STREAM_URL = "https://radioweb-u71993.vm.elestio.app/listen/frecuencia/radio.mp3";
const STATION_API = "https://radioweb-u71993.vm.elestio.app/api/nowplaying/1";

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [bars, setBars] = useState<number[]>(Array(40).fill(4));

  const [nowPlaying, setNowPlaying] = useState({
    artist: "Radio Frecuencia",
    title: "Emisión en directo",
    listeners: 0,
    art: "",
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const animRef = useRef<number>(0);

  // 📡 FETCH NOW PLAYING
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(STATION_API);
        const data = await res.json();

        setNowPlaying({
          artist: data.now_playing?.song?.artist || "Radio Frecuencia",
          title: data.now_playing?.song?.title || "En directo",
          listeners: data.listeners?.current || 0,
          art: data.now_playing?.song?.art || "",
        });
      } catch {}
    };

    fetchData();
    const i = setInterval(fetchData, 10000);
    return () => clearInterval(i);
  }, []);

  // 🎧 VISUALIZER (ondas arriba, discretas)
  useEffect(() => {
    const animate = () => {
      if (!analyserRef.current || !dataRef.current) return;

      analyserRef.current.getByteFrequencyData(dataRef.current);
      const values = Array.from(dataRef.current);
      const step = Math.floor(values.length / 40);

      const newBars = Array(40).fill(0).map((_, i) => {
        const v = values[i * step];
        return Math.max(4, (v / 255) * 30);
      });

      setBars(newBars);
      animRef.current = requestAnimationFrame(animate);
    };

    if (playing) animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, [playing]);

  // ▶️ PLAY / PAUSE
  const togglePlay = () => {
    if (!audioRef.current) {
      const audio = new Audio(STREAM_URL);
      audio.crossOrigin = "anonymous";
      audio.volume = volume;

      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioRef.current = audio;
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
      ctxRef.current = ctx;
    }

    if (playing) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
      ctxRef.current?.close();
      ctxRef.current = null;
      setPlaying(false);
    } else {
      setLoading(true);

      audioRef.current.play()
        .then(() => {
          setPlaying(true);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  return (
    <section className="bg-[#1a1714] py-[120px]">
      <div className="max-w-[1100px] mx-auto px-[40px]">

        {/* PANEL */}
        <div className="border border-[#E8E3DB]/10 p-[48px] flex flex-col gap-[40px]">

          {/* HEADER */}
          <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] text-[#E8E3DB]/50">
            <span>AHORA SUENA</span>
            <span>{nowPlaying.listeners} OYENTES</span>
          </div>

          {/* INFO + ONDAS */}
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

            {/* TEXTO + ONDAS */}
            <div className="flex-1 flex justify-between items-center">

              <div>
                <h1 className="text-[56px] text-[#E8E3DB] font-['Newsreader'] leading-none">
                  {nowPlaying.artist}
                </h1>
                <p className="text-[#E8E3DB]/40 italic mt-[8px]">
                  {nowPlaying.title}
                </p>
              </div>

              {/* ONDAS */}
              <div className="flex items-end gap-[2px] h-[40px] ml-[40px]">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 2,
                      height: `${h}px`,
                      background: i % 6 === 0 ? "#9B1A2A" : "#E8E3DB",
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
              className="w-[64px] h-[64px] bg-[#9B1A2A] flex items-center justify-center text-white"
            >
              {playing ? "II" : "▶"}
            </button>

            {/* LÍNEA PROGRESO */}
            <div className="flex-1 h-[2px] bg-[#E8E3DB]/20 relative">
              <div
                className="absolute left-0 top-0 h-full bg-[#9B1A2A]"
                style={{ width: "40%" }}
              />
            </div>

          </div>

          {/* FOOTER */}
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#E8E3DB]/40">
            EMISIÓN CONTINUA · 24/7
          </div>

        </div>

      </div>
    </section>
  );
}
