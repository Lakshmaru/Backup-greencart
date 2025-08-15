/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, dummyAddress } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products = [],
    currency,
    cartItems = {},
    removeFromCart,
    getCartCount,
    updateCartItem,
    getCartAmount,
    setCartItems,
    user
  } = useAppContext();

  const navigate = useNavigate();

  const [cartArray, setCartArray] = useState([]);
  const [address] = useState(dummyAddress);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(dummyAddress[0]);
  const [paymentOption, setPaymentOption] = useState("COD");

  // Update cartArray when products or cartItems change
  useEffect(() => {
    if (products.length && cartItems) {
      const temp = [];
      for (const id in cartItems) {
        const prod = products.find((p) => p._id === id);
        if (!prod) continue;
        temp.push({ ...prod, quantity: cartItems[id] });
      }
      setCartArray(temp);
    }
  }, [products, cartItems]);

  // Handle placing order
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      return toast.error("Please select a delivery address.");
    }

    if (cartArray.length === 0) {
      return toast.error("Your cart is empty.");
    }

    // Create new order
    const newOrder = {
      _id: "ORD" + new Date().getTime(),
      paymentType: paymentOption,
      status: "Processing",
      createdAt: new Date(),
      amount: cartArray.reduce((total, item) => total + item.offerPrice * item.quantity, 0),
      address: selectedAddress,
      items: cartArray.map(item => ({
        product: item,
        quantity: item.quantity,
        total: item.offerPrice * item.quantity
      }))
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem("myOrders", JSON.stringify(updatedOrders));

    // Clear cart
    setCartItems({});
    toast.success("Order placed successfully!");
    navigate("/my-orders");
  };

  if (!products.length || !cartItems) return null;

  return (
    <div className="flex flex-col mt-16 md:flex-row">
      {/* Cart Items */}
      <div className="flex-1 max-w-4xl">
        <h1 className="mb-6 text-3xl font-medium">
          Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center gap-3 md:gap-6">
              <div
                onClick={() => {
                  navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                  window.scrollTo(0, 0);
                }}
                className="flex items-center justify-center w-24 h-24 overflow-hidden border border-gray-300 rounded cursor-pointer"
              >
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="object-cover h-full max-w-full"
                />
              </div>
              <div>
                <p className="hidden font-semibold md:block">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>Weight: <span>{product.weight || "N/A"}</span></p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      value={product.quantity}
                      onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                      className="outline-none"
                    >
                      {Array.from({ length: Math.max(cartItems[product._id] || 9, 9) }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center">
              {currency}{product.offerPrice * product.quantity}
            </p>

            <button
              onClick={() => removeFromCart(product._id)}
              className="mx-auto cursor-pointer"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="inline-block w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo(0, 0);
          }}
          className="flex items-center gap-2 mt-8 font-medium cursor-pointer text-primary group"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="arrow"
            className="transition group-hover:-translate-x-1"
          />
          Continue Shopping
        </button>
      </div>

      {/* Order Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 mt-8 md:mt-0 border border-gray-300/70">
        <h2 className="text-xl font-medium md:text-xl">Order Summary</h2>
        <hr className="my-5 border-gray-300" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex items-start justify-between mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="cursor-pointer text-primary hover:underline"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute z-10 w-full py-1 text-sm bg-white border border-gray-300 top-12">
                {address.map((addr, idx) => (
                  <p
                    key={idx}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddress(false);
                    }}
                    className="p-2 text-gray-500 cursor-pointer hover:bg-gray-100"
                  >
                    {`${addr.street}, ${addr.city}, ${addr.state}, ${addr.country}`}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="p-2 text-center cursor-pointer text-primary hover:bg-primary/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="mt-6 text-sm font-medium uppercase">Payment Method</p>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full px-3 py-2 mt-2 bg-white border border-gray-300 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="mt-4 space-y-2 text-gray-500">
          <p className="flex justify-between">
            <span>Price</span>
            <span>{currency}{getCartAmount()}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>{currency}{(getCartAmount() * 2) / 100}</span>
          </p>
          <p className="flex justify-between mt-3 text-lg font-medium">
            <span>Total Amount:</span>
            <span>{currency}{getCartAmount() + (getCartAmount() * 2) / 100}</span>
          </p>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full py-3 mt-6 font-medium text-white transition cursor-pointer bg-primary hover:bg-primary-dull"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;


