import type { Metadata } from 'next';
import { AeoChrome } from '@/components/aeo/Chrome';
import { TacklePortal } from '@/components/aeo/TacklePortal';

export const metadata: Metadata = {
  title: 'Tackle Match — Natural-Language Bait Finder | Omnia Fishing',
  description:
    'Describe your trip — species, lake, season — and get the techniques and baits Omnia anglers are using there, ranked by report mentions.',
  robots: { index: false, follow: true },
};

export default function TacklePage() {
  return (
    <AeoChrome>
      <TacklePortal />
    </AeoChrome>
  );
}
