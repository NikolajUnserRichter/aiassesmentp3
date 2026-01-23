'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Button, Card, CardContent } from '@/components/ui';
import { useAuth } from '@/lib/auth/auth-context';
import { useAppStore } from '@/store/app-store';
import { translations } from '@/config/translations';

const features = [
  {
    icon: ShieldCheckIcon,
    titleKey: 'compliance',
    color: 'text-p3-green-day',
    bgColor: 'bg-p3-green-day/10',
  },
  {
    icon: ChartBarIcon,
    titleKey: 'risk',
    color: 'text-p3-purple-rain',
    bgColor: 'bg-p3-purple-rain/10',
  },
  {
    icon: LightBulbIcon,
    titleKey: 'guidance',
    color: 'text-p3-electric-blue',
    bgColor: 'bg-p3-electric-blue/10',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useAuth();
  const { language } = useAppStore();
  const t = translations[language];

  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      await login();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-muted border-t-p3-purple-rain animate-spin" />
          <p className="text-sm text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="P3" width={40} height={40} className="h-10 w-auto" />
            <span className="text-xl font-bold text-foreground">AI Assessment</span>
          </div>
          <Button onClick={handleGetStarted} variant="default">
            {t.auth.signIn}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-p3-gradient-mesh opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <Image src="/logo.png" alt="P3" width={120} height={120} className="h-28 w-auto drop-shadow-xl" />
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">{t.landing.title}</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {t.landing.subtitle}
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button
                size="xl"
                onClick={handleGetStarted}
                rightIcon={<ArrowRightIcon className="h-5 w-5" />}
              >
                {t.landing.getStarted}
              </Button>
              <Button size="xl" variant="outline">
                {t.common.learnMore}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-p3-purple-rain/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-p3-electric-blue/20 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              {t.landing.features.title}
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
              const featureData = t.landing.features[feature.titleKey as keyof typeof t.landing.features] as {
                title: string;
                description: string;
              };
              return (
                <motion.div
                  key={feature.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card variant="elevated" hover="lift" className="h-full">
                    <CardContent className="p-8">
                      <div
                        className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor}`}
                      >
                        <feature.icon className={`h-7 w-7 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {featureData.title}
                      </h3>
                      <p className="mt-3 text-muted-foreground">
                        {featureData.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-p3-midnight-blue to-p3-purple-rain-800" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to assess your AI usage?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Start your first assessment and ensure compliance with regulatory requirements.
            </p>
            <div className="mt-10">
              <Button
                size="xl"
                variant="accent"
                onClick={handleGetStarted}
                rightIcon={<ArrowRightIcon className="h-5 w-5" />}
              >
                {t.landing.getStarted}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="P3" width={32} height={32} className="h-8 w-auto" />
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} P3 Group. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
