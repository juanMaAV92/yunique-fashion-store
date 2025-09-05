'use client';

import { CustomerData, useCustomerStore } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'PA', name: 'Panama' },
  { code: 'CO', name: 'Colombia' },
  { code: 'AR', name: 'Argentina' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Peru' },
  { code: 'ES', name: 'Spain' },
];

export const CustomerForm = () => {
  const router = useRouter();
  const { customer, setCustomer } = useCustomerStore();
  
  const [formData, setFormData] = useState<CustomerData>({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.email || '',
    country: customer?.country || '',
    phone: customer?.phone || '',
  });

  const [errors, setErrors] = useState<Partial<CustomerData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CustomerData]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save customer data to store
      setCustomer(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect back to cart
      router.push('/cart');
      
    } catch (error) {
      console.error('Error saving customer data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2'>
      <div className='flex flex-col mb-2'>
        <label htmlFor='firstName' className='mb-1 font-medium'>
          First Name *
        </label>
        <input
          type='text'
          id='firstName'
          name='firstName'
          value={formData.firstName}
          onChange={handleInputChange}
          className={`p-2 border rounded-md bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='Enter your first name'
        />
        {errors.firstName && (
          <span className='text-red-500 text-sm mt-1'>{errors.firstName}</span>
        )}
      </div>

      <div className='flex flex-col mb-2'>
        <label htmlFor='lastName' className='mb-1 font-medium'>
          Last Name *
        </label>
        <input
          type='text'
          id='lastName'
          name='lastName'
          value={formData.lastName}
          onChange={handleInputChange}
          className={`p-2 border rounded-md bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.lastName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='Enter your last name'
        />
        {errors.lastName && (
          <span className='text-red-500 text-sm mt-1'>{errors.lastName}</span>
        )}
      </div>

      <div className='flex flex-col mb-2 sm:col-span-2'>
        <label htmlFor='email' className='mb-1 font-medium'>
          Email Address *
        </label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleInputChange}
          className={`p-2 border rounded-md bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='Enter your email address'
        />
        {errors.email && (
          <span className='text-red-500 text-sm mt-1'>{errors.email}</span>
        )}
      </div>

      <div className='flex flex-col mb-2'>
        <label htmlFor='country' className='mb-1 font-medium'>
          Country *
        </label>
        <select
          id='country'
          name='country'
          value={formData.country}
          onChange={handleInputChange}
          className={`p-2 border rounded-md bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.country ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value=''>Select your country</option>
          {countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && (
          <span className='text-red-500 text-sm mt-1'>{errors.country}</span>
        )}
      </div>

      <div className='flex flex-col mb-2'>
        <label htmlFor='phone' className='mb-1 font-medium'>
          Phone Number *
        </label>
        <input
          type='tel'
          id='phone'
          name='phone'
          value={formData.phone}
          onChange={handleInputChange}
          className={`p-2 border rounded-md bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='Enter your phone number'
        />
        {errors.phone && (
          <span className='text-red-500 text-sm mt-1'>{errors.phone}</span>
        )}
      </div>

      <div className='flex flex-col sm:flex-row gap-4 sm:col-span-2 sm:mt-6'>
        <Link
          href='/cart'
          className='btn-secondary flex justify-center items-center px-6 py-3 text-center'
        >
          Back to Cart
        </Link>
        
        <button
          type='submit'
          disabled={isSubmitting}
          className='btn-primary flex justify-center items-center px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </form>
  );
};
