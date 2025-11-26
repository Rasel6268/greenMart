import ProductDetails from '@/components/user/ProductDetails';
import React from 'react';

const page = async({params}) => {
    const resolvedParams = await params; 
  return <ProductDetails id={resolvedParams?.id}></ProductDetails>;
};

export default page;