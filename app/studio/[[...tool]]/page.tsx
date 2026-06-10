import type { Metadata } from 'next';
import { Studio } from './Studio';

export const metadata: Metadata = {
  title: 'MyAppFactory CMS',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-static';

export default function StudioPage() {
  return <Studio />;
}
