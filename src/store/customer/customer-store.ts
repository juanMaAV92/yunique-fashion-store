import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
}

interface State {
  customer: CustomerData | null;
  yunoCustomerId: string | null;
  
  setCustomer: (customer: CustomerData) => void;
  setYunoCustomerId: (id: string) => void;
  clearCustomer: () => void;
  hasCustomer: () => boolean;
}

export const useCustomerStore = create<State>()(
  persist(
    (set, get) => ({
      customer: null,
      yunoCustomerId: null,

      setCustomer: (customer: CustomerData) => {
        set({ customer });
      },

      setYunoCustomerId: (id: string) => {
        set({ yunoCustomerId: id });
      },

      clearCustomer: () => {
        set({ customer: null, yunoCustomerId: null });
      },

      hasCustomer: () => {
        const { customer } = get();
        return customer !== null && 
               customer.firstName.trim() !== '' && 
               customer.email.trim() !== '';
      },
    }),
    {
      name: 'customer-data',
    }
  )
);
