import { ProductGrid } from "@/components/products/product-grid/ProductGrid";
import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";
import { Category } from "@/interfaces";


const productsData = initialData.products;

interface Props {
    params: {
        id: Category;
    }
}

export default function({ params }: Props) {

    const { id } = params;

    const products = productsData.filter((product) => product.gender === id);
    const lables: Record<Category, string> = {
        'men': 'Men',
        'women': 'Women',
        'kid': 'Kids',
        'unisex': 'All',
    }

    if (id === "men") {
        notFound();
    }
    
    return (
        <div>
            <Title title = {`${lables[id]} Products`} subtitle = "All Products" />
            <ProductGrid products={products} />
        </div>
    );
}