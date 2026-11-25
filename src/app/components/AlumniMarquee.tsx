export default function AlumniMarquee() {
  const companies = [
    {
      name: "OPENAI",
      label: "OpenAI",
      color: "from-emerald-400 to-teal-500",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400">
          <path d="M22.28 9.87a5.98 5.98 0 0 0-.52-4.92 6.05 6.05 0 0 0-6.61-2.82A5.99 5.99 0 0 0 10.6.5a6.05 6.05 0 0 0-5.77 4.19 6 6 0 0 0-4.04 2.93 6.05 6.05 0 0 0 .75 7.18 5.98 5.98 0 0 0 .52 4.92 6.05 6.05 0 0 0 6.61 2.82A6 6 0 0 0 13.24 24a6.05 6.05 0 0 0 5.77-4.19 6 6 0 0 0 4.04-2.93 6.05 6.05 0 0 0-.77-7.01Z" />
        </svg>
      ),
    },
    {
      name: "GOOGLE",
      label: "Google DeepMind",
      color: "from-blue-400 via-rose-400 to-amber-400",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      ),
    },
    {
      name: "ANTHROPIC",
      label: "Anthropic Claude",
      color: "from-amber-400 to-orange-500",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
          <path d="M14.2 2.5h-4.4L1 21.5h4.6l1.8-4.2h9.2l1.8 4.2h4.6L14.2 2.5zm-5.4 11.2l3.2-7.5 3.2 7.5H8.8z" />
        </svg>
      ),
    },
    {
      name: "STRIPE",
      label: "Stripe",
      color: "from-blue-500 to-indigo-600",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
        </svg>
      ),
    },
    {
      name: "META",
      label: "Meta / PyTorch",
      color: "from-sky-400 to-blue-600",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-sky-400">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93c-2.34 0-4.32-1.61-4.85-3.83h2.09c.43 1.09 1.48 1.83 2.76 1.83 1.66 0 3-1.34 3-3s-1.34-3-3-3c-1.28 0-2.33.74-2.76 1.83H8.15C8.68 7.68 10.66 6.07 13 6.07c3.27 0 5.93 2.66 5.93 5.93S16.27 17.93 13 17.93z" />
        </svg>
      ),
    },
    {
      name: "MICROSOFT",
      label: "Microsoft",
      color: "from-cyan-400 to-blue-500",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-400">
          <path d="M11.4 11.4H2V2h9.4v9.4zm10.6 0H12.6V2H22v9.4zM11.4 22H2v-9.4h9.4V22zm10.6 0H12.6v-9.4H22V22z" />
        </svg>
      ),
    },
    {
      name: "AMAZON",
      label: "AWS Cloud",
      color: "from-amber-400 to-orange-500",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" />
        </svg>
      ),
    },
    {
      name: "NETFLIX",
      label: "Netflix",
      color: "from-rose-500 to-red-600",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-rose-500">
          <path d="M5.5 2v20l4.5-2.5V4.5L5.5 2zm9 0L10 20.5V22l4.5-1.5L19 4V2h-4.5z" />
        </svg>
      ),
    },
  ];

  // Duplicate for seamless 100% infinite scroll
  const fullTrack = [...companies, ...companies];

  return (
    <div className="w-full mt-14 space-y-4">
      <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Alumni work at leading technology companies</span>
      </div>

      <div className="marquee-container py-2">
        <div className="marquee-track">
          {fullTrack.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="marquee-card cursor-pointer group"
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {company.svg}
              </div>
              <span className="text-xs font-black tracking-wider text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                {company.name}
              </span>
              <span className="text-[10px] font-medium text-[var(--muted)] border-l border-[var(--border-soft)] pl-2">
                {company.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
