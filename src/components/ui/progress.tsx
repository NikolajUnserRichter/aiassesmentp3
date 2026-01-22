'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      variant = 'default',
      size = 'default',
      showLabel = false,
      animated = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: 'h-1.5',
      default: 'h-2.5',
      lg: 'h-4',
    };

    const variantClasses = {
      default: 'bg-p3-purple-rain',
      success: 'bg-p3-green-day',
      warning: 'bg-orange-500',
      danger: 'bg-p3-flying-salmon',
      accent: 'bg-p3-lemon-splash',
    };

    return (
      <div className={cn('relative', className)} {...props}>
        <div
          ref={ref}
          className={cn(
            'w-full overflow-hidden rounded-full bg-muted',
            sizeClasses[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              variantClasses[variant],
              animated && 'shimmer'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{value}</span>
            <span>{max}</span>
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Step progress indicator
interface StepProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <React.Fragment key={step}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300',
                  isCompleted && 'border-p3-green-day bg-p3-green-day text-white',
                  isCurrent && 'border-p3-purple-rain bg-p3-purple-rain text-white shadow-glow',
                  !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium transition-colors',
                  isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 px-4">
                <div className="h-0.5 w-full bg-muted">
                  <div
                    className={cn(
                      'h-full bg-p3-green-day transition-all duration-500',
                      isCompleted ? 'w-full' : 'w-0'
                    )}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Circular progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent';
  showLabel?: boolean;
  className?: string;
}

function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: '#6544FE',
    success: '#005B4C',
    warning: '#F97316',
    danger: '#FF7F6A',
    accent: '#DBFF55',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
          <span className="text-xs text-muted-foreground">{value} / {max}</span>
        </div>
      )}
    </div>
  );
}

export { Progress, StepProgress, CircularProgress };
