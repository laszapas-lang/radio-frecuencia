
function Logo() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Logo">
      <p className="font-['Newsreader',serif] italic text-[36px] text-[#E8E3DB]">
        Radio Frecuencia
      </p>
    </div>
  );
}

function Links() {
  return (
    <div className="content-start flex gap-[24px] items-start justify-center relative shrink-0" data-name="Links">
      <p className="font-['Space_Grotesk',sans-serif] leading-[1.5] relative shrink-0 text-[12px] text-[#E8E3DB] uppercase tracking-[0.1em]">
        FICHA TÉCNICA
      </p>
      <p className="font-['Space_Grotesk',sans-serif] leading-[1.5] relative shrink-0 text-[12px] text-[#E8E3DB] uppercase tracking-[0.1em]">
        ·
      </p>
      <p className="font-['Space_Grotesk',sans-serif] leading-[1.5] relative shrink-0 text-[12px] text-[#E8E3DB] uppercase tracking-[0.1em]">
        CONTACTO
      </p>
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center max-w-[480px] relative shrink-0 w-full" data-name="Content">
      <Logo />
      <Links />
    </div>
  );
}

function FooterLinks() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0" data-name="Footer Links">
      <p className="[text-decoration-skip-ink:none] decoration-solid relative shrink-0 underline text-[#E8E3DB] font-['Space_Grotesk',sans-serif]">
        Política de privacidad
      </p>
      <p className="[text-decoration-skip-ink:none] decoration-solid relative shrink-0 underline text-[#E8E3DB] font-['Space_Grotesk',sans-serif]">
        Términos de uso
      </p>
      <p className="[text-decoration-skip-ink:none] decoration-solid relative shrink-0 underline text-[#E8E3DB] font-['Space_Grotesk',sans-serif]">
        Cookies
      </p>
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex font-['Space_Grotesk',sans-serif] font-normal items-start justify-between leading-[1.5] relative shrink-0 text-[14px] text-[#E8E3DB] w-full whitespace-nowrap" data-name="Row">
      <p className="relative shrink-0">
        © 2026 Radio Frecuencia
      </p>
      <FooterLinks />
    </div>
  );
}

function Credits() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full" data-name="Credits">
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1280 1">
            <line id="Divider" stroke="#E8E3DB" x2="1280" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Row />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[80px] items-center max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <Content />
      <Credits />
    </div>
  );
}

export default function Footer() {
  return (
    <div className="bg-[#292524] content-stretch flex flex-col items-center px-[64px] py-[80px] relative size-full" data-name="Footer / 7 /">
      <Container />
    </div>
  );
}