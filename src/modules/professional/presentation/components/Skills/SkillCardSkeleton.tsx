export default function SkillCardSkeleton() {
  return (
    <div className="relative bg-[#1a1a2e] rounded-2xl p-5 flex items-center justify-between border border-white/5 animate-pulse">
      <div className="flex items-center gap-4">
        {/* Placeholder del Logo de Tecnología */}
        <div className="w-12 h-12 rounded-xl bg-white/10" />

        <div className="space-y-3">
          {/* Placeholder del Nombre de la Skill */}
          <div className="h-5 w-32 bg-white/10 rounded-lg" />

          {/* Placeholder del Nivel e Icono */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white/5" />
            <div className="h-3 w-16 bg-white/5 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Placeholder del botón de menú (Kebab) */}
      <div className="w-10 h-10 rounded-full bg-white/5" />
    </div>
  );
}
