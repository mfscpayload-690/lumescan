'use client';

import { Navbar } from '@/landing/Navbar';
import { Hero } from '@/landing/Hero';
import { Features } from '@/landing/Features';
import { Footer } from '@/landing/Footer';
import { useReveal } from '@/hooks/useReveal';

export default function WelcomePage() {
  useReveal(); // Initialize observer for reveal classes

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
