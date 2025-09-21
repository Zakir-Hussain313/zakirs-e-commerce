import axios from 'axios';
import React from 'react'
import ProductDetails from './ProductDetails';

const ProductPage = async ({ params, searchParams }) => {

    const { slug } = await params;
    const { color, size } = await searchParams;

    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;

    if (color && size) {
        url += `?size=${size}&color=${color}`
    }

    const { data: getProduct } = await axios.get(url);
    if (!getProduct.success) {
        return (
            <div className='py-10 flex justify-center items-center h-[300px]'>
                <h1 className="font-semibold text-4xl">Data Not Found.</h1>
            </div>
        )
    }
    else {
        return (
            <ProductDetails
                product={getProduct?.data?.product}
                varient={getProduct?.data?.varient}
                size={getProduct?.data?.size}
                color={getProduct?.data?.color}
                reviewCount={getProduct?.data?.reviewCount}
            />
        )
    }
}

export default ProductPage
