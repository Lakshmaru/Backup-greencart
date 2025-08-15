import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    type={type}
    placeholder={placeholder}
    name={name}
    value={address[name] || ''}
    onChange={handleChange}
    required
    className="w-full p-2 border rounded"
  />
);

const AddAddress = () => {
  const { axios, user } = useAppContext();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/address/add', { address });
      if (data.success) {
        toast.success(data.message);
        navigate('/cart'); // redirect after adding address
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (!user) navigate('/login'); // redirect if not logged in
  }, [user, navigate]);

  return (
    <div className="pb-16 mt-16">
      <p className="ml-16 text-2xl text-gray-500 md:text-3xl">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse items-start justify-between mt-10 md:flex-row gap-x-6">
        <div className="flex-1 max-w-md ml-16">
          <form onSubmit={onSubmitHandler} className="w-full space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="firstName" type="text" placeholder="First Name" />
              <InputField handleChange={handleChange} address={address} name="lastName" type="text" placeholder="Last Name" />
            </div>
            <InputField handleChange={handleChange} address={address} name="email" type="email" placeholder="Email" />
            <InputField handleChange={handleChange} address={address} name="street" type="text" placeholder="Street" />
            <div className="grid grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="city" type="text" placeholder="City" />
              <InputField handleChange={handleChange} address={address} name="state" type="text" placeholder="State" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="zipcode" type="number" placeholder="Zip Code" />
              <InputField handleChange={handleChange} address={address} name="country" type="text" placeholder="Country" />
            </div>
            <InputField handleChange={handleChange} address={address} name="phone" type="text" placeholder="Phone" />

            <button
              className="w-full py-3 mt-6 text-white uppercase transition cursor-pointer bg-primary hover:bg-primary-dull"
            >
              Save Address
            </button>
          </form>
        </div>
        <div className="shrink-0">
          <img src={assets.add_address_iamge} alt="Add Address" className="mb-16 md:mr-16 md:mt-0" />
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
