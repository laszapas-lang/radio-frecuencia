function Content1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Content">
      <p className="font-['Newsreader',serif] italic leading-[1.2] relative shrink-0 text-[56px] w-full text-[#E8E3DB]">
        Radio Frecuencia
      </p>
      <p className="font-['Space_Grotesk',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[18px] w-full text-[#E8E3DB]">
        Música en español sin interrupciones
      </p>
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Actions">
      <div className="border border-[#9B1A2A] bg-transparent content-stretch flex items-center justify-center px-[24px] py-[12px] relative shrink-0" data-name="Button">
        <p className="font-['Space_Grotesk',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[16px] text-[#E8E3DB] whitespace-nowrap">
          Escuchar en directo
        </p>
      </div>
    </div>
  );
}

function Column() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[768px] relative shrink-0 w-full" data-name="Column">
      <Content1 />
      <Actions />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <Column />
    </div>
  );
}

function Content() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[64px] py-[112px] relative size-full">
          <Container />
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <div className="bg-[#292524] content-stretch flex flex-col items-center relative size-full" data-name="Header / 145 /">
      <Content />
    </div>
  );
}