'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAppStore } from '@/store/app-store';
import { useAuth } from '@/lib/auth/auth-context';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Assessments', href: '/assessments' },
  { name: 'New Assessment', href: '/assessments/new' },
];

const adminNavigation = [
  { name: 'Admin', href: '/admin' },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme, language, setLanguage } = useAppStore();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  const allNavigation = user?.role === 'admin'
    ? [...navigation, ...adminNavigation]
    : navigation;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-p3-lemon-splash">
              <span className="text-lg font-bold text-p3-midnight-blue">P3</span>
            </div>
            <span className="hidden text-xl font-bold text-foreground sm:block">
              AI Assessment
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        {isAuthenticated && (
          <div className="hidden md:flex md:items-center md:gap-1">
            {allNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-p3-purple-rain/10 text-p3-purple-rain'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleLanguage}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle language"
          >
            <span className="text-xs font-semibold uppercase">{language}</span>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>

          {/* User menu */}
          {isAuthenticated && user && (
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="User menu"
              >
                <UserCircleIcon className="h-6 w-6" />
              </Button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg animate-scale-in">
                  <div className="border-b border-border p-4">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="mt-1 inline-block rounded-full bg-p3-purple-rain/10 px-2 py-0.5 text-xs font-medium text-p3-purple-rain">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Cog6ToothIcon className="h-4 w-4" />
                        Admin Settings
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile navigation */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="border-t border-border md:hidden animate-fade-in-down">
          <div className="space-y-1 px-4 py-3">
            {allNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-p3-purple-rain/10 text-p3-purple-rain'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
