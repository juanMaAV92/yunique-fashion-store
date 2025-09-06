'use client';

import { Title } from '@/components';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoCardOutline } from 'react-icons/io5';

interface Props {
  params: {
    id: string;
  };
}

interface PaymentData {
  id: string;
  status: 'SUCCEEDED' | 'DECLINED' | 'PENDING' | string;
  amount: {
    value: number;
    currency: string;
  };
  merchant_order_id: string;
  [key: string]: any;
}

export default function OrderPage({ params }: Props) {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { cart, getSummaryInformation } = useCartStore();
  const { itemsInCart, subtotal, taxes, total } = getSummaryInformation();

  useEffect(() => {
    const loadPaymentData = () => {
      try {
        const storedData = localStorage.getItem('paymentData');
        if (!storedData) {
          notFound();
          return;
        }

        const parsedData: PaymentData = JSON.parse(storedData);
        setPaymentData(parsedData);
      } catch (error) {
        console.error('Error parsing payment data:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentData();
  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (!paymentData) {
    notFound();
    return null;
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return {
          bgColor: 'bg-green-700',
          text: 'Payed',
          textColor: 'text-green-700'
        };
      case 'DECLINED':
        return {
          bgColor: 'bg-red-500',
          text: 'Payment Declined',
          textColor: 'text-red-500'
        };
      case 'PENDING':
        return {
          bgColor: 'bg-orange-500',
          text: 'Pending Payment',
          textColor: 'text-orange-500'
        };
      default:
        return {
          bgColor: 'bg-gray-500',
          text: 'Unknown Status',
          textColor: 'text-gray-500'
        };
    }
  };

  const statusConfig = getStatusConfig(paymentData.status);

  return (
    <div className='flex  justify-center items-center mb-72 px-10 sm:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title={`Order #${paymentData.id}`} subtitle='Order details' />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          <div className='flex flex-col mt-5'>
            <div
              className={`flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 ${statusConfig.bgColor}`}
            >
              <IoCardOutline size={30} />
              <span className='mx-2'>{statusConfig.text}</span>
            </div>
            {cart.map(item => (
              <div key={`${item.slug}-${item.size}`} className='flex mb-5'>
                <Image
                  src={`/products/${item.image}`}
                  alt={item.title}
                  width={100}
                  height={100}
                  className='mr-5 rounded'
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'contain',
                  }}
                />
                <div>
                  <p className='font-semibold'>{item.title}</p>
                  <p className='text-sm text-gray-600'>Size: {item.size}</p>
                  <p className='text-sm'>{currencyFormat(item.price)} x {item.quantity}</p>
                  <p className='font-bold'>Subtotal: {currencyFormat(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/*  Checkout */}
          <div className=' bg-white rounded-xl shadow-xl p-7'>

            <h2 className='text-2xl mb-2'>Order Summary</h2>
            <div className='grid grid-cols-2 gap-2'>
              <span>No. Products</span>
              <span className='text-right'>{itemsInCart} {itemsInCart === 1 ? 'Article' : 'Articles'}</span>

              <span>Subtotal</span>
              <span className='text-right'>{currencyFormat(subtotal)}</span>

              <span>Taxes (15%)</span>
              <span className='text-right'>{currencyFormat(taxes)}</span>

              <span className='text-2xl mt-5'>Total:</span>
              <span className='text-2xl mt-5 text-right'>{currencyFormat(total)}</span>
            </div>

            <div className='w-full h-0.5 rounded bg-gray-200 my-5' />

            <h2 className='text-xl mb-2'>Payment Details</h2>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <span>Order ID</span>
              <span className='text-right break-all'>{paymentData.merchant_order_id}</span>

              <span>Payment ID</span>
              <span className='text-right break-all'>{paymentData.id}</span>

              <span>Status</span>
              <span className={`text-right font-bold ${statusConfig.textColor}`}>{paymentData.status}</span>

              <span>Amount Paid</span>
              <span className='text-right'>
                ${paymentData.amount.value} {paymentData.amount.currency}
              </span>
            </div>
            <div className='mt-5 mb-2 w-full'>
              <div
                className={`flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 ${statusConfig.bgColor}`}
              >
                <IoCardOutline size={30} />
                <span className='mx-2'>{statusConfig.text}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
