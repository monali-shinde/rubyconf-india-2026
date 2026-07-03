export default function Navbar() {
  return (
    <nav className="fixed left-1/2 top-[1.1rem] z-50 flex w-[min(1100px,92vw)] -translate-x-1/2 items-center justify-between gap-10 rounded-full border border-white/10 bg-white/5 px-6 py-[0.7rem] shadow-[0_8px_32px_rgba(0,0,0,.35)] backdrop-blur-2xl">
      <a href="#top" className="flex items-center gap-2 text-ivory no-underline">
        <svg viewBox="0 0 40 30" className="h-[17px] w-[22px]" fill="none" aria-hidden>
          <circle cx="6" cy="9" r="2.6" stroke="#e8c766" strokeWidth="1.2" />
          <circle cx="15" cy="6" r="3.2" stroke="#e8c766" strokeWidth="1.2" />
          <circle cx="25" cy="6" r="3.2" stroke="#e8c766" strokeWidth="1.2" />
          <circle cx="34" cy="9" r="2.6" stroke="#e8c766" strokeWidth="1.2" />
          <path d="M13 26V14L20 8L27 14V26" stroke="#e8c766" strokeWidth="1.2" />
          <line x1="4" y1="26" x2="36" y2="26" stroke="#e8c766" strokeWidth="1.2" />
        </svg>
        <span className="font-display text-[0.9rem] font-semibold">
          RubyConf <em className="not-italic text-gold-bright">India</em> 2026
        </span>
      </a>
      <ul className="hidden list-none items-center gap-7 md:flex">
        {["Speakers", "Schedule", "Sponsors"].map((label) => (
          <li key={label}>
            <a
              href="#top"
              className="text-[0.72rem] font-medium uppercase tracking-[0.1em] text-ivory/75 no-underline transition-opacity hover:opacity-100"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <a
        href="#tickets"
        className="rounded-full px-5 py-[0.55rem] text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-pearl no-underline shadow-[0_4px_18px_rgba(201,31,55,.4)] transition-transform hover:-translate-y-0.5"
        style={{ background: "linear-gradient(135deg,var(--ruby),var(--ruby-hot))" }}
      >
        Get Your Pass
      </a>
    </nav>
  );
}
