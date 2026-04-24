import { useState, useEffect, useRef } from "react";

const STREAM_URL = "https://radioweb-u71993.vm.elestio.app/listen/frecuencia/radio.mp3";
const STATION_API = "https://radioweb-u71993.vm.elestio.app/api/nowplaying/1";

interface NowPlaying {
  artist: string;
  title: string;
  listeners: number;
  art: string;
}

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [bars, setBars] = useState<number[]>(Array(48).fill(6));

  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({
    artist: "Radio Frecuencia",
    title: "Emisión en directo",
    listeners: 0,
    art: "",
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animRef = useRef<number>(0);

  // 📡 NOW PLAYING
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(STATION_API);
        const data = await res.json();

        setNowPlaying({
          artist: data.now_playing?.song?.artist || "Radio Frecuencia",
          title: data.now_playing?.song?.title || "Emisión en directo",
          listeners: data.listeners?.current || 0,
          art: data.now_playing?.song?.art || "",
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🎚️ VISUALIZER REAL
  useEffect(() => {
    const animate = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      const values = Array.from(dataArrayRef.current);
      const step = Math.floor(values.length / 48);

      const newBars = Array(48).fill(0).map((_, i) => {
        const val = values[i * step];
        return Math.max(4, (val / 255) * 60);
      });

      setBars(newBars);
      animRef.current = requestAnimationFrame(animate);
    };

    if (playing) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animRef.current);
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

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      audioRef.current = audio;
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    }

    if (playing) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;

      audioContextRef.current?.close();
      audioContextRef.current = null;

      setPlaying(false);
    } else {
      setLoading(true);

      audioRef.current.play()
        .then(() => {
          setPlaying(true);
          setLoading(false);
        })
        .catch(() => {
          setPlaying(false);
          setLoading(false);
        });
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <section className="bg-[#1a1714] border-t border-[#E8E3DB]/10">
      <div className="max-w-[900px] mx-auto px-[32px] py-[100px] flex flex-col gap-[60px]">

        {/* HEADER */}
        <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] text-[#E8E3DB]/50">
          <span>{loading ? "CARGANDO" : playing ? "EN ANTENA" : "OFFLINE"}</span>
          <span>{nowPlaying.listeners} OYENTES</span>
        </div>

        {/* CONTENIDO */}
        <div className="flex gap-[32px] items-center">

          {/* PORTADA */}
          <div className="w-[90px] h-[90px] bg-black border border-[#E8E3DB]/20 overflow-hidden">
            {nowPlaying.art && (
              <img
                src={nowPlaying.art}
                className="w-full h-full object-cover grayscale contrast-125"
              />
            )}
          </div>

          {/* TEXTO */}
          <div className="flex flex-col">
            <p className="text-[42px] text-[#E8E3DB] font-['Newsreader']">
              {nowPlaying.artist}
            </p>
            <p className="text-[#E8E3DB]/40 italic">
              {nowPlaying.title}
            </p>
          </div>

        </div>

        {/* VISUALIZER */}
        <div className="flex items-end gap-[2px] h-[60px] border-t border-[#E8E3DB]/10 pt-[12px]">
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 2,
                height: `${h}px`,
                background: i % 3 === 0 ? "#9B1A2A" : "#E8E3DB",
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* CONTROLES */}
        <div className="flex items-center justify-between">

          <button
            onClick={togglePlay}
            className="w-[60px] h-[60px] border border-[#9B1A2A] flex items-center justify-center"
          >
            {playing ? "II" : "▶"}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className="w-[120px]"
          />

        </div>

      </div>
    </section>
  );
}
