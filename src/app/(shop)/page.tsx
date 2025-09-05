import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{
    page?: string;
    take?: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 1;
  const take = resolvedSearchParams.take
    ? parseInt(resolvedSearchParams.take)
    : 12;
  const { products, totalPages, currentPage } =
    await getPaginatedProductsWithImages({ page, take });

  if (products.length === 0) {
    redirect('/');
  }

  return (
    <>
      <Title title='Store' subtitle='All Products' className='mb-1' />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
