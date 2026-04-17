interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export const Stepper = ({ currentStep, totalSteps }: StepperProps) => {
  const visibleSteps = Array.from({ length: totalSteps }, (_, i) => i + 1).filter(
    (n) => n >= currentStep - 1 && n <= currentStep + 1
  );

  return (
    <div className="flex items-center gap-1 bg-src-a5a6f6 py-2 px-3 rounded-full w-max shadow-sm">
      {visibleSteps.map((num) => {
        const isActive = num === currentStep;
        return (
          <div
            key={num}
            className={`flex items-center justify-center rounded-full text-xs font-bold px-4 py-1.5 transition-all duration-300
              ${isActive
                ? 'bg-src-1a1b41 text-white'
                : 'bg-white/30 text-src-1a1b41'
              }`}
          >
            PASO {num}
          </div>
        );
      })}
    </div>
  );
};
