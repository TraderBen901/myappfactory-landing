import { groq } from 'next-sanity';

export const landingPageQuery = groq`*[_type == "landingPage" && locale == $locale][0]{
  _id,
  locale,
  seo,
  hero,
  problem,
  approach,
  build,
  apps,
  process,
  forWho,
  training,
  finalCta
}`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  title,
  defaultLocale,
  mainNav,
  contactEmail,
  bookingUrl
}`;
