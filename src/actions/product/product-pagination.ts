'use server';

import { Gender } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;
    if (isNaN(Number(take))) take = 12;
    if (take < 1) take = 12;

    const products = await prisma.product.findMany({
      skip: (page - 1) * take,
      take: take,
      include: {
        productImages: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: {
        gender: gender,
      },
    });

    const totalCount = await prisma.product.count({
      where: {
        gender: gender,
      },
    });
    const totalPages = Math.ceil(totalCount / take);

    return {
      products: products.map(product => ({
        ...product,
        images: product.productImages.map(image => image.url),
      })),
      currentPage: page,
      totalPages: totalPages,
    };
  } catch (error) {
    throw new Error('Product pagination failed');
  }
};
