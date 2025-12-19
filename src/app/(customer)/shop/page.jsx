import Shop from '@/components/Shop';
import React, { Suspense } from 'react';

export const metadata = {
  title: 'Shop',
  description: 'Browse and shop from our wide range of products',
  openGraph: {
    title: 'Shop',
    description: 'Browse and shop from our wide range of products',
    url: 'https://greenstorebd.com/shop',
    type: 'website',
  },
};

const ShopPage = () => {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <Shop />
    </Suspense>
  );
};

export default ShopPage;