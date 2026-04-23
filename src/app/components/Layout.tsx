function PlayButton() {
  return (
    <button className="w-16 h-16 bg-[#9B1A2A] rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 5v14l11-7L8 5z" fill="#E8E3DB" />
      </svg>
    </button>
  );
}

function ProgressBar() {
  return (
    <div className="w-full h-[2px] bg-[#E8E3DB]/20 relative">
      <div className="h-full bg-[#9B1A2A] w-[35%]" />
    </div>
  );
}

function Content2() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full max-w-[600px]" data-name="Content">
      <p className="font-['Space_Grotesk',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[12px] w-full text-center text-[#E8E3DB] uppercase tracking-wider">
        Ahora suena
      </p>
      <p className="font-['Newsreader',serif] italic leading-[1.2] relative shrink-0 text-[48px] w-full text-center text-[#E8E3DB]">
        Artista - Nombre de la canción
      </p>
      <PlayButton />
      <div className="w-full flex flex-col gap-[12px]">
        <ProgressBar />
        <p className="font-['Space_Grotesk',sans-serif] font-normal leading-[1.5] relative text-[12px] text-[#E8E3DB]/60 text-center">
          Emisión continua · 24/7
        </p>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col items-center relative w-full" data-name="Content">
      <Content2 />
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex justify-center items-center relative shrink-0 w-full" data-name="Component">
      <Content />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <Component />
    </div>
  );
}

export default function Layout() {
  return (
    <div className="bg-[#292524] content-stretch flex flex-col items-center px-[64px] py-[112px] relative size-full" data-name="Layout / 13 /">
      <Container />
    </div>
  );
}
