import { useState, useEffect, useRef } from "react";

const STREAM_URL = "https://radioweb-u71993.vm.elestio.app/listen/frecuencia/radio.mp3";
const STATION_API = "https://radioweb-u71993.vm.elestio.app/api/nowplaying/1";

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [bars, setBars] = useState<number[]>(Array(40).fill(4));

  const [nowPlaying, setNowPlaying] = useState({
    artist: "Radio Frecuencia",
    title: "En directo",
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
          art: data.now_playing?.song?.art || "",
        });
      } catch {}
    };

    fetchData();
    const i = setInterval(fetchData, 10000);
    return () => clearInterval(i);
  }, []);

  // 🎧 VISUALIZER
  useEffect(() => {
    const animate = () => {
      if (!analyserRef.current || !dataRef.current) return;

      analyserRef.current.getByteFrequencyData(dataRef.current);
      const values = Array.from(dataRef.current);
      const step = Math.floor(values.length / 40);

      const newBars = Array(40).fill(0).map((_, i) => {
        const v = values[i * step];
        return Math.max(3, (v / 255) * 25);
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
      audioRef.current?.pause();
      audioRef.current!.src = "";
      audioRef.current = null;
      ctxRef.current?.close();
      ctxRef.current = null;
      setPlaying(false);
    } else {
      audioRef.current?.play().then(() => setPlaying(true));
    }
  };

  return (
    <section className="bg-[#292524] py-[120px] text-[#E8E3DB]">
      <div className="max-w-[1100px] mx-auto px-[40px]">

        <div className="border border-[#E8E3DB]/10 p-[56px] flex flex-col gap-[48px]">

          {/* HEADER */}
          <div className="flex justify-between text-[11px] tracking-[0.2em] uppercase text-[#E8E3DB]/50">
            <span>AHORA SUENA</span>
            <span>LATENCIA: 24MS / 320KBPS</span>
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

            {/* TEXTO + ONDAS */}
            <div className="flex-1 flex justify-between items-center">

              <div>
                <h1 className="text-[72px] leading-none font-['Newsreader']">
                  {nowPlaying.artist}
                </h1>
                <p className="italic text-[#E8E3DB]/40 mt-[8px] text-[22px]">
                  {nowPlaying.title}
                </p>
              </div>

              {/* ONDAS */}
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

            {/* PLAY / PAUSE */}
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

            {/* LÍNEA */}
            <div className="flex-1 h-[2px] bg-[#E8E3DB]/20 relative">
              <div
                className="absolute left-0 top-0 h-full bg-[#9B1A2A]"
                style={{ width: "40%" }}
              />
            </div>

            {/* ICONOS VOLUMEN */}
            <div className="flex items-center gap-[10px] opacity-60 text-sm">
              <span>🔇</span>
              <span>🔊</span>
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
