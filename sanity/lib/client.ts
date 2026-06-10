import { createClient } from 'next-sanity';
import { apiVersion, dataset, isSanityConfigured, projectId } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
});

export async function fetchFromSanity<T>(query: string, params?: Record<string, unknown>) {
  if (!isSanityConfigured) return null;

  try {
    return await client.fetch<T>(query, params ?? {}, {
      next: { revalidate: 60 },
    });
  } catch (error) {
    console.error('[sanity] fetch failed', error);
    return null;
  }
}
