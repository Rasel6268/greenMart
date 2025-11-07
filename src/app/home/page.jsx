
import React from 'react';
import { FaStar } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";



export const metadata = {
  title: 'Home page'
}

const page = () => {

  return (

    <section>
    {/* banner section */}
<div className="bg-gray-200 p-10">
  <div className="flex gap-5 items-start">
    
    {/* sidebar (height increased) */}
    <div className="bg-white rounded-xl shadow-md p-6 w-72 h-[730px]">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Categories</h2>

      <ul className="space-y-3">

        <li>
          <a href="#mobile-accessories"
            className="flex justify-between items-center bg-green-600 text-white rounded-full px-4 py-2 cursor-pointer shadow-md hover:bg-green-700 transition">
            <span>Mobile Accessories</span>
            <span className="bg-white text-green-600 text-sm font-semibold rounded-full px-2 py-0.5">10</span>
          </a>
        </li>

        <li>
          <a href="/women-fashion"
            className="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer transition">
            <span>Women's Fashion</span>
            <span className="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">200</span>
          </a>
        </li>

        <li>
          <a href="/men-fashion"
            className="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer transition">
            <span>Men's Fashion</span>
            <span className="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">100</span>
          </a>
        </li>

        <li>
          <a href="/smart-watch"
            className="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer transition">
            <span>Smart Watch</span>
            <span className="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">150</span>
          </a>
        </li>

        <li>
          <a href="/sports"
            className="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer transition">
            <span>Sports</span>
            <span className="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">80</span>
          </a>
        </li>

        <li>
          <a href="/travel"
            className="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer transition">
            <span>Travel</span>
            <span className="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">30</span>
          </a>
        </li>

        <li>
          <a href="/toys"
            className="flex justify-between items-center bg-white text-gray-700 rounded-full px-4 py-2 shadow hover:bg-green-100 cursor-pointer transition">
            <span>Toys</span>
            <span className="bg-green-600 text-white text-sm font-semibold rounded-full px-2 py-0.5">100</span>
          </a>
        </li>

      </ul>

    </div>

    {/* Banner Image */}
    <div className="flex-1">
      <img
        src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=800&q=80"
        alt="Shopping experience"
        className="rounded-xl shadow-lg w-full h-[460px]"
      />

      {/* --- Trusted Brands & Top Categories Section --- */}
      <div className="flex justify-between gap-6 mt-5">

        {/* Trusted Brands */}
        <div className="bg-white w-1/2 h-[250px] rounded-xl shadow-xl">
          <h1 className="text-2xl text-gray-500 font-semibold p-5">Trusted Brands</h1>
          <div className="grid grid-cols-4 gap-2 pl-3">
            <img src="/download.png" className="w-16 h-16" />
            <img src="/chanel-removebg-preview.png" className="w-16 h-16" />
            <img src="/dior-removebg-preview.png" className="w-16 h-16" />
            <img src="/images-removebg-preview.png" className="w-20 h-20" />
            <img src="/puma-removebg-preview.png" className="w-20 h-20" />
            <img src="/lg-removebg-preview.png" className="w-20 h-20" />
            <img src="/images__1_-removebg-preview.png" className="w-[130px]" />
            <img src="/puma-removebg-preview.png" className="w-20 h-20" />
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white w-1/2 h-[250px] rounded-xl shadow-xl">
          <div className="flex justify-between px-5 pt-5">
            <h1 className="text-2xl text-gray-500 font-semibold">Top Categories</h1>
            <div className="flex items-center text-gray-500 gap-1">
              <a href="/#">view all</a>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-5 p-6">
            <div className="text-center">
              <img src="/toy_house-removebg-preview.png" className="w-20 h-20 mx-auto" />
              <p className="text-gray-500 text-sm mt-2">Toy house</p>
            </div>
            <div className="text-center">
              <img src="/speaker-removebg-preview.png" className="w-20 h-20 mx-auto" />
              <p className="text-gray-500 text-sm mt-2">Speaker</p>
            </div>
            <div className="text-center">
              <img src="/watch1.png" className="w-20 h-20 mx-auto" />
              <p className="text-gray-500 text-sm mt-2">Watch</p>
            </div>
            <div className="text-center">
              <img src="/toy_house-removebg-preview.png" className="w-20 h-20 mx-auto" />
              <p className="text-gray-500 text-sm mt-2">Toy house</p>
            </div>
            <div className="text-center">
              <img src="/speaker-removebg-preview.png" className="w-20 h-20 mx-auto" />
              <p className="text-gray-500 text-sm mt-2">Speaker</p>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</div>

      {/* best selling products */}
    <div className="relative py-10 ">

  {/* Left Arrow */}
  <button className="absolute left-0 top-96 -translate-y-1/2 bg-white shadow-md border text-gray-600 hover:text-green-600 hover:border-green-600 p-3 rounded-full">
    <FaChevronLeft />
  </button>

  <div className=' bg-white '>
        <h2 className='text-gray-600 text-3xl font-semibold text-center py-10'> Best Selling Products</h2>
        <div className='grid grid-cols-4 gap-5 py-10 container mx-auto'>
          {/* cart 1 */}
      
<div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">

  {/* Wrap card body with Link */}
  <Link href="/product-details" className="block">
    <img
      src="/watch1.png"
      alt="Product"
      className="w-full h-40 object-cover"
    />

    <div className="p-4 cursor-pointer">
      {/* Product Title */}
      <div className='flex justify-between items-center'>
        <h2 className="text-lg font-semibold text-gray-700">Black Leather Watch</h2>
        <p className='text-green-500 text-xl'><FaRegHeart /></p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mt-1">
        Fresh and organic apples directly from the farm.
      </p>

      {/* Price Section */}
      <div className="mt-3">
        <span className="text-xl font-bold text-green-600">$4.99</span>
        <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
      </div>

      {/* Star Rating */}
      <div className='flex gap-2 mt-1'>
        <FaStar className='text-yellow-400' />
        <FaStar className='text-yellow-400' />
        <FaStar className='text-yellow-400' />
      </div>

    </div>
  </Link>



</div>
          {/* cart 2 */}
         <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">

  {/* Wrap card body with Link */}
  <Link href="/product-details" className="block">
    <img
      src="/watch1.png"
      alt="Product"
      className="w-full h-40 object-cover"
    />

    <div className="p-4 cursor-pointer">
      {/* Product Title */}
      <div className='flex justify-between items-center'>
        <h2 className="text-lg font-semibold text-gray-700">Black Leather Watch</h2>
        <p className='text-green-500 text-xl'><FaRegHeart /></p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mt-1">
        Fresh and organic apples directly from the farm.
      </p>

      {/* Price Section */}
      <div className="mt-3">
        <span className="text-xl font-bold text-green-600">$4.99</span>
        <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
      </div>

      {/* Star Rating */}
      <div className='flex gap-2 mt-1'>
        <FaStar className='text-yellow-400' />
        <FaStar className='text-yellow-400' />
        <FaStar className='text-yellow-400' />
      </div>

    </div>
  </Link>



</div>
          {/*  cart 3 */}
        <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">

  {/* Wrap card body with Link */}
  <Link href="/product-details" className="block">
    <img
      src="/watch1.png"
      alt="Product"
      className="w-full h-40 object-cover"
    />

    <div className="p-4 cursor-pointer">
      {/* Product Title */}
      <div className='flex justify-between items-center'>
        <h2 className="text-lg font-semibold text-gray-700">Black Leather Watch</h2>
        <p className='text-green-500 text-xl'><FaRegHeart /></p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mt-1">
        Fresh and organic apples directly from the farm.
      </p>

      {/* Price Section */}
      <div className="mt-3">
        <span className="text-xl font-bold text-green-600">$4.99</span>
        <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
      </div>

      {/* Star Rating */}
      <div className='flex gap-2 mt-1'>
        <FaStar className='text-yellow-400' />
        <FaStar className='text-yellow-400' />
        <FaStar className='text-yellow-400' />
      </div>

    </div>
  </Link>



</div>
          {/* cart 4 */}
         <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">

  {/* Wrap card body with Link */}
  <Link href="/product-details" className="block">
    <img
      src="/watch1.png"
      alt="Product"
      className="w-full h-40 object-cover"
    />

    <div className="p-4 cursor-pointer">
      {/* Product Title */}
      <div className='flex justify-between items-center'>
        <h2 className="text-lg font-semibold text-gray-700">Black Leather Watch</h2>
        <p className='text-green-500 text-xl'><FaRegHeart /></p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mt-1">
        Fresh and organic apples directly from the farm.
      </p>

      {/* Price Section */}
      <div className="mt-3">
        <span className="text-xl font-bold text-green-600">$4.99</span>
        <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
      </div>

      {/* Star Rating */}
      <div className='flex gap-2 mt-1'>
        <FaStar className='text-yellow-400' />
        <FaStar className='text-yellow-400' />
        <FaStar className='text-yellow-400' />
      </div>

    </div>
  </Link>

 

</div>

        </div>
      </div>

  {/* Right Arrow */}
  <button className="absolute right-0 top-96 -translate-y-1/2 bg-white shadow-md border text-gray-600 hover:text-green-600 hover:border-green-600 p-3 rounded-full">
    <FaChevronRight />
  </button>

</div>

      {/* new arrivals */}

      <div>
        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* Heading */}
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-700 mb-6">
            <span className="w-2 h-6 bg-green-600 rounded-sm"></span>
            New Arrivals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Big PS5 Card */}
            <div className="bg-gray-300 p-6 rounded-lg flex flex-col justify-between">
              <img
                src="/ps5.png"
                alt="Play Station 5"
                className=" object-contain"
              />

              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-800">Play Station5</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Black and White version of the PS5 coming out on sale.
                </p>
                <a href="#">
                  <button className="mt-3 text-sm font-medium text-gray-700 hover:underline cursor-pointer">
                    Shop Now
                  </button>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">

              {/* Women Fashion Card */}
              <div className="bg-black p-6 rounded-lg relative h-72">
                <img
                  src="/women.jpg"
                  alt=""
                  className="absolute right-10 top-0 h-full   object-cover opacity-80"
                />
                <div className="relative  max-w-[140px] top-28   ">
                  <h3 className="text-lg font-semibold text-white">Women Fashion</h3>
                  <p className="text-gray-100 text-sm mt-1">
                    Featured woman collections that give you another vibe.
                  </p>
                  <a href="#">
                    <button className="mt-3 text-sm font-medium text-white hover:underline cursor-pointer">
                      Shop Now
                    </button>
                  </a>

                </div>
              </div>

              {/* Speaker Card 1 */}
              <div className='flex  gap-10'>
                <div className="bg-gray-300 p-4 rounded-lg">
                  <img
                    src="/speaker-removebg-preview.png"
                    alt="Speaker"
                    className="w-full h-48 object-contain"
                  />
                  <h3 className="mt-2 font-semibold text-gray-800">Speaker</h3>
                  <p className="text-gray-600 text-sm">amazon wireless speakers</p>
                  <a href="#">
                    <button className="mt-3 text-sm font-medium text-gray-700 hover:underline cursor-pointer">
                      Shop Now
                    </button>
                  </a>
                </div>
                <div className="bg-gray-300 p-4 rounded-lg">
                  <img
                    src="/speaker-removebg-preview.png"
                    alt="Speaker"
                    className="w-full h-48 object-contain"
                  />
                  <h3 className="mt-2 font-semibold text-gray-800">Speaker</h3>
                  <p className="text-gray-600 text-sm">amazon wireless speakers</p>
                  <a href="#">
                    <button className="mt-3 text-sm font-medium text-gray-700 hover:underline cursor-pointer">
                      Shop Now
                    </button>
                  </a>
                </div>
              </div>

            </div>



          </div>
        </div>
      </div>
      {/* top sells and top ratings */}
      <div className='container mx-auto'>
        <div className='flex  gap-5 my-10'>
          <a
            href="#"
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition"
          >
            Best Sells
          </a>

          <a
            href="#"
            className="bg-white text-green-500 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition"
          >
            Top Ratings
          </a>

        </div>
        <div className='grid grid-cols-4 gap-10 my-10 '>
          {/* cart-1 */}
          <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <div className="relative">
              <img
                src="/watch1.png"
                alt="Product"
                className="w-full h-40 object-cover"
              />
              {/* Badge */}
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                SALE
              </span>
            </div>

            <div className="p-4">
              {/* Product Title */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mt-1">
                Fresh and organic apples directly from the farm.
              </p>

              {/* Price Section */}
              <div className="mt-3">
                <span className="text-xl font-bold text-green-600">$4.99</span>
                <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
              </div>

              {/* Star */}
              <div className="flex gap-2 mt-2">
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
              </div>

              {/* Two Buttons */}
              <div className="flex gap-2 mt-4">
                <a
                  href="#"
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
                >
                  Add to cart
                </a>

                <a
                  href="#"
                  className="flex-1 text-center bg-white text-green-600 border border-green-600 py-2 rounded-md font-medium hover:bg-green-50 transition"
                >
                  Wishlist
                </a>
              </div>
            </div>
          </div>
          {/* cart 2 */}
          <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <div className="relative">
              <img
                src="/watch1.png"
                alt="Product"
                className="w-full h-40 object-cover"
              />
              {/* Badge */}
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                HOT
              </span>
            </div>

            <div className="p-4">
              {/* Product Title */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mt-1">
                Fresh and organic apples directly from the farm.
              </p>

              {/* Price Section */}
              <div className="mt-3">
                <span className="text-xl font-bold text-green-600">$4.99</span>
                <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
              </div>

              {/* Star */}
              <div className="flex gap-2 mt-2">
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
              </div>

              {/* Two Buttons */}
              <div className="flex gap-2 mt-4">
                <a
                  href="#"
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
                >
                  Add to cart
                </a>

                <a
                  href="#"
                  className="flex-1 text-center bg-white text-green-600 border border-green-600 py-2 rounded-md font-medium hover:bg-green-50 transition"
                >
                  Wishlist
                </a>
              </div>
            </div>
          </div>
          {/* cart3 */}
          <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <div className="relative">
              <img
                src="/watch1.png"
                alt="Product"
                className="w-full h-40 object-cover"
              />
              {/* Badge */}
              <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                New
              </span>
            </div>

            <div className="p-4">
              {/* Product Title */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mt-1">
                Fresh and organic apples directly from the farm.
              </p>

              {/* Price Section */}
              <div className="mt-3">
                <span className="text-xl font-bold text-green-600">$4.99</span>
                <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
              </div>

              {/* Star */}
              <div className="flex gap-2 mt-2">
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
              </div>

              {/* Two Buttons */}
              <div className="flex gap-2 mt-4">
                <a
                  href="#"
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
                >
                  Add to cart
                </a>

                <a
                  href="#"
                  className="flex-1 text-center bg-white text-green-600 border border-green-600 py-2 rounded-md font-medium hover:bg-green-50 transition"
                >
                  Wishlist
                </a>
              </div>
            </div>
          </div>
          {/* cart4 */}
          <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <div className="relative">
              <img
                src="/watch1.png"
                alt="Product"
                className="w-full h-40 object-cover"
              />
              {/* Badge */}
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                HOT
              </span>
            </div>

            <div className="p-4">
              {/* Product Title */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mt-1">
                Fresh and organic apples directly from the farm.
              </p>

              {/* Price Section */}
              <div className="mt-3">
                <span className="text-xl font-bold text-green-600">$4.99</span>
                <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
              </div>

              {/* Star */}
              <div className="flex gap-2 mt-2">
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
              </div>

              {/* Two Buttons */}
              <div className="flex gap-2 mt-4">
                <a
                  href="#"
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
                >
                  Add to cart
                </a>

                <a
                  href="#"
                  className="flex-1 text-center bg-white text-green-600 border border-green-600 py-2 rounded-md font-medium hover:bg-green-50 transition"
                >
                  Wishlist
                </a>
              </div>
            </div>
          </div>
           {/* cart-1 */}
          <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <div className="relative">
              <img
                src="/watch1.png"
                alt="Product"
                className="w-full h-40 object-cover"
              />
              {/* Badge */}
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                SALE
              </span>
            </div>

            <div className="p-4">
              {/* Product Title */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mt-1">
                Fresh and organic apples directly from the farm.
              </p>

              {/* Price Section */}
              <div className="mt-3">
                <span className="text-xl font-bold text-green-600">$4.99</span>
                <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
              </div>

              {/* Star */}
              <div className="flex gap-2 mt-2">
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
              </div>

              {/* Two Buttons */}
              <div className="flex gap-2 mt-4">
                <a
                  href="#"
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
                >
                  Add to cart
                </a>

                <a
                  href="#"
                  className="flex-1 text-center bg-white text-green-600 border border-green-600 py-2 rounded-md font-medium hover:bg-green-50 transition"
                >
                  Wishlist
                </a>
              </div>
            </div>
          </div>
          {/* cart 2 */}
          <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <div className="relative">
              <img
                src="/watch1.png"
                alt="Product"
                className="w-full h-40 object-cover"
              />
              {/* Badge */}
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                HOT
              </span>
            </div>

            <div className="p-4">
              {/* Product Title */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mt-1">
                Fresh and organic apples directly from the farm.
              </p>

              {/* Price Section */}
              <div className="mt-3">
                <span className="text-xl font-bold text-green-600">$4.99</span>
                <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
              </div>

              {/* Star */}
              <div className="flex gap-2 mt-2">
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
              </div>

              {/* Two Buttons */}
              <div className="flex gap-2 mt-4">
                <a
                  href="#"
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
                >
                  Add to cart
                </a>

                <a
                  href="#"
                  className="flex-1 text-center bg-white text-green-600 border border-green-600 py-2 rounded-md font-medium hover:bg-green-50 transition"
                >
                  Wishlist
                </a>
              </div>
            </div>
          </div>
          {/* cart3 */}
          <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <div className="relative">
              <img
                src="/watch1.png"
                alt="Product"
                className="w-full h-40 object-cover"
              />
              {/* Badge */}
              <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                New
              </span>
            </div>

            <div className="p-4">
              {/* Product Title */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mt-1">
                Fresh and organic apples directly from the farm.
              </p>

              {/* Price Section */}
              <div className="mt-3">
                <span className="text-xl font-bold text-green-600">$4.99</span>
                <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
              </div>

              {/* Star */}
              <div className="flex gap-2 mt-2">
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
              </div>

              {/* Two Buttons */}
              <div className="flex gap-2 mt-4">
                <a
                  href="#"
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
                >
                  Add to cart
                </a>

                <a
                  href="#"
                  className="flex-1 text-center bg-white text-green-600 border border-green-600 py-2 rounded-md font-medium hover:bg-green-50 transition"
                >
                  Wishlist
                </a>
              </div>
            </div>
          </div>
          {/* cart4 */}
          <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <div className="relative">
              <img
                src="/watch1.png"
                alt="Product"
                className="w-full h-40 object-cover"
              />
              {/* Badge */}
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                HOT
              </span>
            </div>

            <div className="p-4">
              {/* Product Title */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mt-1">
                Fresh and organic apples directly from the farm.
              </p>

              {/* Price Section */}
              <div className="mt-3">
                <span className="text-xl font-bold text-green-600">$4.99</span>
                <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
              </div>

              {/* Star */}
              <div className="flex gap-2 mt-2">
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
                <p className="text-yellow-400"><FaStar /></p>
              </div>

              {/* Two Buttons */}
              <div className="flex gap-2 mt-4">
                <a
                  href="#"
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
                >
                  Add to cart
                </a>

                <a
                  href="#"
                  className="flex-1 text-center bg-white text-green-600 border border-green-600 py-2 rounded-md font-medium hover:bg-green-50 transition"
                >
                  Wishlist
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* 20% off */}
      <div className='container mx-auto'>
        <div className='flex justify-between'>
          <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-700 mb-6">
            <span className="w-2 h-6 bg-green-600 rounded-sm"></span>
            20 % off
          </h2>
          <div className='flex justify-center items-center text-green-500'>

            <a href="/discount-product">view all</a>
            <FaAngleRight />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-6 py-10 cursor-pointer">
          {/* cart 1 */}
          <a href="/#" className="block">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">

              {/* Image + Badge */}
              <div className="relative">
                <img
                  src="/watch1.png"
                  alt="Product"
                  className="w-full h-28 object-cover"  // Smaller height
                />

                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                  59%
                </span>
              </div>

              <div className="p-3"> {/* Reduced padding */}

                {/* Product Title */}
                <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
                  <p className="text-green-500 text-lg"><FaRegHeart /></p>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Fresh and organic apples directly from the farm.
                </p>

                {/* Price Section */}
                <div className="mt-2">
                  <span className="text-base font-bold text-green-600">$4.99</span>
                  <span className="text-xs line-through text-gray-500 ml-2">$6.99</span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 text-yellow-400 text-sm mt-1">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>

              </div>
            </div>
          </a>

          {/*  cart 2 */}
          <a href="/#" className="block">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">

              {/* Image + Badge */}
              <div className="relative">
                <img
                  src="/watch1.png"
                  alt="Product"
                  className="w-full h-28 object-cover"  // Smaller height
                />

                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                  59%
                </span>
              </div>

              <div className="p-3"> {/* Reduced padding */}

                {/* Product Title */}
                <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
                  <p className="text-green-500 text-lg"><FaRegHeart /></p>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Fresh and organic apples directly from the farm.
                </p>

                {/* Price Section */}
                <div className="mt-2">
                  <span className="text-base font-bold text-green-600">$4.99</span>
                  <span className="text-xs line-through text-gray-500 ml-2">$6.99</span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 text-yellow-400 text-sm mt-1">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>

              </div>
            </div>
          </a>
          {/*cart3  */}
          <a href="/#" className="block">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">

              {/* Image + Badge */}
              <div className="relative">
                <img
                  src="/watch1.png"
                  alt="Product"
                  className="w-full h-28 object-cover"  // Smaller height
                />

                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                  59%
                </span>
              </div>

              <div className="p-3"> {/* Reduced padding */}

                {/* Product Title */}
                <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
                  <p className="text-green-500 text-lg"><FaRegHeart /></p>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Fresh and organic apples directly from the farm.
                </p>

                {/* Price Section */}
                <div className="mt-2">
                  <span className="text-base font-bold text-green-600">$4.99</span>
                  <span className="text-xs line-through text-gray-500 ml-2">$6.99</span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 text-yellow-400 text-sm mt-1">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>

              </div>
            </div>
          </a>
          {/* cart 4 */}
          <a href="/#" className="block">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">

              {/* Image + Badge */}
              <div className="relative">
                <img
                  src="/watch1.png"
                  alt="Product"
                  className="w-full h-28 object-cover"  // Smaller height
                />

                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                  59%
                </span>
              </div>

              <div className="p-3"> {/* Reduced padding */}

                {/* Product Title */}
                <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
                  <p className="text-green-500 text-lg"><FaRegHeart /></p>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Fresh and organic apples directly from the farm.
                </p>

                {/* Price Section */}
                <div className="mt-2">
                  <span className="text-base font-bold text-green-600">$4.99</span>
                  <span className="text-xs line-through text-gray-500 ml-2">$6.99</span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 text-yellow-400 text-sm mt-1">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>

              </div>
            </div>
          </a>
          {/* cart5 */}
          <a href="/#" className="block">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">

              {/* Image + Badge */}
              <div className="relative">
                <img
                  src="/watch1.png"
                  alt="Product"
                  className="w-full h-28 object-cover"  // Smaller height
                />

                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                  59%
                </span>
              </div>

              <div className="p-3"> {/* Reduced padding */}

                {/* Product Title */}
                <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Black Learher Watch</h2>
                  <p className="text-green-500 text-lg"><FaRegHeart /></p>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Fresh and organic apples directly from the farm.
                </p>

                {/* Price Section */}
                <div className="mt-2">
                  <span className="text-base font-bold text-green-600">$4.99</span>
                  <span className="text-xs line-through text-gray-500 ml-2">$6.99</span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 text-yellow-400 text-sm mt-1">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>

              </div>
            </div>
          </a>

        </div>


      </div>

    </section>



  );
};

export default page;
