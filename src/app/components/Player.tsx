import { useState, useEffect, useRef } from "react";

const STREAM_URL = "https://radioweb-u71993.vm.elestio.app/listen/frecuencia/radio.mp3";
const STATION_API = "https://radioweb-u71993.vm.elestio.app/api/nowplaying/1";

function formatTime(seconds: number): string {
  if (!seconds || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const [track, setTrack] = useState({
    artist: "Radio Frecuencia",
    title: "Emisión en directo",
    artwork: "",
    duration: 0,
  });

  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Guardamos el song_id actual para detectar cambio de canción
  const currentSongIdRef = useRef<string | number>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const playingRef = useRef(false);

  // Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const duration = track.duration || 1;
  const progress = Math.min((elapsed / duration) * 100, 100);

  // Mantener playingRef sincronizado
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // FETCH — siempre activo para todos los clientes, independientemente del estado de reproducción
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(STATION_API);
        const data = await res.json();
        const songId = data.now_playing?.song?.id ?? data.now_playing?.played_at ?? "";
        const serverElapsed = data.now_playing?.elapsed || 0;
        const serverDuration = data.now_playing?.duration || 0;

        if (songId !== currentSongIdRef.current) {
          // Canción nueva confirmada por el servidor: actualizamos títulos y reseteamos progreso
          currentSongIdRef.current = songId;
          setTrack({
            artist: data.now_playing?.song?.artist || "Radio Frecuencia",
            title: data.now_playing?.song?.title || "Emisión en directo",
            artwork: data.now_playing?.song?.art || "",
            duration: serverDuration,
          });
          // Resincronizar elapsed con el servidor
          elapsedRef.current = serverElapsed;
          setElapsed(serverElapsed);
        } else {
          // Misma canción: solo corregimos la deriva del tick local con el tiempo del servidor
          // Si el tick local se ha desviado más de 3s, resincronizamos silenciosamente
          const drift = Math.abs(elapsedRef.current - serverElapsed);
          if (drift > 3) {
            elapsedRef.current = serverElapsed;
            setElapsed(serverElapsed);
          }
        }
      } catch {}
    };
    fetchNowPlaying();
    const interval = setInterval(() => fetchNowPlaying(), 5000);
    return () => clearInterval(interval);
  }, []);

  // TICK
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (playing) {
      tickRef.current = setInterval(() => {
        elapsedRef.current += 1;
        setElapsed(elapsedRef.current);
      }, 1000);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [playing]);

  // VISUALIZER — lee frecuencias reales del audio cuando está reproduciendo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CREAM = "rgba(232,227,219,0.45)";
    const RED = "#9B1A2A";

    // Buffer de waveform suavizado
    let waveSmoothed: Float32Array | null = null;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const analyser = analyserRef.current;

      if (playingRef.current && analyser) {
        const bufLen = analyser.fftSize;
        const waveData = new Uint8Array(bufLen);
        analyser.getByteTimeDomainData(waveData);

        if (!waveSmoothed || waveSmoothed.length !== bufLen) {
          waveSmoothed = new Float32Array(bufLen).fill(128);
        }

        for (let i = 0; i < bufLen; i++) {
          // Sube rápido, baja lento para mantener la forma pero reaccionar a picos
          waveSmoothed[i] = waveData[i] > waveSmoothed[i]
            ? waveSmoothed[i] * 0.3 + waveData[i] * 0.7
            : waveSmoothed[i] * 0.6 + waveData[i] * 0.4;
        }
      } else {
        // Decaimiento suave hacia silencio (128 = centro)
        if (waveSmoothed) {
          for (let i = 0; i < waveSmoothed.length; i++) {
            waveSmoothed[i] = waveSmoothed[i] * 0.88 + 128 * 0.12;
          }
        }
      }

      // Ganancia visual: la señal de radio comprimida suele tener amplitud ~0.3–0.5
      // multiplicamos para que use bien los 48px de alto
      const GAIN = 4.0;
      const bufLen = waveSmoothed ? waveSmoothed.length : 0;

      // --- Onda principal (crema): waveform real ---
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        let y = H / 2;
        if (waveSmoothed && bufLen > 0) {
          const idx = Math.floor((x / W) * bufLen);
          const normalized = ((waveSmoothed[idx] - 128) / 128) * GAIN;
          const clamped = Math.max(-1, Math.min(1, normalized));
          y = H / 2 + clamped * (H / 2 - 2);
        }
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = CREAM;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // --- Onda roja: misma waveform desplazada media longitud (contrapunto orgánico) ---
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        let y = H / 2;
        if (waveSmoothed && bufLen > 0) {
          const offset = Math.floor(bufLen / 2);
          const idx = (Math.floor((x / W) * bufLen) + offset) % bufLen;
          const normalized = ((waveSmoothed[idx] - 128) / 128) * GAIN * 0.5;
          const clamped = Math.max(-1, Math.min(1, normalized));
          y = H / 2 + clamped * (H / 2 - 2);
        }
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = RED;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.65;
      ctx.stroke();
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(STREAM_URL);
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;

      // Crear contexto de audio y conectar el analyser
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;   // menos muestras = ciclos de onda más largos y legibles
      analyser.smoothingTimeConstant = 0.0;  // suavizado propio en el draw
      analyserRef.current = analyser;

      const source = audioCtx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    // Los navegadores suspenden el AudioContext hasta interacción del usuario
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (muted && v > 0) {
      setMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  return (
    <section id="player" className="bg-[#292524] border-t border-[#E8E3DB]/10">
      <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px] py-[100px]">
        <div className="border border-[#E8E3DB]/10 p-[32px] md:p-[48px]">

          {/* HEADER */}
          <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] text-[#E8E3DB]/50 font-['Space_Grotesk']">
            <div className="flex items-center gap-[8px]">
              <div className="w-[6px] h-[6px] bg-[#9B1A2A]" />
              AHORA SUENA
            </div>
            <div>LATENCIA: 24MS / 320KBPS</div>
          </div>

          {/* TRACK INFO + VISUALIZER en la misma fila */}
          <div className="flex justify-between items-center mt-[40px]">
            <div className="flex gap-[24px] items-center">
              <div>
                <h1 className="font-['Newsreader'] italic text-[48px] md:text-[64px] leading-none text-[#E8E3DB]">
                  {track.artist}
                </h1>
                <p className="italic text-[18px] md:text-[20px] text-[#E8E3DB]/50 mt-[8px]">
                  {track.title}
                </p>
              </div>
            </div>

            {/* VISUALIZER — solo desktop, a la derecha */}
            <div className="hidden md:block shrink-0 ml-[40px]">
              <canvas
                ref={canvasRef}
                width={200}
                height={48}
                style={{ width: "200px", height: "48px", display: "block" }}
              />
            </div>
          </div>

          {/* FILA PLAY + PROGRESO */}
          <div className="flex items-center gap-[20px] mt-[50px]">
            <button
              onClick={togglePlay}
              className="w-[64px] h-[64px] shrink-0 bg-[#9B1A2A] flex items-center justify-center hover:bg-[#7a1522] transition-colors duration-200"
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

            <div className="flex-1 flex flex-col gap-[10px]">
              <div className="w-full h-[1px] bg-[#E8E3DB]/20 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-[#9B1A2A] transition-all duration-1000 linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#E8E3DB]/40 font-['Space_Grotesk']">
                <span>{formatTime(elapsed)}</span>
                <span>{formatTime(track.duration)}</span>
              </div>
            </div>
          </div>

          {/* FILA INFERIOR */}
          <div className="flex items-center justify-between mt-[24px]">
            <div className="text-[11px] text-[#E8E3DB]/40 uppercase tracking-[0.2em] font-['Space_Grotesk']">
              EMISIÓN CONTINUA · 24/7
            </div>
            <div className="flex items-center gap-[12px]">
              <button
                onClick={toggleMute}
                className="flex items-center justify-center w-[20px] h-[20px] opacity-60 hover:opacity-100 transition-opacity duration-200"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 10V14H7L12 19V5L7 10H3Z" stroke="#E8E3DB" strokeWidth="1.5" strokeLinejoin="round" />
                  {muted ? (
                    <>
                      <line x1="18" y1="9" x2="23" y2="14" stroke="#E8E3DB" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="23" y1="9" x2="18" y2="14" stroke="#E8E3DB" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <path d="M16 9C17.5 10.5 17.5 13.5 16 15" stroke="#E8E3DB" strokeWidth="1.5" strokeLinecap="round" />
                  )}
                </svg>
              </button>
              <div className="flex items-center w-[100px] h-[20px]">
                <input
                  type="range" min="0" max="1" step="0.01"
                  value={muted ? 0 : volume}
                  onChange={handleVolume}
                  className="w-full appearance-none cursor-pointer"
                  style={{
                    height: "2px",
                    accentColor: "#9B1A2A",
                    background: `linear-gradient(to right, #9B1A2A ${(muted ? 0 : volume) * 100}%, rgba(232,227,219,0.2) ${(muted ? 0 : volume) * 100}%)`,
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #E8E3DB;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #E8E3DB;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
