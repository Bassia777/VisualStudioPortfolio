import type { Metadata } from 'next';

import ExperiencePage from '@/components/ExperiencePage';

export const metadata: Metadata = {
  title: 'Experience',
};

export default function Page() {
  return <ExperiencePage />;
}
