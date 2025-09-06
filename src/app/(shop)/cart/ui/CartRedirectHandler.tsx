'use client';

import { useCustomerStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const CartRedirectHandler = () => {
  const router = useRouter();
  const hasCustomer = useCustomerStore(state => state.hasCustomer());

  useEffect(() => {
    if (!hasCustomer) {
      router.push('/customer');
    }
  }, [hasCustomer, router]);

  // This component doesn't render anything
  return null;
};
