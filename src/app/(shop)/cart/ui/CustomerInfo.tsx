'use client';

import { useCustomerStore } from '@/store';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoPencilOutline } from 'react-icons/io5';

const countryNames: Record<string, string> = {
  'US': 'United States',
  'CA': 'Canada',
  'MX': 'Mexico',
  'CR': 'Costa Rica',
  'GT': 'Guatemala',
  'PA': 'Panama',
  'CO': 'Colombia',
  'AR': 'Argentina',
  'BR': 'Brazil',
  'CL': 'Chile',
  'PE': 'Peru',
  'ES': 'Spain',
};

export const CustomerInfo = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const customer = useCustomerStore(state => state.customer);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className='animate-pulse mb-6'>
        <div className='flex justify-between items-center mb-2'>
          <div className='h-8 bg-gray-200 rounded w-48'></div>
          <div className='h-4 bg-gray-200 rounded w-12'></div>
        </div>
        <div className='space-y-2'>
          <div className='h-6 bg-gray-200 rounded w-3/4'></div>
          <div className='h-4 bg-gray-200 rounded w-2/3'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/3'></div>
        </div>
        <div className='w-full h-0.5 rounded bg-gray-200 mt-5 mb-5' />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className='mb-6'>
      <div className='flex justify-between items-center mb-2'>
        <h2 className='text-2xl'>Customer Information</h2>
        <Link
          href='/customer'
          className='text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm transition-colors underline'
        >
          <IoPencilOutline size={16} />
          Edit
        </Link>
      </div>
      
      <div className='space-y-1'>
        <p className='text-xl font-medium'>
          {customer.firstName} {customer.lastName}
        </p>
        <p className='text-gray-700'>{customer.email}</p>
        <p className='text-gray-700'>
          {countryNames[customer.country] || customer.country}
        </p>
        <p className='text-gray-700'>{customer.phone}</p>
      </div>

      <div className='w-full h-0.5 rounded bg-gray-200 mt-5 mb-5' />
    </div>
  );
};
