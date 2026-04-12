interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export const Stepper = ({ currentStep, totalSteps }: StepperProps) => {
  return (
    <div className="flex items-center gap-1 bg-src-a5a6f6 py-2 px-6 rounded-full  w-max shadow-sm">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((num) => {
        const isActive = num === currentStep;
        return (
          <div
            key={num}
            className={`items-center justify-center rounded-full text-xs font-bold whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out
                            ${
                              isActive
                                ? 'max-w-[120px] opacity-100 px-4 py-1.5 bg-src-1a1b41 text-white'
                                : 'max-w-0 opacity-0 px-0 py-0 bg-transparent text-transparent'
                            }
                        `}
          >
            PASO {num}
          </div>
        );
      })}
    </div>
  );
};
