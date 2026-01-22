'use client';

import * as React from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  showFooter?: boolean;
}

export function MainLayout({
  children,
  className,
  fullWidth = false,
  showFooter = true,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main
        className={cn(
          'flex-1',
          !fullWidth && 'mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8',
          className
        )}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

// Page wrapper with gradient background
interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function PageWrapper({
  children,
  className,
  gradient = false,
}: PageWrapperProps) {
  return (
    <div
      className={cn(
        'min-h-[calc(100vh-4rem)]',
        gradient && 'bg-p3-gradient-mesh',
        className
      )}
    >
      {children}
    </div>
  );
}

// Section component for consistent spacing
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function Section({
  children,
  className,
  title,
  description,
}: SectionProps) {
  return (
    <section className={cn('py-8', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
