'use server';

import { validateYunoConfig, yunoConfig } from '@/lib/yuno';
import type { YunoCheckoutSessionResponse, YunoErrorResponse } from '@/types/yuno';

interface CreateCheckoutSessionParams {
  customerId: string;
  merchantOrderId: string;
  paymentDescription: string;
  country: string;
  amount: {
    currency: string;
    value: number;
  };
  callbackUrl?: string;
  metadata?: Array<{
    key: string;
    value: string;
  }>;
}

export const createCheckoutSession = async (params: CreateCheckoutSessionParams) => {
  try {
    // Validate Yuno configuration
    validateYunoConfig();

    // Prepare request body
    const requestBody = {
      account_id: yunoConfig.accountId,
      customer_id: params.customerId,
      merchant_order_id: params.merchantOrderId,
      payment_description: params.paymentDescription,
      country: params.country,
      amount: params.amount,
      // callback_url: params.callbackUrl || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success`,
      metadata: params.metadata || [],
      workflow: 'SDK_CHECKOUT' as const,
    };

    // Make HTTP request to Yuno API
    const response = await fetch(`${yunoConfig.baseUrl}/v1/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'public-api-key': yunoConfig.apiKey,
        'private-secret-key': yunoConfig.secretKey, // In real implementation, use separate keys
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData: YunoErrorResponse = await response.json();
        throw new Error(`Yuno API Error: ${errorData.messages?.[0] || response.statusText}`);
      }
   

    const checkoutSession: YunoCheckoutSessionResponse = await response.json();

    return {
      success: true,
      data: checkoutSession,
    } as const;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session',
    };
  }
};