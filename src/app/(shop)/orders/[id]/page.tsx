import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Link from "next/link";
import { IoArrowForwardOutline, IoCardOutline } from "react-icons/io5";
import Image from "next/image";
import { notFound } from "next/navigation";
import clsx from "clsx";

const productInCart = initialData.products.slice(0, 2);


interface Props {
    params: {
        id: string;
    }
}

export default function({ params }: Props) {

    const { id } = params;
    const order = id;

    if (!order) {
        notFound();
    }

    return (
        <div className="flex  justify-center items-center mb-72 px-10 sm:px-0">

            <div className="flex flex-col w-[1000px]">

                <Title title={`Order #${id}`} subtitle="Order details" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

                    <div className="flex flex-col mt-5">    
                        <div className = {
                            clsx (
                                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                                {
                                    "bg-red-500": false,
                                    "bg-green-700": true,
                                }
                            )             
                        }>
                           <IoCardOutline size = {30} />
                           <span className = "mx-2"> Pending payment</span>
                           <span className = "mx-2"> Payed</span>
                        </div>
                        {
                            productInCart.map((product) => (
                                <div key={product.slug} className="flex mb-5">
                                    <Image src={`/products/${product.images[0]}`} alt={product.title} width={100} height={100} className="mr-5 rounded"
                                        style={{ width: '100', height: '100px', objectFit: 'contain'}}
                                    />
                                    <div>
                                        <p>{product.title}</p>
                                        <p>${product.price} x 3</p>
                                        <p className="font-bold">Subtotal: ${product.price * 3}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    { /*  Checkout */}
                    <div className=" bg-white rounded-xl shadow-xl p-7">
                        <h2 className="text-2xl mb-2">Delivery Address</h2>
                        <div className="mb-10">
                            <p className="text-2xl">John Doe</p>
                            <p>123 Main St, Anytown, USA</p>
                            <p>12345</p>
                            <p>Anytown</p>
                            <p>USA</p>
                            <p>1234567890</p>
                        </div>

                        <div className='w-full h-0.5 rounded bg-gray-200 mb-10' />
                            

                        <h2 className="text-2xl mb-2">Order Summary</h2>
                        <div className="grid grid-cols-2">
                            <span>No. Products</span>
                            <span className="text-right">3 Articles</span>

                            <span>Subtotal</span>
                            <span className="text-right">$100</span>

                            <span>Taxes</span>
                            <span className="text-right">$100</span>

                            <span className="text-2xl mt-5">Total:</span>
                            <span className="text-2xl mt-5 text-right">$110</span>
                        </div>
                        <div className="mt-5 mb-2 w-full">
                            <div className = {
                                clsx (
                                    "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                                    {
                                        "bg-red-500": false,
                                        "bg-green-700": true,
                                    }
                                )             
                            }>
                            <IoCardOutline size = {30} />
                            <span className = "mx-2"> Pending payment</span>
                            <span className = "mx-2"> Payed</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}