import { titleFont } from '@/config/fonts';
import Link from 'next/link';

export const Footer = () => {
  return (
    <div className='flex justify-center w-full text-xs mb-10'>
      <Link href='/' className='hover:underline'>
        <span>© {new Date().getFullYear()} </span>
        <span className={`${titleFont.className} antialiased font-bold`}>
          Yunique Store.
        </span>
      </Link>
    </div>
  );
};
