import { getProductBySlug } from '@/actions';
import { ProductSlideshow, StockLabel } from '@/components';
import { titleFont } from '@/config/fonts';
import { notFound } from 'next/navigation';
import { AddToCard } from './ui/AddToCard';

interface Props {
  params: {
    slug: string;
  };
}

export default async function ({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className='mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3'>
      <div className='col-span-1 md:col-span-2'>
        <ProductSlideshow
          images={product.images}
          title={product.title}
          className='mb-5'
        />
      </div>
      <div className='col-span-1 px-5'>
        <StockLabel slug={product.slug} />

        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className='text-light mb-5'>${product.price}</p>

        <AddToCard product={product} />

        <h3 className='font-bold text-sm'>Description</h3>
        <p className='font-light'>{product.description}</p>
      </div>
    </div>
  );
}
