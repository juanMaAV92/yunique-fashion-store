import { titleFont } from "@/config/fonts";
import Link from "next/link";
import Image from "next/image";

export const PageNotFound = () => {
    return (
        <div className = "flex flex-col-reverse md:flex-row h-[800px] w-full justify-center items-center align-middle">
            <div className = "text-center px-5 mx-5">
                <h2 className = {`${titleFont.className} antialiased text-9xl font-bold`}>404</h2>
                <h3 className = {`${titleFont.className} antialiased text-2xl font-bold`}>Page Not Found</h3>
                <p className = "text-gray-500">Whoops! The page you are looking for does not exist.</p>
                <Link href = "/" className = "font-normal hover:underline transition-all">Go to Home</Link>

            </div>
            <div className = "px-5 mx-5">
                <Image src = "/imgs/yunique_store.png" alt = "Yunique Store" width = {700} height = {700} />
            </div>
        </div>
    )
}