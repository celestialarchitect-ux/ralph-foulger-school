'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Mounted on the free preview pages (/free, /free/[slug]). Once a student has
// ACTIVE paid access they've moved past the free foundation, so we bounce them
// to the real curriculum for a clean slate (requested by a student who found
// it confusing where the free practice ended and the real course began).
//
// Free-tier, expired, and anonymous visitors are left alone — the free
// foundation is still their lead-magnet. Expired students are deliberately NOT
// redirected (they can't enter /course, so we'd bounce them to /pricing).
export function RedirectPaidToCourse() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const status = data?.user?.accessStatus;
        if (status === 'active' || status === 'lifetime') {
          router.replace('/course');
        }
      })
      .catch(() => {/* leave the page as-is on any error */});
    return () => { cancelled = true; };
  }, [router]);

  return null;
}
