/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {
  const { products = [], currency = "₹", addToCart } = useAppContext();
  const { id, category } = useParams();
  const navigate = useNavigate();

  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (product?.image?.length) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      const rel = products
        .filter(
          (p) =>
            p.category === product.category &&
            p._id !== product._id &&
            p.inStock      // ✅ corrected property name
        )
        .slice(0, 5);
      setRelatedProducts(rel);
    }
  }, [products, product]);

  if (products.length === 0) {
    return <div className="p-8 text-lg text-center">Loading product...</div>;
  }
  if (!product) {
    return (
      <div className="p-8 text-lg text-center text-red-500">
        Product not found.
      </div>
    );
  }

  const descriptionList = Array.isArray(product.description)
    ? product.description
    : typeof product.description === "string"
    ? [product.description]
    : ["No description available"];

  return (
    <div className="mt-12">
      <p className="text-sm text-gray-500">
        <Link to="/">Home</Link> /
        <Link to="/products"> Products</Link> /
        <Link to={`/products/${category}`}> {product.category}</Link> /
        <span className="text-indigo-500"> {product.name}</span>
      </p>

      <div className="flex flex-col gap-16 mt-4 md:flex-row">
        {/* Left side */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.image?.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setThumbnail(img)}
                className="overflow-hidden border rounded cursor-pointer max-w-24 border-gray-500/30"
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} />
              </div>
            ))}
          </div>
          <div className="overflow-hidden border rounded border-gray-500/30 max-w-100">
            <img
              src={thumbnail}
              alt="Selected product"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="w-full text-sm md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <img
                key={i}
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt=""
                className="md:w-4 w-3.5"
              />
            ))}
            <p className="ml-2 text-base">(4)</p>
          </div>

          <div className="mt-6">
            <p className="line-through text-gray-500/70">
              MRP: {currency}
              {product.price}
            </p>
            <p className="text-2xl font-medium">
              MRP: {currency}
              {product.offerPrice}
            </p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          <p className="mt-6 text-base font-medium">About Product</p>
          <ul className="ml-4 list-disc text-gray-500/70">
            {descriptionList.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>

          <div className="flex items-center gap-4 mt-10 text-base">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3.5 font-medium bg-gray-100 hover:bg-gray-200 text-gray-800/80 transition-colors duration-200"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              className="w-full py-3.5 font-medium bg-primary hover:bg-primary-dull text-white transition-colors duration-200"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Related Products</p>
          <div className="w-20 h-0.5 bg-primary rounded-b-full mt-2"></div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 mt-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {relatedProducts.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No related products available.
            </p>
          ) : (
            relatedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))
          )}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo(0, 0);
          }}
          className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
        >
          See more
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;


