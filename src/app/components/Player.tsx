import { useState, useEffect, useRef } from "react";

const STREAM_URL = "https://radioweb-u71993.vm.elestio.app/listen/frecuencia/radio.mp3";
const STATION_API = "https://radioweb-u71993.vm.elestio.app/api/nowplaying/1";

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [bars, setBars] = useState<number[]>(Array(64).fill(6));
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

  // 📡 FETCH
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
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
    const i = setInterval(fetchData, 10000);
    return () => clearInterval(i);
  }, []);

  // 🎧 VISUALIZER REAL
  useEffect(() => {
    const animate = () => {
      if (!analyserRef.current || !dataRef.current) return;

      analyserRef.current.getByteFrequencyData(dataRef.current);

      const values = Array.from(dataRef.current);
      const step = Math.floor(values.length / 64);

      const newBars = Array(64).fill(0).map((_, i) => {
        const v = values[i * step];
        return Math.max(4, (v / 255) * 80);
      });

      setBars(newBars);
      animRef.current = requestAnimationFrame(animate);
    };

    if (playing) {
      animRef.current = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [playing]);

  // ▶️ PLAY
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

      const data = new Uint8Array(analyser.frequencyBinCount);

      audioRef.current = audio;
      analyserRef.current = analyser;
      dataRef.current = data;
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
    <section className="bg-[#14110f] text-[#E8E3DB] py-[120px]">
      <div className="max-w-[1100px] mx-auto px-[40px] flex flex-col gap-[60px]">

        {/* HEADER */}
        <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] opacity-60">
          <span>{loading ? "CARGANDO" : playing ? "EN ANTENA" : "OFFLINE"}</span>
          <span>{nowPlaying.listeners} OYENTES</span>
        </div>

        {/* MAIN */}
        <div className="flex gap-[60px] items-center">

          {/* COVER GRANDE */}
          <div className="w-[160px] h-[160px] bg-black border border-[#E8E3DB]/20">
            {nowPlaying.art && (
              <img src={nowPlaying.art} className="w-full h-full object-cover grayscale contrast-125" />
            )}
          </div>

          {/* INFO */}
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-[64px] leading-none font-['Newsreader']">
              {nowPlaying.artist}
            </h1>
            <p className="italic opacity-40 text-[20px]">
              {nowPlaying.title}
            </p>
          </div>

        </div>

        {/* VISUALIZER GRANDE */}
        <div className="flex items-end gap-[2px] h-[100px] border-t border-[#E8E3DB]/10 pt-[20px]">
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 2,
                height: `${h}px`,
                background: i % 5 === 0 ? "#9B1A2A" : "#E8E3DB",
                opacity: 0.8,
              }}
            />
          ))}
        </div>

        {/* CONTROLES GRANDES */}
        <div className="flex items-center justify-between">

          <button
            onClick={togglePlay}
            className="w-[80px] h-[80px] border border-[#9B1A2A] flex items-center justify-center text-[24px]"
          >
            {playing ? "II" : "▶"}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-[200px]"
          />

        </div>

      </div>
    </section>
  );
}
