function Content2() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Content">
      <p className="font-['Newsreader',serif] italic leading-[1.2] relative shrink-0 text-[48px] w-full text-[#E8E3DB]">
        Ahora suena
      </p>
      <p className="font-['Space_Grotesk',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[18px] w-full text-[#E8E3DB]">
        Artista - Nombre de la canción
      </p>
    </div>
  );
}

function SectionTitle() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Section Title">
      <Content2 />
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Content">
      <SectionTitle />
    </div>
  );
}

function PlayButton() {
  return (
    <button className="w-[56px] h-[56px] bg-[#9B1A2A] flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M6 4v12l10-6L6 4z" fill="#E8E3DB" />
      </svg>
    </button>
  );
}

function ProgressBar() {
  return (
    <div className="w-full flex flex-col gap-[8px]">
      <div className="w-full h-[2px] bg-[#E8E3DB]/20 relative">
        <div className="h-full bg-[#9B1A2A] w-[50%]" />
      </div>
      <div className="flex justify-between">
        <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/60">
          02:45
        </p>
        <p className="font-['Space_Grotesk',sans-serif] text-[11px] text-[#E8E3DB]/60">
          05:12
        </p>
      </div>
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Actions">
      <PlayButton />
      <ProgressBar />
      <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-[#E8E3DB]/60 uppercase tracking-[0.15em]">
        EMISIÓN CONTINUA · 24/7
      </p>
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-w-px relative" data-name="Content">
      <Content1 />
      <Actions />
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex gap-[80px] items-center relative shrink-0 w-full" data-name="Component">
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