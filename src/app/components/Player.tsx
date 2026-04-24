import { useState, useEffect, useRef } from "react";

const STREAM_URL = "https://radioweb-u71993.vm.elestio.app/listen/frecuencia/radio.mp3";
const STATION_API = "https://radioweb-u71993.vm.elestio.app/api/nowplaying/1";

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(40).fill(4));

  const [nowPlaying, setNowPlaying] = useState({
    artist: "Radio Frecuencia",
    title: "En directo",
    art: "",
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // FETCH DATA
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

  // FAKE VISUALIZER
  useEffect(() => {
    let raf: number;

    const animate = () => {
      setBars((prev) =>
        prev.map(() => Math.max(3, Math.random() * 25))
      );
      raf = requestAnimationFrame(animate);
    };

    if (playing) raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // PLAY
  const togglePlay = () => {
    if (!audioRef.current) {
      const audio = new Audio(STREAM_URL);
      audio.volume = volume;
      audioRef.current = audio;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      audioRef.current.muted = false;
      setMuted(false);
    }
  };

  return (
    <section className="bg-[#292524] py-[120px] text-[#E8E3DB]">
      <div className="max-w-[1100px] mx-auto px-[40px]">

        <div className="border border-[#E8E3DB]/10 p-[56px] flex flex-col gap-[48px]">

          {/* HEADER */}
          <div className="flex justify-between text-[11
