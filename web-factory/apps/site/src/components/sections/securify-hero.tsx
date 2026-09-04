type NavLink = {
  label: string;
  href: string;
};

type HeroStats = {
  topRight: {
    value: string;
    label: string;
  };
  bottomLeft: {
    value: string;
    label: string;
  };
  bottomRight: {
    value: string;
    label: string;
  };
};

export type SecurifyHeroProps = {
  brand?: string;
  videoSrc?: string;
  navLinks?: NavLink[];
  cta?: NavLink;
  headlineWords?: [string, string, string];
  description?: string;
  stats?: HeroStats;
};

const DEFAULT_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4";

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "platform", href: "#platform" },
  { label: "solutions", href: "#solutions" },
  { label: "company", href: "#company" },
  { label: "support", href: "#support" },
];

const DEFAULT_STATS: HeroStats = {
  topRight: {
    value: "+65k",
    label: "startups use",
  },
  bottomLeft: {
    value: "+1.5b",
    label: "gb data was protected",
  },
  bottomRight: {
    value: "+300k",
    label: "downloads",
  },
};

export function SecurifyHero({
  brand = "securify",
  videoSrc = DEFAULT_VIDEO_SRC,
  navLinks = DEFAULT_NAV_LINKS,
  cta = { label: "get started", href: "#get-started" },
  headlineWords = ["protect", "your", "data"],
  description = "we can guarding your data with utmost care, empowering you with privacy everywhere",
  stats = DEFAULT_STATS,
}: SecurifyHeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src={videoSrc}
        aria-hidden="true"
      />

      <div className="absolute left-0 right-0 top-0 z-20 px-6 pt-6 md:px-10">
        <nav className="flex items-center justify-between gap-4">
          <a
            className="flex items-center gap-2 rounded-full bg-neutral-900/90 py-3 pl-4 pr-6 backdrop-blur"
            href="#top"
            aria-label={brand.toLowerCase()}
          >
            <svg viewBox="0 0 256 256" className="h-5 w-5" aria-hidden="true">
              <path
                d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z"
                fill="#ffffff"
              />
            </svg>
            <span className="text-sm font-normal tracking-tight text-white">{brand.toLowerCase()}</span>
          </a>

          <div className="hidden items-center gap-1 rounded-full bg-neutral-900/90 px-3 py-2 backdrop-blur md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                className="rounded-full px-5 py-2 text-sm text-neutral-300 transition-colors hover:text-white"
                href={link.href}
              >
                {link.label.toLowerCase()}
              </a>
            ))}
          </div>

          <a
            className="rounded-full bg-white px-6 py-3 text-sm font-normal text-black transition-colors hover:bg-neutral-200"
            href={cta.href}
          >
            {cta.label.toLowerCase()}
          </a>
        </nav>
      </div>

      <div className="relative h-full w-full">
        <h1 className="hero-title absolute left-4 top-[18%] text-[14vw] font-medium text-white md:left-10 md:text-[13vw]">
          {headlineWords[0].toLowerCase()}
        </h1>
        <h1 className="hero-title absolute right-4 top-[38%] text-[14vw] font-medium text-white md:right-10 md:text-[13vw]">
          {headlineWords[1].toLowerCase()}
        </h1>
        <h1 className="hero-title absolute left-[18%] top-[58%] text-[14vw] font-medium text-white md:left-[28%] md:text-[13vw]">
          {headlineWords[2].toLowerCase()}
        </h1>

        <p className="absolute left-6 top-[46%] max-w-[240px] text-[15px] leading-snug text-white/90 md:left-10">
          {description.toLowerCase()}
        </p>

        <div className="absolute right-6 top-[14%] md:right-24">
          <div className="flex items-center justify-end gap-3">
            <span className="hidden h-px w-24 rotate-[20deg] bg-white/40 md:block" />
            <strong className="text-4xl font-medium tracking-tight md:text-5xl">{stats.topRight.value.toLowerCase()}</strong>
          </div>
          <p className="mt-1 text-right text-xs text-white/70 md:text-sm">{stats.topRight.label.toLowerCase()}</p>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />

        <div className="absolute bottom-20 left-6 md:bottom-24 md:left-20">
          <div className="flex items-center gap-3">
            <strong className="text-4xl font-medium tracking-tight md:text-5xl">{stats.bottomLeft.value.toLowerCase()}</strong>
            <span className="hidden h-px w-24 rotate-[-20deg] bg-white/40 md:block" />
          </div>
          <p className="mt-1 text-xs text-white/70 md:text-sm">{stats.bottomLeft.label.toLowerCase()}</p>
        </div>

        <div className="absolute bottom-16 right-6 md:bottom-20 md:right-20">
          <div className="flex items-center justify-end gap-3">
            <span className="hidden h-px w-24 rotate-[-20deg] bg-white/40 md:block" />
            <strong className="text-4xl font-medium tracking-tight md:text-5xl">{stats.bottomRight.value.toLowerCase()}</strong>
          </div>
          <p className="mt-1 text-right text-xs text-white/70 md:text-sm">{stats.bottomRight.label.toLowerCase()}</p>
        </div>
      </div>
    </section>
  );
}
