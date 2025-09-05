'use server';

import { prisma } from '@/lib/prisma';

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      include: {
        productImages: {
          select: {
            url: true,
          },
        },
      },
      where: { slug },
    });

    if (!product) return null;

    const { productImages, ...rest } = product;
    return {
      ...rest,
      images: product.productImages.map(image => image.url),
    };
  } catch (error) {
    throw new Error('Failed to get product by slug');
  }
};
