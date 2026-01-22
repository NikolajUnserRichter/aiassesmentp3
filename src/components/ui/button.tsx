'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-p3-purple-rain text-white shadow-md hover:bg-p3-purple-rain-600 hover:shadow-lg hover:shadow-p3-purple-rain/25',
        primary:
          'bg-p3-electric-blue text-white shadow-md hover:bg-p3-electric-blue-600 hover:shadow-lg hover:shadow-p3-electric-blue/25',
        secondary:
          'bg-p3-midnight-blue text-white shadow-md hover:bg-p3-midnight-blue-700 hover:shadow-lg',
        accent:
          'bg-p3-lemon-splash text-p3-midnight-blue shadow-md hover:bg-p3-lemon-splash-600 hover:shadow-lg hover:shadow-p3-lemon-splash/25',
        success:
          'bg-p3-green-day text-white shadow-md hover:bg-p3-green-day-600 hover:shadow-lg hover:shadow-p3-green-day/25',
        destructive:
          'bg-p3-flying-salmon text-white shadow-md hover:bg-p3-flying-salmon-600 hover:shadow-lg hover:shadow-p3-flying-salmon/25',
        outline:
          'border-2 border-p3-purple-rain text-p3-purple-rain bg-transparent hover:bg-p3-purple-rain hover:text-white',
        ghost:
          'hover:bg-muted hover:text-accent-foreground',
        link:
          'text-p3-purple-rain underline-offset-4 hover:underline',
        glass:
          'glass text-foreground hover:bg-white/80 dark:hover:bg-p3-midnight-blue-700/80',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-lg px-4 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-2xl px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
