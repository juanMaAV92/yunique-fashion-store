import { QuantitySelector, Title } from '@/components';
import { initialData } from '@/seed/seed';
import Link from 'next/link';
import { IoArrowForwardOutline } from 'react-icons/io5';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const productInCart = initialData.products.slice(0, 4);

export default function () {
  if (productInCart.length === 0) {
    redirect('/empty');
  }

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

            {productInCart.map(product => (
              <div key={product.slug} className='flex mb-5'>
                <Image
                  src={`/products/${product.images[0]}`}
                  alt={product.title}
                  width={100}
                  height={100}
                  className='mr-5 rounded'
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'contain',
                  }}
                />
                <div>
                  <p>{product.title}</p>
                  <p>${product.price}</p>
                  <QuantitySelector
                    quantity={product.inStock}
                    maxQuantity={product.inStock}
                  />
                  <button className='underline mt-3'>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/*  Checkout */}
          <div className='right-2 bg-white rounded-xl shadow-xl p-7 h-fit'>
            <h2 className='text-2xl mb-2'>Order Summary</h2>
            <div className='grid grid-cols-2'>
              <span>No. Products</span>
              <span className='text-right'>3 Articles</span>

              <span>Subtotal</span>
              <span className='text-right'>$100</span>

              <span>Taxes</span>
              <span className='text-right'>$100</span>

              <span className='text-2xl mt-5'>Total:</span>
              <span className='text-2xl mt-5 text-right'>$110</span>
            </div>
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
