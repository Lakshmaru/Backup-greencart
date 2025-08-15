import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrder = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency } = useAppContext();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
    setMyOrders(storedOrders);
  }, []);

  if (!myOrders.length) {
    return <p className="mt-16 text-xl text-center">You have no orders yet.</p>;
  }

  return (
    <div className="pb-16 mt-16 ml-16">
      <div className="flex flex-col items-end mb-8 w-max">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {myOrders.map((order, index) => (
        <div key={index} className="max-w-4xl p-4 py-5 mb-10 border border-gray-300 rounded-lg shadow-sm">
          <p className="flex justify-between mb-3 text-gray-400 md:items-center md:font-medium max-md:flex-col">
            <span>OrderId: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total Amount: {currency}{order.amount}</span>
          </p>

          {order.items.map((item, idx) => (
            <div
              key={idx}
              className={`relative bg-white text-gray-500/70 ${
                order.items.length !== idx + 1 && "border-b"
              } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-4 rounded-lg bg-primary/10">
                  <img src={item.product?.image?.[0]} alt={item.product?.name || ""} className="w-16 h-16" />
                </div>

                <div className="ml-4">
                  <h2 className="text-xl font-medium text-gray-800">{item.product?.name}</h2>
                  <p>Category: {item.product?.category}</p>
                </div>
              </div>

              <div className="flex flex-col justify-center mb-4 md:ml-8 md:mb-0">
                <p>Quantity: {item.quantity || "1"}</p>
                <p>Status: {order.status}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <p className="text-lg font-medium text-primary">
                Amount: {currency}{item.total}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrder;
