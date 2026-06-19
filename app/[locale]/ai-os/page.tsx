import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AiosHero } from '@/components/aios/AiosHero';
import { AiosProblem } from '@/components/aios/AiosProblem';
import { AiosProposition } from '@/components/aios/AiosProposition';
import { AiosArchitecture } from '@/components/aios/AiosArchitecture';
import { AiosProof } from '@/components/aios/AiosProof';
import { AiosGuardrails } from '@/components/aios/AiosGuardrails';
import { AiosForWho } from '@/components/aios/AiosForWho';
import { AiosProcess } from '@/components/aios/AiosProcess';
import { AiosFinalCTA } from '@/components/aios/AiosFinalCTA';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'aios.meta' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale,
      type: 'website',
    },
  };
}

export default function AiOsPage() {
  return (
    <>
      <Header />
      <main className="relative">
        <AiosHero />
        <AiosProblem />
        <AiosProposition />
        <AiosArchitecture />
        <AiosProof />
        <AiosGuardrails />
        <AiosForWho />
        <AiosProcess />
        <AiosFinalCTA />
      </main>
      <Footer />
    </>
  );
}
