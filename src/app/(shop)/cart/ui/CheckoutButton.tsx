'use client';

import { createCheckoutSession, createYunoCustomer, getYunoConfig } from '@/actions';
import { useCartStore, useCustomerStore } from '@/store';
import { notFound, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';
import { YunoPaymentModal } from './YunoPaymentModal';

export const CheckoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutSession, setCheckoutSession] = useState<string>('');
  const [merchantOrderId, setMerchantOrderId] = useState<string>('');
  
  const { customer, yunoCustomerId, setYunoCustomerId } = useCustomerStore(
    useShallow(state => ({
      customer: state.customer,
      yunoCustomerId: state.yunoCustomerId,
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
      const newMerchantOrderId = `order_${uuidv4()}`;
      setMerchantOrderId(newMerchantOrderId);
      
      console.log('Creating checkout session with data:', {
        customerId: customerResult.data.id,
        merchantOrderId: newMerchantOrderId,
        amount: cartSummary.total,
        currency: 'USD' 
      });

      // Create checkout session in Yuno
      const sessionResult = await createCheckoutSession({
        customerId: customerResult.data.id,
        merchantOrderId: newMerchantOrderId,
        paymentDescription: `Order ${newMerchantOrderId}`,
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
      const yunoConfig = await getYunoConfig();
      // Store session data
      sessionStorage.setItem('checkoutSession', sessionResult.data.checkout_session);
      sessionStorage.setItem('merchantOrderId', newMerchantOrderId);
      sessionStorage.setItem('publicApiKey', yunoConfig.data?.apiKey || '');
      
      // Set checkout session and open modal
      setCheckoutSession(sessionResult.data.checkout_session);
      setIsModalOpen(true);
      
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(`Error during checkout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentResult: any) => {
    const paymentData = paymentResult.success ? paymentResult.data : paymentResult;
    
    console.log('Payment ID:', paymentData?.id);
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
    
    if (paymentData?.id) {
      router.push(`/orders/${paymentData.id}`);
    } else {
      console.error('Payment ID not found. Full data:', paymentData);
      notFound();
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCheckoutSession('');
  };

  return (
    <>
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

      <YunoPaymentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        checkoutSession={checkoutSession}
        paymentAmount={cartSummary.total}
        paymentCurrency='USD'
        customerPayerId={yunoCustomerId || ''}
        merchantOrderId={merchantOrderId || ''}
        country={customer?.country || ''}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </>
  );
};
