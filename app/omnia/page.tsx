import type { Metadata } from 'next';
import Homepage from '@/components/Homepage';

// The Omnia Fishing homepage prototype. Moved off the root route so the
// domain's landing page stays a neutral Never9 test page; the prototype and
// all AEO routes remain reachable for the dev handoff.
export const metadata: Metadata = {
  title: 'Omnia Fishing | Plan smarter. Fish better.',
  description:
    'Map-based fishing planning, local fishing reports, and contextual tackle shopping in one place.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Homepage />;
}
