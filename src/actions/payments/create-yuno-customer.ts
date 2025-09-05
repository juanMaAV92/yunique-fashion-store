'use server';

import { validateYunoConfig, yunoConfig } from '@/lib/yuno';
import type { CustomerData } from '@/store';
import type { YunoCustomerResponse, YunoErrorResponse } from '@/types/yuno';

interface CreateYunoCustomerParams {
  customerData: CustomerData;
  merchantCustomerId: string;
}

// Country code mapping for phone numbers
const countryPhoneCodes: Record<string, string> = {
  'US': '1',
  'CA': '1',
  'MX': '52',
  'CR': '506',
  'GT': '502',
  'PA': '507',
  'CO': '57',
  'AR': '54',
  'BR': '55',
  'CL': '56',
  'PE': '51',
  'ES': '34',
};

export const createYunoCustomer = async ({ 
  customerData, 
  merchantCustomerId 
}: CreateYunoCustomerParams) => {
  try {
    // Validate Yuno configuration
    validateYunoConfig();

    const phoneCountryCode = countryPhoneCodes[customerData.country] || '1';

    // Prepare request body
    const requestBody = {
      merchant_customer_id: merchantCustomerId,
      first_name: customerData.firstName,
      last_name: customerData.lastName,
      email: customerData.email,
      country: customerData.country,
      phone: {
        country_code: phoneCountryCode,
        number: customerData.phone,
      },
    };

    // Make HTTP request to Yuno API
    const response = await fetch(`${yunoConfig.baseUrl}/v1/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'public-api-key': yunoConfig.apiKey,
        'private-secret-key': yunoConfig.secretKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData: YunoErrorResponse = await response.json();
      throw new Error(`Yuno API Error: ${errorData.messages?.[0] || response.statusText}`);
    }

    const customer: YunoCustomerResponse = await response.json();

    return {
      success: true,
      data: customer,
    } as const;
  } catch (error) {
    console.error('Error creating Yuno customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create customer',
    };
  }
};
