import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, Title } from '@/components';
import { ProductGrid } from '@/components/products/product-grid/ProductGrid';
import { Gender } from '@/generated/prisma';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function ({ params, searchParams }: Props) {
  const { gender } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages, currentPage } =
    await getPaginatedProductsWithImages({ page, gender: gender as Gender });

  if (products.length === 0) {
    redirect('/');
  }

  const lables: Record<string, string> = {
    men: 'Men',
    women: 'Women',
    kid: 'Kids',
    unisex: 'All',
  };

  // if (gender === 'men') {
  //   notFound();
  // }

  return (
    <div>
      <Title title={`${lables[gender]} Products`} subtitle='All Products' />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
