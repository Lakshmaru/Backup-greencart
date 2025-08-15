/* eslint-disable no-undef */
/* eslint-disable no-undef */
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import React from 'react';

const ProductCategory = () => {

  const { products = [], categories = [] } = useAppContext();
  const { category } = useParams();

  if (!categories || categories.length === 0) {
    return <p>Loading categories…</p>;
  }

  // Find the category object whose `path` matches the URL param (case-insensitive)
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category?.toLowerCase()
  );

  if (!searchCategory) {
    return <div><h2 className="mb-4 text-2xl font-bold">Category not found.</h2></div>;
  }

  // Filter: show ALL products whose `.category` matches the `path` (case-insensitive)
  const filteredProducts = products.filter(
    (item) => item.category && item.category.toLowerCase() === searchCategory.path.toLowerCase()
  );

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">{searchCategory.text}</h2>
      {filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 mt-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategory;




















/*
const ProductCategory = () => {
  const { products = [], categories = [] } = useAppContext();
  const { category } = useParams();

  // LOADING: don't try to search before categories loaded
  if (!categories || categories.length === 0) {
    return <p>Loading categories…</p>;
  }

  // Convert param to lowercase for comparison
  const categoryParam = category?.toLowerCase();

  // Find matching category (assumes all category paths are lowercase)
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === categoryParam
  );

  if (!searchCategory) {
    return (
      <div>
        <h2>Category not found.</h2>
      </div>
    );
  }

  // Filter products that belong to this category
  const filteredProducts = products.filter(
    (item) => item.category === searchCategory.path || item.category === searchCategory.id
  );

  return (
    <div>
      <h2>{searchCategory.text.toUpperCase()}</h2>
      {filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
*/










































