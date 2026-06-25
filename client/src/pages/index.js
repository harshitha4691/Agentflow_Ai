import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically forwards the root URL traffic directly to the operator login workspace panel
    router.replace('/login');
  }, [router]);

  return null;
}