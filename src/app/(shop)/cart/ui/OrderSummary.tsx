'use client';

import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const OrderSummary = () => {
  const [loaded, setLoaded] = useState(false);
  const { subtotal, taxes, total, itemsInCart } = useCartStore(
    useShallow(state => state.getSummaryInformation())
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <div>Loading...</div>;

  return (
    <>
      <div className='grid grid-cols-2'>
        <span>No. Products</span>
        <span className='text-right'>
          {itemsInCart === 1 ? '1 Article' : `${itemsInCart} Articles`}
        </span>

        <span>Subtotal</span>
        <span className='text-right'>{currencyFormat(subtotal)}</span>

        <span>Taxes</span>
        <span className='text-right'>{currencyFormat(taxes)}</span>

        <span className='text-2xl mt-5'>Total:</span>
        <span className='text-2xl mt-5 text-right'>
          {currencyFormat(total)}
        </span>
      </div>
    </>
  );
};
