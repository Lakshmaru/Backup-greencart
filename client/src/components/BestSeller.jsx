import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  // 💡 Use default fallback so it's never undefined
  const { products = [] } = useAppContext();

  // ensure you're working with a real array
  const safeProducts = Array.isArray(products) ? products : [];

  // only include in‑stock items
  const inStock = safeProducts.filter(p => p.inStock);

  if (inStock.length === 0) {
    return (
      <div className="mt-16">
        <p className="text-2xl font-medium md:text-3xl">
          Best Sellers
        </p>
        <p className="mt-4 text-gray-500">
          No products available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <p className="text-2xl font-medium md:text-3xl">Best Sellers</p>
      <div className="grid grid-cols-2 gap-3 mt-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {inStock.slice(0, 5).map((product, idx) => (
          <ProductCard key={product._id ?? idx} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;






















