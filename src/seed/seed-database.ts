// npm i -D ts-node 
// npm run seed

import { PrismaClient } from "../generated/prisma";
import { initialData } from "./seed";

const prisma = new PrismaClient();

async function main(){
    
    await prisma.productImage.deleteMany(); 
    await prisma.product.deleteMany(); 
    await prisma.category.deleteMany();

    const {categories, products} = initialData;

    await prisma.category.createMany({
        data: categories.map(category => ({ name: category }))
    });
    
    const categoriesDB = await prisma.category.findMany();
    const categoriesMap = categoriesDB.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id;
        return map;
    }, {} as Record<string, string>);
    

    for (const product of products) {
        const { type, images, ...rest } = product;
        const categoryId = categoriesMap[type];
        
        if (!categoryId) {
            console.warn(`Category "${type}" not found for product "${product.title}"`);
            continue;
        }
        
        const productDB = await prisma.product.create({
            data: {
                ...rest,
                categoryId
            }
        });

        const ImagesData = images.map(image => ({
            url: image,
            productId: productDB.id
        }));

        await prisma.productImage.createMany({
            data: ImagesData
        });
    }

   

    console.log('Database seeded successfully');
}

(() => {
    main();
})()