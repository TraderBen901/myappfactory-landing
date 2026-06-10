import { fetchFromSanity } from './client';
import { landingPageQuery, siteSettingsQuery } from './queries';

export type CmsLocale = 'fr' | 'en';

export type CmsLandingPage = {
  _id: string;
  locale: CmsLocale;
  seo?: {
    title?: string;
    description?: string;
  };
  hero?: Record<string, unknown>;
  problem?: Record<string, unknown>;
  approach?: Record<string, unknown>;
  build?: Record<string, unknown>;
  apps?: Record<string, unknown>;
  process?: Record<string, unknown>;
  forWho?: Record<string, unknown>;
  training?: Record<string, unknown>;
  finalCta?: Record<string, unknown>;
};

export type CmsSiteSettings = {
  title?: string;
  defaultLocale?: CmsLocale;
  mainNav?: Array<{ label?: string; href?: string }>;
  contactEmail?: string;
  bookingUrl?: string;
};

export async function getCmsLandingPage(locale: string) {
  return fetchFromSanity<CmsLandingPage>(landingPageQuery, { locale });
}

export async function getCmsSiteSettings() {
  return fetchFromSanity<CmsSiteSettings>(siteSettingsQuery);
}
