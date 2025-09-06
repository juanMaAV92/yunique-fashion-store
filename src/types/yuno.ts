// Yuno API Response Types
export interface YunoCustomerResponse {
  id: string;
  merchant_customer_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  country: string | null;
  phone: {
    number: string;
    country_code: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface YunoCheckoutSessionResponse {
  merchant_order_id: string;
  checkout_session: string;
  country: string;
  payment_description: string;
  customer_id: string;
  callback_url: string;
  amount: {
    currency: string;
    value: number;
  };
  created_at: string;
}

export interface YunoErrorResponse {
  code: string;
  messages: string[];
}

export interface YunoPaymentResponse {
  id: string;
  merchant_order_id: string;
  status: string;
  status_detail: string;
  amount: {
    currency: string;
    value: number;
  };
  created_at: string;
  updated_at: string;
  payment_method: {
    type: string;
    vaulted_token?: string;
  };
  customer_payer: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}
