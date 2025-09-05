'use client';

import { generatePaginationNumbers } from '@/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageString = searchParams.get('page') ?? 1;
  const currentPage = isNaN(+pageString) ? 1 : +pageString;
  if (currentPage < 1 || isNaN(+pageString)) {
    redirect(pathname);
  }

  const allPages = generatePaginationNumbers(currentPage, totalPages);

  const createPageUrl = (page: number | string) => {
    const params = new URLSearchParams(searchParams);
    if (page === '...') {
      return `${pathname}?${params.toString()}`;
    }

    if (+page === 0) {
      return `${pathname}`;
    }

    if (+page > totalPages) {
      return `${pathname}?${params.toString()}`;
    }
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className='flex  text-center justify-center mb-32 mt-10'>
      <nav aria-label='Page navigation example'>
        <ul className='flex list-style-none'>
          <li className='page-item'>
            <Link
              className='page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none disabled:opacity-50 disabled:cursor-not-allowed'
              href={createPageUrl(currentPage - 1)}
            >
              <IoChevronBackOutline size={30} />
            </Link>
          </li>

          {allPages.map((page, index) => (
            <li key={page + '-' + index} className='page-item'>
              <Link
                className={clsx(
                  'page-link relative block py-1.5 px-3  border-0  outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-blue-500 focus:shadow-none',
                  {
                    'bg-blue-600 shadow-md text-white hover:bg-blue-400':
                      page === currentPage,
                  }
                )}
                href={createPageUrl(page)}
              >
                {page}
              </Link>
            </li>
          ))}

          <li className='page-item'>
            <Link
              className='page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none disabled:opacity-50 disabled:cursor-not-allowed'
              href={createPageUrl(currentPage + 1)}
            >
              <IoChevronForwardOutline size={30} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
