import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const Orders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    // Get orders from localStorage (saved when placing an order in Cart)
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
    setOrders(savedOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-scroll">
      <div className="p-4 space-y-4 md:p-10">
        <h2 className="text-lg font-medium">Orders List</h2>

        {orders.length === 0 && (
          <p className="text-gray-500">You have no orders yet.</p>
        )}

        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col gap-5 p-5 border border-gray-300 rounded-md md:flex-row md:items-center"
          >
            {/* Product info: image + names */}
            <div className="flex items-center gap-5 max-w-80">
              <img
                className="object-cover w-12 h-12"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div className="flex flex-wrap gap-2">
                {order.items.map((item, i) => (
                  <span key={i} className="text-sm font-medium">
                    {item.product.name}
                    <span className="text-primary"> x{item.quantity}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Address, Amount, Payment Info in a row */}
            <div className="flex flex-col justify-between w-full gap-4 text-sm md:flex-row md:items-center md:text-base text-black/70">
              {/* Address */}
              <div>
                <p className="text-black">{order.address.firstName || ''} {order.address.lastName || ''}</p>
                <p>{order.address.street}, {order.address.city}</p>
                <p>{order.address.state}, {order.address.zipcode || ''}, {order.address.country}</p>
                <p>{order.address.phone || ''}</p>
              </div>

              {/* Amount */}
              <div className="text-lg font-medium text-center text-black">
                {currency}{order.amount}
              </div>

              {/* Payment Info */}
              <div className="flex flex-col text-sm text-black/60 md:text-base">
                <p>Method: {order.paymentType}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Payment: {order.isPaid ? 'Paid' : 'Pending'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
