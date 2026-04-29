import { useState, useEffect, useRef } from "react";
import { STREAM_URL, STATION_API } from "../constants";

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
  const playedAtRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const playingRef = useRef(false);

  // Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const duration = track.duration || 1;
  const progress = Math.min((elapsed / Math.max(duration, 1)) * 100, 100);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // NOWPLAYING — polling cada 3s como fuente principal de verdad
  // SSE como acelerador cuando está disponible, pero el polling es el backbone
  useEffect(() => {
    const applyData = (data: any) => {
      const playedAt: number = data.now_playing?.played_at || 0;
      const serverDuration: number = data.now_playing?.duration || 0;

      // Siempre actualizar si hay canción nueva, independientemente del estado de reproducción
      // La UI refleja lo que emite el servidor — el usuario verá la info correcta al retomar
      if (playedAt !== playedAtRef.current && playedAt > 0) {
        playedAtRef.current = playedAt;
        durationRef.current = serverDuration;

        setTrack({
          artist: data.now_playing?.song?.artist || "Radio Frecuencia",
          title: data.now_playing?.song?.title || "Emisión en directo",
          artwork: data.now_playing?.song?.art || "",
          duration: serverDuration,
        });

        // Calcular elapsed desde played_at — es la fuente más precisa
        const nowElapsed = Math.max(0, Math.floor(Date.now() / 1000) - playedAt);
        elapsedRef.current = Math.min(nowElapsed, serverDuration);
        setElapsed(elapsedRef.current);
      }
    };

    // Carga inicial
    fetch(STATION_API).then(r => r.json()).then(applyData).catch(() => {});

    // Polling cada 3s — suficientemente rápido para detectar cambios sin saturar
    const pollInterval = setInterval(() => {
      fetch(STATION_API).then(r => r.json()).then(applyData).catch(() => {});
    }, 3000);

    // SSE como acelerador: si llega antes del poll, mejor — pero no dependemos de él
    const SSE_URL = STATION_API.replace("/api/nowplaying/", "/api/live/nowplaying/");
    let es: EventSource | null = null;
    let sseReconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connectSSE = () => {
      try {
        es = new EventSource(SSE_URL);
        es.addEventListener("message", (e) => {
          try { applyData(JSON.parse(e.data)); } catch {}
        });
        es.onerror = () => {
          es?.close();
          es = null;
          // Reintentar SSE en 10s — mientras tanto el polling cubre
          sseReconnectTimeout = setTimeout(connectSSE, 10000);
        };
      } catch {}
    };

    connectSSE();

    return () => {
      clearInterval(pollInterval);
      es?.close();
      if (sseReconnectTimeout) clearTimeout(sseReconnectTimeout);
    };
  }, []);

  // TICK — solo incrementa, no sobreescribe; el poll corrige la deriva
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (playing) {
      tickRef.current = setInterval(() => {
        // Si el tick lleva al elapsed más allá de la duración, lo clampamos
        const next = Math.min(elapsedRef.current + 1, durationRef.current || 99999);
        elapsedRef.current = next;
        setElapsed(next);
      }, 1000);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [playing]);

  // VISUALIZER
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CREAM = "rgba(232,227,219,0.45)";
    const RED = "#9B1A2A";
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
          waveSmoothed[i] = waveData[i] > waveSmoothed[i]
            ? waveSmoothed[i] * 0.3 + waveData[i] * 0.7
            : waveSmoothed[i] * 0.6 + waveData[i] * 0.4;
        }
      } else {
        if (waveSmoothed) {
          for (let i = 0; i < waveSmoothed.length; i++) {
            waveSmoothed[i] = waveSmoothed[i] * 0.88 + 128 * 0.12;
          }
        }
      }

      const GAIN = 4.0;
      const bufLen = waveSmoothed ? waveSmoothed.length : 0;

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
      audioRef.current.volume = 1;
      audioRef.current.muted = muted;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.0;
      analyserRef.current = analyser;

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = muted ? 0 : volume;
      gainNodeRef.current = gainNode;

      const source = audioCtx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioCtx.destination);
    }

    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      // Reconectar al directo
      audioRef.current.src = STREAM_URL;
      audioRef.current.load();
      audioRef.current.play().catch(() => {});

      // Sincronizar con el servidor al reanudar
      fetch(STATION_API)
        .then(r => r.json())
        .then(data => {
          const playedAt: number = data.now_playing?.played_at || 0;
          const serverDuration: number = data.now_playing?.duration || 0;
          playedAtRef.current = playedAt;
          durationRef.current = serverDuration;
          setTrack({
            artist: data.now_playing?.song?.artist || "Radio Frecuencia",
            title: data.now_playing?.song?.title || "Emisión en directo",
            artwork: data.now_playing?.song?.art || "",
            duration: serverDuration,
          });
          const nowElapsed = playedAt > 0
            ? Math.max(0, Math.floor(Date.now() / 1000) - playedAt)
            : (data.now_playing?.elapsed || 0);
          elapsedRef.current = Math.min(nowElapsed, serverDuration);
          setElapsed(elapsedRef.current);
        })
        .catch(() => {});

      setPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !muted;
    audioRef.current.muted = newMuted;
    if (gainNodeRef.current) gainNodeRef.current.gain.value = newMuted ? 0 : volume;
    setMuted(newMuted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (gainNodeRef.current) gainNodeRef.current.gain.value = v;
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

          {/* TRACK INFO + VISUALIZER */}
          <div className="flex justify-between items-center mt-[40px]">
            <div className="flex gap-[24px] items-center">
              <div>
                <h1 className="font-['Newsreader'] text-[32px] md:text-[42px] leading-none text-[#E8E3DB] font-normal">
                  {track.artist}
                </h1>
                <p className="font-['Newsreader'] italic text-[20px] md:text-[26px] text-[#E8E3DB]/60 mt-[6px]">
                  {track.title}
                </p>
              </div>
            </div>

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
