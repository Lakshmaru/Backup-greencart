import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ProductList = () => {
  const { products = [], currency, axios, fetchProducts } = useAppContext();
  const [localStock, setLocalStock] = useState({});
  const [updating, setUpdating] = useState({});

  const isValidMongoId = (id) => /^[a-f\d]{24}$/i.test(id);

  useEffect(() => {
    const saved = (() => {
      try {
        return JSON.parse(localStorage.getItem('localStock') || '{}');
      } catch (err) {
        console.error('Failed to parse localStorage.localStock:', err);
        toast.error('Error loading saved stock status');
        return {};
      }
    })();

    const map = {};
    products.forEach((p) => {
      const id = p?._id ?? p?.id ?? '';
      map[id] = typeof saved[id] !== 'undefined' ? Boolean(saved[id]) : Boolean(p?.inStock);
    });
    setLocalStock(map);
  }, [products]);

  const saveLocalStockToStorage = (map) => {
    try {
      const existing = JSON.parse(localStorage.getItem('localStock') || '{}');
      const merged = { ...existing, ...map };
      localStorage.setItem('localStock', JSON.stringify(merged));
    } catch (err) {
      console.error('Failed to save localStock to localStorage:', err);
      toast.error('Error saving stock status locally');
    }
  };

  const toggleStock = async (id, newValue) => {
    if (!id) {
      toast.error('Missing product id');
      return;
    }

    setLocalStock((prev) => ({ ...prev, [id]: newValue }));

    if (!isValidMongoId(id)) {
      saveLocalStockToStorage({ [id]: newValue });
      toast.success(`Stock updated to ${newValue ? 'In Stock' : 'Out of Stock'}`);
      return;
    }

    setUpdating((u) => ({ ...u, [id]: true }));
    try {
      const { data } = await axios.patch(`/api/product/${id}/stock`, { inStock: newValue });

      if (data?.success) {
        toast.success(`Stock updated to ${newValue ? 'In Stock' : 'Out of Stock'}`);
        if (typeof fetchProducts === 'function') fetchProducts();

        try {
          const stored = JSON.parse(localStorage.getItem('localStock') || '{}');
          if (stored && typeof stored[id] !== 'undefined') {
            delete stored[id];
            localStorage.setItem('localStock', JSON.stringify(stored));
          }
        } catch (err) {
          console.error('Failed to clear localStorage override for product:', id, err);
          toast.error('Error clearing saved stock status');
        }
      } else {
        throw new Error(data?.message || 'Failed to update stock');
      }
    } catch (err) {
      setLocalStock((prev) => ({ ...prev, [id]: !newValue }));
      console.error('Toggle stock error:', err);
      toast.error(err.response?.data?.message || err.message || 'Error updating stock');
    } finally {
      setUpdating((u) => ({ ...u, [id]: false }));
    }
  };

  const getImage = (product) =>
    (product.image && product.image.length && product.image[0]) ||
    (product.images && product.images.length && product.images[0]) ||
    'https://via.placeholder.com/64?text=No+Image';

  return (
    <div className="noscrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full p-4 md:p-10">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center w-full max-w-4xl overflow-hidden bg-white border rounded-md border-gray-500/20">
          <table className="w-full overflow-hidden table-fixed md:table-auto">
            <thead className="text-sm text-left text-gray-900">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="hidden px-4 py-3 font-semibold truncate md:block">Selling Price</th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-500">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400">
                    No products available
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const id = product?._id ?? product?.id ?? '';
                  const checked = !!localStock[id];
                  const isUpdating = !!updating[id];

                  return (
                    <tr key={id || Math.random()} className="border-t border-gray-500/20">
                      <td className="flex items-center py-3 pl-2 space-x-3 truncate md:px-4 md:pl-4">
                        <div className="flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-100 border border-gray-300 rounded">
                          <img
                            src={getImage(product)}
                            alt={product.name || 'Product Image'}
                            className="object-cover w-16 h-16"
                          />
                        </div>
                        <span className="w-full truncate max-sm:hidden">{product.name}</span>
                      </td>

                      <td className="px-4 py-3">{product.category}</td>

                      <td className="px-4 py-3 max-sm:hidden">
                        {currency}
                        {product.offerPrice}
                      </td>

                      <td className="px-4 py-3">
                        <label className="relative inline-flex items-center gap-3 text-gray-900 cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={checked}
                            disabled={isUpdating}
                            onChange={(e) => toggleStock(id, e.target.checked)}
                          />
                          <div
                            className={`w-12 transition-colors duration-200 rounded-full h-7 ${
                              checked ? 'bg-primary' : 'bg-slate-300'
                            }`}
                          ></div>
                          <span
                            className={`absolute w-5 h-5 transition-transform duration-200 ease-in-out bg-white rounded-full dot left-1 top-1 ${
                              checked ? 'translate-x-5' : ''
                            }`}
                          ></span>
                        </label>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
