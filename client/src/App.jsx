import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import Home from './pages/Home.jsx';
import AllProducts from './pages/AllProducts.jsx';
import ProductCategory from './pages/ProductCategory.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import AddAddress from './pages/AddAddress.jsx';
import Footer from './components/Footer.jsx';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext.jsx';
import MyOrder from './pages/MyOrder.jsx';
import SellerLogin from './context/Seller/SellerLogin.jsx';
import SellerLayout from './pages/seller/SellerLayout.jsx';
import AddProduct from './pages/seller/AddProduct.jsx';
import ProductList from './pages/seller/ProductList.jsx';
import Orders from './pages/seller/Orders.jsx';

export default function App() {
  const { showUserLogin, isSeller } = useAppContext();
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/seller');

  return (
    <div className="min-h-screen text-gray-700 bg-white">
      {!hideNavbar && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />
      <main className={`flex-grow ${hideNavbar ? '' : 'px-6 md:px-16 lg:px-24 xl:px-32'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
           <Route path="/login" element={<Login />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/category/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrder />} />

          {/* Seller routes */}
          <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
