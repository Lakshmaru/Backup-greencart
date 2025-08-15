/* eslint-disable no-unused-vars */
/** @jsxImportSource react */

/* src/components/ProductCard.jsx */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

// Utility for consistent currency formatting
function formatCurrency(amount, locale = 'en-US', currencyCode = 'USD') {
  if (amount == null || isNaN(amount)) return '';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const {
    currencyCode = 'USD',
    locale = 'en-US',
    addToCart,
    removeFromCart,
    cartItems,
  } = useAppContext();

  if (!product) return null;

  const handleClickCard = () => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div
      onClick={handleClickCard}
      tabIndex={0}
      className="flex flex-col w-full h-full overflow-hidden bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-0"
      onKeyDown={(e) => e.key === 'Enter' && handleClickCard()}
    >
      {/* Image */}
      <div className="overflow-hidden aspect-3/4 sm:aspect-square group hover:bg-gray-50">
        <img
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          src={product.image?.[0] || assets.placeholder_image}
          alt={product.name || 'Product image'}
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between flex-1 p-3">
        <div>
          <p className="mb-1 uppercase truncate text-gray-500/70">{product.category}</p>
          <h3 className="mb-2 text-base font-medium text-gray-800 truncate">{product.name}</h3>
          <div className="flex items-center gap-1">
            {Array(5).fill(0).map((_, i) => (
              <img
                key={i}
                className="w-3 h-3"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt=""
              />
            ))}
            <span className="text-xs text-gray-400">(4)</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-primary md:text-xl">
              {formatCurrency(product.offerPrice, locale, currencyCode)}
              <span className="ml-1 text-sm line-through text-gray-500/60 md:text-base">
                {formatCurrency(product.price, locale, currencyCode)}
              </span>
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              {!cartItems[product._id] ? (
                <button
                  className="inline-flex items-center gap-1 px-3 py-1 border rounded-md border-primary/50 text-primary focus:outline-none focus:ring-0"
                  onClick={() => addToCart(product._id)}
                >
                  <img src={assets.cart_icon} alt="Cart" className="w-4 h-4" />
                  <span className="text-sm md:text-base">Add</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-md bg-primary/25">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="px-2 py-1 text-base text-primary focus:outline-none focus:ring-0"
                  >
                    –
                  </button>
                  <span className="w-6 text-center">{cartItems[product._id]}</span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="px-2 py-1 text-base text-primary focus:outline-none focus:ring-0"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
