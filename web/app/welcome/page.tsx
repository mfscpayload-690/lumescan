'use client';

import { Navbar } from '@/landing/Navbar';
import { Hero } from '@/landing/Hero';
import { Features } from '@/landing/Features';
import { Workflow } from '@/landing/Workflow';
import { TechStack } from '@/landing/TechStack';
import { CTA } from '@/landing/CTA';
import { Footer } from '@/landing/Footer';
import { useReveal } from '@/hooks/useReveal';

export default function WelcomePage() {
  useReveal(); // Initialize observer for reveal classes

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        <Hero />
        <div className="bg-slate-950">
          <Features />
          <Workflow />
          <TechStack />
          <CTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
