'use client';

import { QuantitySelector, SizeSelect } from '@/components';
import { CartProduct, Product, Size } from '@/interfaces';
import { useCartStore } from '@/store';
import { useState } from 'react';

interface Props {
  product: Product;
}

export const AddToCard = ({ product }: Props) => {
  const addProductToCart = useCartStore(state => state.addProductToCart);
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState<boolean>(false);

  const addToCard = () => {
    setPosted(true);

    if (!size) return;

    const productToAdd: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      size: size,
    };

    addProductToCart(productToAdd);
    setPosted(false);
    setSize(undefined);
    setQuantity(1);
  };

  return (
    <>
      {posted && !size && (
        <span className='mt-2 text-red-500 fade-in'>Please select a size</span>
      )}

      <SizeSelect
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChange={setSize}
      />

      <QuantitySelector
        quantity={quantity}
        maxQuantity={product.inStock}
        onQuantityChange={setQuantity}
      />

      <button className='btn-primary my-5' onClick={addToCard}>
        Add to Cart
      </button>
    </>
  );
};
