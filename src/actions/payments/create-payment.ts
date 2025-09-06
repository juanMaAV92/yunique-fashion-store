'use server';

import { validateYunoConfig, yunoConfig } from '@/lib/yuno';
import type { YunoErrorResponse, YunoPaymentResponse } from '@/types/yuno';
import { v4 as uuidv4 } from 'uuid';

interface CreatePaymentParams {
  description: string;
  merchantOrderId: string;
  country: string;
  oneTimeToken: string;
  amount: {
    currency: string;
    value: number;
  };
  checkoutSession: {
    session: string;
  }
  customerPayer: {
    id: string;
  }
}

export const createPayment = async (params: CreatePaymentParams): Promise<
  { success: true; data: YunoPaymentResponse } | { success: false; error: string }
> => {
  try {
    validateYunoConfig();

    // Simulate payment decline 20% of the time for testing
    const shouldDecline = Math.random() < 0.2;
    const paymentDescription = shouldDecline ? 'DECLINED' : `Payment for order ${params.merchantOrderId}`;
    
    if (shouldDecline) {
      console.log('🔴 Simulating payment decline for testing purposes');
    }
    
    const requestBody = {
      description: paymentDescription,
      account_id: yunoConfig.accountId,
      country: params.country,
      amount: params.amount,
      checkout: params.checkoutSession,
      customer_payer: params.customerPayer,
      merchant_order_id: params.merchantOrderId,
      payment_method : {
        token: params.oneTimeToken
      }
    };

    console.log('Creating payment');

    const response = await fetch(`${yunoConfig.baseUrl}/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'public-api-key': yunoConfig.apiKey,
        'private-secret-key': yunoConfig.secretKey,
        'x-idempotency-key': uuidv4(),
      },
      body: JSON.stringify(requestBody),
    });

    

    if (!response.ok) {
      let errorMessage = `Yuno Payment API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData: YunoErrorResponse = await response.json();
        errorMessage = `Yuno Payment API Error: ${errorData.messages?.[0] || response.statusText}`;
      } catch (jsonError) {
        try {
          const errorText = await response.text();
          errorMessage = `Yuno Payment API Error: ${errorText || response.statusText}`;
        } catch (textError) {
          console.error('Failed to parse error response:', textError);
        }
      }
      throw new Error(errorMessage);
    }

    const payment: YunoPaymentResponse = await response.json();
    console.log('Payment response status:', response.status);
    console.log('Payment x-trace-id:', response.headers.get('x-trace-id'));
    console.log('Payment id:', payment.id);
    console.log('payment status:', payment.status);

    return {
      success: true,
      data: payment,
    } as const;
  } catch (error) {
    console.error('Error creating payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment',
    };
  }
};
