import React from 'react';

export const metadata = {
    title:'Home page'
}

const page = () => {
    
    return (
       <section class="bg-gray-200 flex justify-center items-center min-h-screen">

    <div class="bg-white rounded-xl shadow-md p-6 w-72">
      <h2 class="text-2xl font-semibold text-gray-700 mb-6 text-center">Categories</h2>

      <ul class="space-y-3">
  
        <li class="flex justify-between items-center bg-green-600 text-white rounded-full px-4 py-2 cursor-pointer shadow-md">
          <span>Mobile Accessories</span>
          <span class="bg-white text-green-600 text-sm font-semibold rounded-full px-2 py-0.5">10</span>
        </li>

    
        <li class="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer">
          <span>Women’s Fashion</span>
          <span class="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">200</span>
        </li>

        <li class="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer">
          <span>Men’s Fashion</span>
          <span class="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">100</span>
        </li>

        <li class="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer">
          <span>Smart Watch</span>
          <span class="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">150</span>
        </li>

        <li class="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer">
          <span>Sports</span>
          <span class="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">80</span>
        </li>

        <li class="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer">
          <span>Travel</span>
          <span class="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">30</span>
        </li>

        <li class="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer">
          <span>Toys</span>
          <span class="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">100</span>
        </li>
      </ul>
    </div>
       </section>
    );
};

export default page;