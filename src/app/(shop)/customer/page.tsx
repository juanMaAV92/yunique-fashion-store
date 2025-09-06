import { Title } from '@/components';
import { CustomerForm } from './ui/CustomerForm';

export default function CustomerPage() {
  return (
    <div className='flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0'>
      <div className='w-full xl:w-[1000px] flex flex-col justify-center text-left'>
        <Title title='Customer Information' subtitle='Tell us about yourself' />
        <CustomerForm />
      </div>
    </div>
  );
}
