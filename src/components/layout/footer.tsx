'use client';

import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo and copyright */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-p3-lemon-splash">
              <span className="text-sm font-bold text-p3-midnight-blue">P3</span>
            </div>
            <span className="text-sm text-muted-foreground">
              © {currentYear} P3 Group. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/help"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Help
            </Link>
          </div>
        </div>

        {/* Compliance note */}
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            This tool helps assess AI usage in compliance with EU AI Act and GDPR requirements.
            Always consult with your legal and compliance teams for final decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
