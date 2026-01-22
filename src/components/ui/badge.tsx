'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-muted text-foreground',
        primary: 'border-transparent bg-p3-purple-rain text-white',
        secondary: 'border-transparent bg-p3-electric-blue text-white',
        accent: 'border-transparent bg-p3-lemon-splash text-p3-midnight-blue',
        success: 'border-transparent bg-p3-green-day text-white',
        destructive: 'border-transparent bg-p3-flying-salmon text-white',
        warning: 'border-transparent bg-orange-500 text-white',
        outline: 'border-current text-foreground',
        // Risk level badges
        'risk-minimal': 'risk-minimal border',
        'risk-low': 'risk-low border',
        'risk-medium': 'risk-medium border',
        'risk-high': 'risk-high border',
        'risk-critical': 'risk-critical border',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2 py-0.5 text-2xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
