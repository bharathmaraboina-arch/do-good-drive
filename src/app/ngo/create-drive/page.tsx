'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateDriveRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ngo/opportunities/new');
  }, [router]);

  return null;
}
