import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Never9 Test Site',
  description: 'A test environment for Never9.ai prototypes.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-neutral-100">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Test site
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          This is a test site for{' '}
          <a
            href="https://never9.ai"
            className="underline decoration-neutral-600 underline-offset-4 hover:decoration-neutral-300"
          >
            Never9.ai
          </a>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-400">
          Nothing here is a live product. Pages on this domain are prototypes and
          may change or disappear at any time.
        </p>
      </div>
    </main>
  );
}
