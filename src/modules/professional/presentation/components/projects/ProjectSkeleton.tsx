export default function ProjectSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-[#1a1c29] rounded-2xl border border-white/5 p-6"
        >
          <div className="flex gap-6">
            <div className="w-[280px] h-[180px] bg-[#2c2f48] rounded-xl shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2c2f48] rounded-lg" />
                <div className="h-6 bg-[#2c2f48] rounded-lg w-48" />
              </div>
              <div className="h-4 bg-[#2c2f48] rounded w-24" />
              <div className="space-y-2">
                <div className="h-3 bg-[#2c2f48] rounded w-full" />
                <div className="h-3 bg-[#2c2f48] rounded w-4/5" />
                <div className="h-3 bg-[#2c2f48] rounded w-3/5" />
              </div>
              <div className="flex gap-2 mt-4">
                <div className="h-6 bg-[#2c2f48] rounded-full w-16" />
                <div className="h-6 bg-[#2c2f48] rounded-full w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
