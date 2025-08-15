import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';

const SellerLayout = () => {
  const { setIsSeller, axios } = useAppContext();
  const navigate = useNavigate();

  const sidebarLinks = [
    { name: 'Add Product', path: '/seller', icon: assets.add_icon },
    { name: 'Product List', path: '/seller/product-list', icon: assets.product_list_icon },
    { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
  ];

  const handleLogout = async () => {
    try {
      // Send logout request to backend
      const { data } = await axios.post('/api/seller/logout');

      if (data.success) {
        setIsSeller(false);                // Clear seller auth state
        toast.success('Logged Out');
        navigate('/seller');               // Redirect to login page
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      // Handle network or server errors
      toast.error(error.response?.data?.message || 'Server error during logout');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-300 md:px-8">
        <Link to="/">
          <img src={assets.logo} alt="logo" className="cursor-pointer w-28 md:w-36" />
        </Link>
        <div className="flex items-center gap-5 text-gray-600">
          <p>Hi! Admin</p>
          <button
            onClick={handleLogout}
            className="px-4 py-1 text-sm border rounded-full hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar + Outlet */}
      <div className="flex min-h-[calc(100vh-64px)]">
        <div className="flex flex-col w-16 py-4 bg-white border-r border-gray-300 md:w-64">
          {sidebarLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/seller'}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 ${
                  isActive
                    ? 'border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary'
                    : 'hover:bg-gray-100/90 text-gray-700'
                }`
              }
            >
              <img src={item.icon} alt={item.name} className="w-7 h-7" />
              <p className="hidden md:block">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* Page Content */}
        <div className="flex-grow p-4 md:p-6 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SellerLayout;
