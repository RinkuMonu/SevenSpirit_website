import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../api/axios.js';

const NAME = 'SevenSpirit';
const DEFAULT_DESC = 'Chat or call verified astrologers online. Pick an astrologer, choose a plan, pay securely and start your private consultation.';

export default function Seo({ title, description = DEFAULT_DESC, path = '', image, type = 'website', jsonLd, noindex = false }) {
  const full = title ? `${title} | ${NAME}` : `${NAME} – Chat & Call With Trusted Astrologers`;
  const url = `${SITE_URL}${path}`;
  const img = image || `${SITE_URL}/og-image.jpg`;
  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:site_name" content={NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
