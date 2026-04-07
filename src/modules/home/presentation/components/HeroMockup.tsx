const LightningIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#2dd4bf" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
  </svg>
);

export const HeroMockup = () => {
  return (
    <div className="relative w-full max-w-[420px] aspect-square">
      <div className="absolute inset-0 rounded-3xl bg-[#0b0f22] border border-white/5 shadow-2xl shadow-black/50 overflow-hidden">

        <div className="absolute top-5 left-5 bg-[#0f1530]/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/5 z-10">
          <p className="text-slate-500 text-[10px] font-medium tracking-widest uppercase mb-1.5">Styles</p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-1 w-16 rounded-full bg-violet-500/60" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-10 rounded-full bg-slate-600/60" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 rounded-full bg-slate-600/40" />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center translate-x-8 translate-y-4">
          {[160, 130, 104, 82, 62, 44].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: size,
                height: size,
                borderColor:
                  i === 2
                    ? 'rgba(45, 212, 191, 0.55)'
                    : i === 0
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(255,255,255,0.06)',
                boxShadow: i === 2 ? '0 0 12px rgba(45,212,191,0.3)' : 'none',
                backgroundColor:
                  i === 5
                    ? 'rgba(45,212,191,0.08)'
                    : `rgba(15,21,48,${0.3 + i * 0.1})`,
              }}
            />
          ))}
          <div className="absolute w-3 h-3 rounded-full bg-teal-400/70 shadow-lg shadow-teal-400/50" />
        </div>

        <div className="absolute bottom-5 right-5 flex items-center gap-1.5 bg-[#0d1428]/90 backdrop-blur-sm border border-teal-500/20 rounded-full px-3 py-1.5 z-10">
          <div className="w-5 h-5 rounded-full bg-teal-400/15 flex items-center justify-center">
            <LightningIcon />
          </div>
          <span className="text-teal-300 text-xs font-semibold tracking-wide">Auto-Responsive</span>
        </div>
      </div>

      <div className="absolute inset-0 rounded-3xl bg-violet-600/10 blur-3xl scale-90 -z-10" />
    </div>
  );
};
