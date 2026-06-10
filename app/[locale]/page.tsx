import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Problem } from '@/components/Problem';
import { Manifesto } from '@/components/Manifesto';
import { Approach } from '@/components/Approach';
import { WhatWeBuild } from '@/components/WhatWeBuild';
import { Apps } from '@/components/Apps';
import { Process } from '@/components/Process';
import { ForWho } from '@/components/ForWho';
import { Training, type TrainingContent } from '@/components/Training';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';
import { getCmsLandingPage } from '@/sanity/lib/landing';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const cmsPage = await getCmsLandingPage(params.locale);
  const trainingContent = cmsPage?.training as TrainingContent | undefined;

  return (
    <>
      <Header />
      <main className="relative">
        <Hero />
        <Problem />
        <Manifesto />
        <Approach />
        <WhatWeBuild />
        <Apps />
        <Process />
        <ForWho />
        <Training content={trainingContent} />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
