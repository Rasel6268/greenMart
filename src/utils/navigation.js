export const navigateToShopWithFilters = (categoryName) => {
  // You can use Next.js router or window.location
  // Option 1: Using query parameters
  const params = new URLSearchParams();
  if (categoryName) {
    params.set('category', categoryName);
  }
  window.location.href = `/shop?${params.toString()}`;
  
  // Or Option 2: Using state (if you want to use Next.js router)
  // router.push({
  //   pathname: '/shop',
  //   query: { category: categoryName }
  // });
};