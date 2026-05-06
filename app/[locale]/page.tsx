import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Problem } from '@/components/Problem';
import { Approach } from '@/components/Approach';
import { WhatWeBuild } from '@/components/WhatWeBuild';
import { Apps } from '@/components/Apps';
import { Process } from '@/components/Process';
import { ForWho } from '@/components/ForWho';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="relative">
        <Hero />
        <Problem />
        <Approach />
        <WhatWeBuild />
        <Apps />
        <Process />
        <ForWho />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
