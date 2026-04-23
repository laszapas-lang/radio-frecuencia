return (
  <section className="bg-[#292524] border-t border-[#E8E3DB]/10">
    <div className="max-w-[1280px] mx-auto px-[24px] md:px-[64px] py-[120px]">
      <div className="max-w-[720px] flex flex-col gap-[56px]">

        {/* HEADER */}
        <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.2em] font-['Space_Grotesk'] text-[#E8E3DB]/50">
          <div className="flex items-center gap-[10px]">
            <div className={`w-[6px] h-[6px] ${playing ? "bg-[#9B1A2A]" : "bg-[#E8E3DB]/20"}`} />
            <span>{playing ? "EN ANTENA" : "OFFLINE"}</span>
          </div>

          <span>{nowPlaying.listeners} OYENTES · 320KBPS</span>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-[1px] bg-[#E8E3DB]/10" />

        {/* TRACK INFO */}
        <div className="flex flex-col gap-[8px]">
          <p className="font-['Newsreader'] text-[56px] md:text-[72px] leading-[1.05] text-[#E8E3DB]">
            {nowPlaying.artist}
          </p>

          <p className="font-['Newsreader'] italic text-[20px] md:text-[24px] text-[#E8E3DB]/40">
            {nowPlaying.title}
          </p>
        </div>

        {/* VISUALIZER */}
        <div className="flex items-end gap-[2px] h-[60px]">
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
            className="w-[64px] h-[64px] border border-[#9B1A2A] flex items-center justify-center hover:bg-[#9B1A2A]/10 transition"
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

          <div className="flex items-center gap-[24px]">

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

            <span className="text-[11px] uppercase tracking-[0.2em] text-[#E8E3DB]/30 font-['Space_Grotesk']">
              EMISIÓN CONTINUA · 24/7
            </span>

          </div>

        </div>

      </div>
    </div>
  </section>
);
