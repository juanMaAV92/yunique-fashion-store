import { CartProduct } from '@/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  cart: CartProduct[];

  getTotalItems: () => number;

  getSummaryInformation: () => {
    subtotal: number;
    taxes: number;
    total: number;
    itemsInCart: number;
  };

  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProductFromCart: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((acc, item) => acc + item.quantity, 0);
      },

      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        const productInCart = cart.some(
          item => item.id === product.id && item.size === product.size
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        const updatedCartProduct = cart.map(item => {
          if (item.id === product.id && item.size === product.size) {
            return {
              ...item,
              quantity: item.quantity + product.quantity,
            };
          }
          return item;
        });

        set({ cart: updatedCartProduct });
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        const updatedCartProduct = cart.map(item => {
          if (item.id === product.id && item.size === product.size) {
            return {
              ...item,
              quantity: quantity,
            };
          }
          return item;
        });
        set({ cart: updatedCartProduct });
      },

      removeProductFromCart: (product: CartProduct) => {
        const { cart } = get();
        set({
          cart: cart.filter(
            item => item.id !== product.id || item.size !== product.size
          ),
        });
      },

      getSummaryInformation: () => {
        const { cart } = get();
        const subtotal = cart.reduce(
          (subtotal, item) => subtotal + item.price * item.quantity,
          0
        );
        const taxes = subtotal * 0.15;
        const total = subtotal + taxes;
        const itemsInCart = cart.reduce(
          (itemsInCart, item) => itemsInCart + item.quantity,
          0
        );
        return {
          subtotal,
          taxes,
          total,
          itemsInCart,
        };
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
);
