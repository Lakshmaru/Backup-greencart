import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();

  const {
    user,
    setUser,
    cartItems = {},
    searchQuery = '',
    setSearchQuery,
    setShowUserLogin,
    axios,
  } = useAppContext();

  const [mobileOpen, setMobileOpen] = useState(false);
  const term = String(searchQuery || '').trim();
  const totalCartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

  // Fixed logout with POST request and withCredentials:
  const logout = async () => {
    try {
      const { data } = await axios.post('/api/user/logout', {}, { withCredentials: true });
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Logout failed');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.length > 0) {
      navigate(`/products?q=${encodeURIComponent(term)}`);
      setMobileOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="flex items-center justify-between w-full px-4 py-4">
        {/* Left: Logo */}
        <NavLink to="/" onClick={() => setSearchQuery('')}>
          <img src={assets.logo} alt="Logo" className="h-9" />
        </NavLink>

        {/* Desktop: Right Side */}
        <div className="items-center hidden gap-6 md:flex">
          <NavLink
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            All Products
          </NavLink>

          <form
            onSubmit={handleSubmit}
            className="relative"
            aria-label="Search products"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="py-1.5 pl-10 pr-3 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button type="submit" className="sr-only">
              Search
            </button>
            <img
              src={assets.search_icon}
              alt="Search"
              className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3 opacity-60"
            />
          </form>

          <div
            onClick={() => navigate('/cart')}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="Cart"
              className="w-6 opacity-80"
            />
            {totalCartCount > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-green-500 rounded-full -top-2 -right-3">
                {totalCartCount}
              </span>
            )}
          </div>

          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-600"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img
                src={assets.profile_icon}
                alt="Profile"
                className="w-10 cursor-pointer"
              />
              <ul className="absolute right-0 flex-col hidden w-32 mt-2 bg-white border rounded shadow-lg group-hover:flex">
                <li
                  onClick={() => {
                    navigate('/my-orders');
                    setShowUserLogin(false);
                  }}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  My Orders
                </li>
                <li
                  onClick={logout}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
        >
          <img src={assets.menu_icon} alt="Menu" className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              All Products
            </NavLink>

            <form
              onSubmit={handleSubmit}
              className="relative"
              aria-label="Search products"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="w-full py-1.5 pl-10 pr-3 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <img
                src={assets.search_icon}
                alt="Search"
                className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3 opacity-60"
              />
            </form>

            <div
              onClick={() => {
                navigate('/cart');
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={assets.nav_cart_icon}
                alt="Cart"
                className="w-6 opacity-80"
              />
              <span className="text-sm">Cart ({totalCartCount})</span>
            </div>

            {!user ? (
              <button
                onClick={() => {
                  setShowUserLogin(true);
                  setMobileOpen(false);
                }}
                className="px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-600"
              >
                Login
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    navigate('/my-orders');
                    setMobileOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-left rounded hover:bg-gray-100"
                >
                  My Orders
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-left rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
