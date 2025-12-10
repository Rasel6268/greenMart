import Home from '@/components/Home';
import React from 'react';

export const metadata = {
  title: "Home",
  description: "Discover the latest products, discounts and top sellers",
  openGraph: {
    title: "Home",
    description: "Discover the latest products, discounts and top sellers",
    url: "https://greenstorebd.com",
    type: "website",
  },
};

const page = () => {
  return <Home></Home>
};

export default page;