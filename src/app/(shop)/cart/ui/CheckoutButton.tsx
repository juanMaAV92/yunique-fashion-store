'use client';

import { createCheckoutSession, createYunoCustomer } from '@/actions';
import { useCartStore, useCustomerStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';

export const CheckoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { customer, setYunoCustomerId } = useCustomerStore(
    useShallow(state => ({
      customer: state.customer,
      setYunoCustomerId: state.setYunoCustomerId
    }))
  );
  const cart = useCartStore(state => state.cart);
  
  const cartSummary = useMemo(() => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxes = subtotal * 0.15;
    const total = subtotal + taxes;
    return { subtotal, taxes, total, itemsInCart: cart.length };
  }, [cart]);

  const handleCheckout = async () => {
    if (!customer) {
      router.push('/customer');
      return;
    }

    if (cartSummary.itemsInCart === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate a unique merchant customer ID
      const merchantCustomerId = `customer_${uuidv4()}`;
      
      console.log('Creating Yuno customer with data:', {
        customerData: customer,
        merchantCustomerId
      });

      // Create customer in Yuno
      const customerResult = await createYunoCustomer({
        customerData: customer,
        merchantCustomerId
      });

      if (!customerResult.success || !customerResult.data) {
        throw new Error(customerResult.error || 'Failed to create customer');
      }

      console.log('Yuno customer created successfully:', customerResult.data);

      // Store the Yuno customer ID in the store
      setYunoCustomerId(customerResult.data.id);

      // Generate a unique order ID
      const merchantOrderId = `order_${uuidv4()}`;
      
      console.log('Creating checkout session with data:', {
        customerId: customerResult.data.id,
        merchantOrderId,
        amount: cartSummary.total,
        currency: 'USD' 
      });

      // Create checkout session in Yuno
      const sessionResult = await createCheckoutSession({
        customerId: customerResult.data.id,
        merchantOrderId,
        paymentDescription: `Order ${merchantOrderId}`,
        amount: {
          currency: 'USD',
          value: cartSummary.total
        },
        country: customer.country
      });

      if (!sessionResult.success || !sessionResult.data) {
        throw new Error(sessionResult.error || 'Failed to create checkout session');
      }

      console.log('Checkout session created successfully:', sessionResult.data);

      sessionStorage.setItem('checkoutSession', sessionResult.data.checkout_session);
      sessionStorage.setItem('merchantOrderId', merchantOrderId);
      
      // Redirect to checkout page with session created
      router.push('/checkout');
      
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(`Error during checkout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`w-full flex justify-center btn-primary ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </div>
      ) : (
        'Checkout'
      )}
    </button>
  );
};
