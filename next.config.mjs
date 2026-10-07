import createNextIntlPlugin from 'next-intl/plugin';
import { videoLinks } from './video-links.mjs';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Liens courts /v/<clé> vers les vidéos (voir video-links.mjs). Temporaires (307) pour pouvoir changer la cible.
  async redirects() {
    return Object.entries(videoLinks).map(([cle, destination]) => ({
      source: `/v/${cle}`,
      destination,
      permanent: false,
    }));
  },
};

export default withNextIntl(nextConfig);
