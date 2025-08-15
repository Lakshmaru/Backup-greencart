

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { dummyProducts, categories as dummyCategories } from '../assets/assets';

axios.defaults.withCredentials = true; // ✅ Always send cookies
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
axios.defaults.baseURL = BACKEND_URL || '';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(dummyProducts || []);
  const [categories, setCategories] = useState(dummyCategories || []);
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [loadingUser, setLoadingUser] = useState(!!BACKEND_URL);
  const [searchQuery, setSearchQuery] = useState('');

  const API_ENABLED = Boolean(BACKEND_URL);

  const useDummyProducts = (reason) => {
    console.warn('Falling back to dummyProducts:', reason);
    setProducts(dummyProducts || []);
  };
  const useDummyCategories = (reason) => {
    console.warn('Falling back to dummyCategories:', reason);
    setCategories(dummyCategories || []);
  };

  /* ---------------------------
     Fetch current logged-in user
  --------------------------- */
  const fetchUser = async () => {
    if (!API_ENABLED) {
      setUser(null);
      setLoadingUser(false);
      return;
    }
    try {
      const { data } = await axios.get('/api/user/is-auth', {
        withCredentials: true,
      });
      if (data?.success && data.user) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('fetchUser error:', err?.response?.status, err?.response?.data || err.message);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchSellerStatus = async () => {
    if (!API_ENABLED) return;
    try {
      const { data } = await axios.get('/api/seller/is-auth', { withCredentials: true });
      setIsSeller(!!data?.success);
    } catch {
      setIsSeller(false);
    }
  };

  const fetchProducts = async () => {
    if (!API_ENABLED) return useDummyProducts('no BACKEND_URL');
    try {
      const { data } = await axios.get('/api/seller/products');
      if (data?.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        useDummyProducts('unexpected response');
      }
    } catch {
      useDummyProducts('network/error');
    }
  };

  const fetchCategories = async () => {
    if (!API_ENABLED) return useDummyCategories('no BACKEND_URL');
    try {
      const { data } = await axios.get('/api/categories');
      if (data?.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        useDummyCategories('unexpected response');
      }
    } catch {
      useDummyCategories('network/error');
    }
  };

  const addToCart = (itemId) => {
    if (!itemId) return;
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    toast.success('Added to cart');
  };

  const removeFromCart = (itemId) => {
    if (!itemId) return;
    setCartItems((prev) => {
      const updated = { ...prev };
      if (!updated[itemId]) return prev;
      updated[itemId] > 1 ? updated[itemId]-- : delete updated[itemId];
      return updated;
    });
    toast.success('Removed from cart');
  };

  const updateCartItem = (itemId, quantity) => {
    if (!itemId) return;
    setCartItems((prev) => {
      const updated = { ...prev };
      quantity <= 0 ? delete updated[itemId] : (updated[itemId] = quantity);
      return updated;
    });
    toast.success('Cart updated');
  };

  const getCartCount = () => Object.values(cartItems).reduce((s, q) => s + q, 0);
  const getCartAmount = () =>
    Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const p = products.find((x) => x._id === id);
      return sum + (p?.offerPrice || p?.price || 0) * qty;
    }, 0);

  /* ---------------------------
     Initial load: restore session
  --------------------------- */
  useEffect(() => {
    if (API_ENABLED) {
      fetchUser().then(() => {
        fetchSellerStatus();
        fetchProducts();
        fetchCategories();
      });
    } else {
      setLoadingUser(false);
    }
  }, []);

  /* ---------------------------
     Sync cart after login
  --------------------------- */
  useEffect(() => {
    if (!user || loadingUser) return;
    const updateCart = async () => {
      try {
        const cartItemsArray = Object.entries(cartItems).map(([productId, quantity]) => ({
          productId,
          quantity,
        }));
        await axios.post('/api/cart/update', { cartItems: cartItemsArray }, { withCredentials: true });
      } catch (error) {
        console.error('Cart update failed:', error.response?.data || error.message);
      }
    };
    updateCart();
  }, [cartItems, user, loadingUser]);

  if (loadingUser) return <div>Loading...</div>;

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        getCartCount,
        getCartAmount,
        currency: import.meta.env.VITE_CURRENCY || '₹',
        user,
        setUser,
        showUserLogin,
        setShowUserLogin,
        isSeller,
        setIsSeller,
        searchQuery,
        setSearchQuery,
        axios,
        fetchProducts,
        fetchCategories,
        fetchUser,
        setCartItems
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
