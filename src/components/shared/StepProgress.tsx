import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  number: number;
  title: string;
  description?: string;
}

interface StepProgressProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
}

export function StepProgress({ steps, currentStep, className = '' }: StepProgressProps) {
  const percent = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className={`w-full max-w-3xl mx-auto mb-8 ${className}`}>
      {/* Top Stepper Track */}
      <div className="relative flex items-center justify-between mb-3">
        {/* Continuous Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-[#E8E3E8] -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#6D3A70] transition-all duration-300 -z-0"
          style={{ width: `${percent}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isCompleted
                    ? 'bg-[#6D3A70] text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-[#6D3A70] text-[#6D3A70] ring-4 ring-[#FAF5FA]'
                    : 'bg-white border border-[#E8E3E8] text-[#8B8790]'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.number}
              </div>

              {/* Step Title on medium+ screens */}
              <div className="hidden sm:block text-center mt-2">
                <span
                  className={`text-[11px] font-bold block uppercase tracking-wider ${
                    isCurrent ? 'text-[#6D3A70]' : isCompleted ? 'text-[#25232A]' : 'text-[#8B8790]'
                  }`}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-[10px] text-[#6B6870] hidden md:block">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Step Title */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-xs font-semibold text-[#6D3A70]">
          Step {currentStep} of {steps.length}:
        </span>{' '}
        <span className="text-xs font-bold text-[#25232A]">
          {steps[currentStep - 1]?.title}
        </span>
      </div>
    </div>
  );
}
