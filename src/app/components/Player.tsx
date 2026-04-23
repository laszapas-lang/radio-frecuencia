import { useState, useEffect, useRef } from "react";

// ─── CONFIG — cambia esta URL por la de tu stream AzuraCast ───────────────────
const STREAM_URL = "https://TU_AZURACAST.elest.io/radio/8000/radio.mp3";
const STATION_API = "https://TU_AZURACAST.elest.io/api/nowplaying/1";
// ─────────────────────────────────────────────────────────────────────────────

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
  const [bars, setBars] = useState<number[]>(Array(40).fill(3));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  // Fetch now playing from AzuraCast API
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(STATION_API);
        const data = await res.json();
        setNowPlaying({
          artist: data.now_playing?.song?.artist || "Radio Frecuencia",
          title: data.now_playing?.song?.title || "Emisión en directo",
          listeners: data.listeners?.current || 0,
        });
      } catch {
        // API no disponible, usa valores por defecto
      }
    };
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 15000);
    return () => clearInterval(interval);
  }, []);

  // Animated bars — real analyser when playing, synthetic when not
  useEffect(() => {
    if (playing && analyserRef.current) {
      const analyser = analyserRef.current;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        const step = Math.floor(dataArray.length / 40);
        setBars(
          Array.from({ length: 40 }, (_, i) => {
            const val = dataArray[i * step] / 255;
            return Math.max(3, val * 80);
          })
        );
        animFrameRef.current = requestAnimationFrame(animate);
      };
      animFrameRef.current = requestAnimationFrame(animate);
    } else if (playing) {
      // Synthetic animation fallback
      const animate = () => {
        setBars((prev) =>
          prev.map((b) => {
            const delta = (Math.random() - 0.5) * 20;
            return Math.min(80, Math.max(3, b + delta));
          })
        );
        animFrameRef.current = requestAnimationFrame(animate);
      };
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animFrameRef.current);
      // Decay bars to low
      setBars((prev) => prev.map((b) => Math.max(3, b * 0.85)));
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [playing]);

  const togglePlay = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(STREAM_URL);
      audioRef.current.volume = volume;
    }

    if (!ctxRef.current) {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = ctx.createMediaElementSource(audioRef.current);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.connect(ctx.destination);
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      if (ctxRef.current.state === "suspended") {
        await ctxRef.current.resume();
      }
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <section className="bg-[#1C1A19] py-[64px]">
      <div className="max-w-[1280px] mx-auto px-[64px]">
        <div
          className="relative overflow-hidden"
          style={{
            border: "1px solid rgba(232,227,219,0.08)",
            background: "linear-gradient(135deg, #201E1D 0%, #171514 100%)",
          }}
        >
          {/* Decorative red glow */}
          <div
            className="absolute top-0 left-0 w-[300px] h-[300px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 0% 0%, rgba(155,26,42,0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 p-[48px] flex flex-col gap-[40px]">
            {/* Top bar */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-[10px]">
                <span
                  className="w-[6px] h-[6px] rounded-full"
                  style={{
                    backgroundColor: playing ? "#9B1A2A" : "#4a4745",
                    boxShadow: playing ? "0 0 8px #9B1A2A" : "none",
                    transition: "all 0.4s ease",
                  }}
                />
                <p
                  className="uppercase tracking-[0.2em] text-[10px]"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: playing
                      ? "rgba(232,227,219,0.9)"
                      : "rgba(232,227,219,0.4)",
                    transition: "color 0.4s ease",
                  }}
                >
                  {playing ? "EN ANTENA" : "AHORA SUENA"}
                </p>
              </div>
              <div className="flex items-center gap-[24px]">
                {nowPlaying.listeners > 0 && (
                  <p
                    className="text-[10px] uppercase tracking-[0.15em]"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "rgba(232,227,219,0.3)",
                    }}
                  >
                    {nowPlaying.listeners} oyentes
                  </p>
                )}
                <p
                  className="text-[10px] uppercase tracking-[0.15em]"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "rgba(232,227,219,0.3)",
                  }}
                >
                  320KBPS · AAC
                </p>
              </div>
            </div>

            {/* Main content: info + visualizer */}
            <div className="flex items-end gap-[48px]">
              {/* Left: play button + track info */}
              <div className="flex flex-col gap-[28px] flex-1">
                <div className="flex flex-col gap-[6px]">
                  <p
                    className="text-[42px] leading-[1.1]"
                    style={{
                      fontFamily: "'Newsreader', serif",
                      fontStyle: "italic",
                      color: "#E8E3DB",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {nowPlaying.artist}
                  </p>
                  <p
                    className="text-[20px] leading-[1.3]"
                    style={{
                      fontFamily: "'Newsreader', serif",
                      color: "rgba(232,227,219,0.5)",
                    }}
                  >
                    {nowPlaying.title}
                  </p>
                </div>

                {/* Controls row */}
                <div className="flex items-center gap-[28px]">
                  {/* Play button */}
                  <button
                    onClick={togglePlay}
                    className="relative flex items-center justify-center shrink-0"
                    style={{
                      width: 64,
                      height: 64,
                      background: playing
                        ? "#9B1A2A"
                        : "rgba(155,26,42,0.15)",
                      border: "1px solid rgba(155,26,42,0.6)",
                      transition: "all 0.25s ease",
                      cursor: "pointer",
                    }}
                  >
                    {playing ? (
                      // Pause icon
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="3" y="2" width="4" height="14" fill="#E8E3DB" />
                        <rect x="11" y="2" width="4" height="14" fill="#E8E3DB" />
                      </svg>
                    ) : (
                      // Play icon
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 2.5l12 6.5-12 6.5V2.5z" fill="#E8E3DB" />
                      </svg>
                    )}
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-[10px]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ opacity: 0.5 }}
                    >
                      <path
                        d="M11 5L6 9H2v6h4l5 4V5z"
                        stroke="#E8E3DB"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.54 8.46a5 5 0 0 1 0 7.07"
                        stroke="#E8E3DB"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M19.07 4.93a10 10 0 0 1 0 14.14"
                        stroke="#E8E3DB"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolume}
                      style={{
                        width: 80,
                        accentColor: "#9B1A2A",
                        cursor: "pointer",
                        opacity: 0.7,
                      }}
                    />
                  </div>

                  <p
                    className="text-[10px] uppercase tracking-[0.15em]"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "rgba(232,227,219,0.3)",
                    }}
                  >
                    EMISIÓN CONTINUA · 24/7
                  </p>
                </div>
              </div>

              {/* Right: Waveform visualizer */}
              <div
                className="flex items-end gap-[3px] shrink-0"
                style={{ height: 80 }}
                aria-hidden="true"
              >
                {bars.map((height, i) => (
                  <div
                    key={i}
                    style={{
                      width: 3,
                      height: `${height}px`,
                      background: playing
                        ? i % 3 === 0
                          ? "#9B1A2A"
                          : "rgba(232,227,219,0.6)"
                        : "rgba(232,227,219,0.1)",
                      borderRadius: 1,
                      transition: playing ? "height 0.08s ease" : "height 0.3s ease, background 0.4s ease",
                      transformOrigin: "bottom",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Bottom divider line */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(to right, rgba(155,26,42,0.4), rgba(232,227,219,0.05), transparent)",
              }}
            />

            {/* Recent tracks placeholder */}
            <div className="flex gap-[32px]">
              <p
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "rgba(232,227,219,0.25)",
                }}
              >
                Anteriormente
              </p>
              <div className="flex gap-[24px] overflow-hidden">
                {["—", "—", "—"].map((_, i) => (
                  <p
                    key={i}
                    className="text-[11px]"
                    style={{
                      fontFamily: "'Newsreader', serif",
                      fontStyle: "italic",
                      color: "rgba(232,227,219,0.2)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Historial no disponible
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
