'use client';

import { createPayment, getYunoConfig } from '@/actions';
import { loadScript } from '@yuno-payments/sdk-web';
import { useEffect, useState } from 'react';






interface YunoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutSession: string;
  paymentAmount: number;
  paymentCurrency: string;
  customerPayerId: string;
  merchantOrderId: string;
  country: string;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: any) => void;
}

export const YunoPaymentModal = ({
  isOpen,
  onClose,
  checkoutSession,
  paymentAmount,
  paymentCurrency,
  customerPayerId,
  merchantOrderId,
  country,
  onPaymentSuccess,
  onPaymentError
}: YunoPaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const loadYunoScript = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get Yuno config
      const configResult = await getYunoConfig();
      if (!configResult.success || !configResult.data) {
        throw new Error(configResult.error || 'Failed to get Yuno config');
      }

      const { apiKey } = configResult.data;

      // Load and initialize Yuno SDK
      const yuno = await loadScript();
      const yunoInstance = await yuno.initialize(apiKey);

      // Start checkout
      await yunoInstance.startCheckout({
        card: {
            type: "step",
          },
        checkoutSession: checkoutSession,
        language: 'en',
        countryCode: 'US',
        elementSelector: '#yuno-checkout-container',
        yunoCreatePayment: async (ott, paymentInfo) => {
          const paymentResult = await createPayment({
            description: merchantOrderId,
            merchantOrderId: merchantOrderId,
            country: country,
            amount: {
              currency: paymentCurrency,
              value: paymentAmount,
            },
            checkoutSession: {
              session: checkoutSession,
            },
            customerPayer: {
              id: customerPayerId,
            },
            oneTimeToken: ott,
          });
          onPaymentSuccess?.(paymentResult);
          onClose();
        },
      });

      // Mount checkout
      yunoInstance.mountCheckout();

      // Store yunoInstance globally so our custom button can access it
      (window as any).yunoInstance = yunoInstance;

    } catch (error) {
      console.error('Error loading Yuno script:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load payment system';
      setError(errorMessage);
      onPaymentError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayClick = async () => {
    try {
      setIsPaymentLoading(true);
      
      // Get the yunoInstance from window
      const yunoInstance = (window as any).yunoInstance;
      
      if (!yunoInstance) {
        throw new Error('Payment system not initialized');
      }

      console.log('Starting payment process...');
      await yunoInstance.startPayment();
      
    } catch (error) {
      console.error('Error processing payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      onPaymentError?.(error);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && checkoutSession) {
      loadYunoScript();
    }
  }, [isOpen, checkoutSession]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-in fade-in duration-300 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300 pointer-events-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Complete Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading payment system...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="text-red-800">
                  <h3 className="text-sm font-medium">Payment Error</h3>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="mt-3 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>
          )}

          {/* Yuno SDK Container */}
          <div id="yuno-checkout-container" className="min-h-[200px]"></div>
          
          {/* Custom Pay Button */}
          {!isLoading && !error && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handlePayClick}
                disabled={isPaymentLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                  isPaymentLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                {isPaymentLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </div>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
