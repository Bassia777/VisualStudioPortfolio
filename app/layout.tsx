import type { Metadata } from 'next';

import Layout from '@/components/Layout';
import { profile } from '@/data/profile';

import '@/styles/globals.css';
import '@/styles/themes.css';

export const metadata: Metadata = {
  title: {
    default: profile.site.title,
    template: `${profile.identity.name} | %s`,
  },
  description: profile.site.description,
  keywords: [...profile.site.keywords],
  openGraph: {
    title: profile.site.openGraphTitle,
    description: profile.site.openGraphDescription,
    images: [profile.site.openGraphImage],
    url: profile.site.url,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
