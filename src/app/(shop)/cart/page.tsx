import { Title } from '@/components';
import Link from 'next/link';
import { IoArrowForwardOutline } from 'react-icons/io5';
import { OrderSummary } from './ui/OrderSummary';
import { ProductsInCart } from './ui/ProductsInCart';

export default function () {
  // redirect('/empty');

  return (
    <div className='flex  justify-center items-center mb-72 px-10 sm:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title='Cart' subtitle='Your cart items' />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          <div className='flex flex-col mt-5'>
            <Link href='/' className='flex items-center gap-2 underline mb-5'>
              <span className='text-xl'>add more products</span>
              <IoArrowForwardOutline className='w-5 h-5' />
            </Link>

            {/* Cart Items */}
            <ProductsInCart />
          </div>

          {/*  Checkout */}
          <div className='right-2 bg-white rounded-xl shadow-xl p-7 h-fit'>
            <h2 className='text-2xl mb-2'>Order Summary</h2>

            <OrderSummary />

            <div className='mt-5 mb-2 w-full'>
              <Link
                href='/checkout/address'
                className='flex justify-center btn-primary '
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
