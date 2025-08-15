import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const { axios, categories, fetchProducts } = useAppContext();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // Construct product data
      const productData = {
        name,
        description: description.split("\n").map((line) => line.trim()).filter(Boolean),
        category,
        price: Number(price),
        offerPrice: Number(offerPrice) || 0,
      };

      // Build form data
      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      files.forEach((file) => {
        if (file) {
          formData.append("images", file);
        }
      });

      console.log("Sending productData:", productData);
      console.log("Sending files:", files.map((f) => f?.name));

      // Send request
      const { data } = await axios.post("/api/seller/add-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // Ensure cookies/session pass
      });

      // Handle response
      if (data.success) {
        toast.success(data.message || "✅ Product added successfully");
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
        fetchProducts();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("AddProduct error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleFileChange = (index, file) => {
    const updatedFiles = [...files];
    updatedFiles[index] = file;
    setFiles(updatedFiles);
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <form onSubmit={onSubmitHandler} className="max-w-lg p-4 space-y-5 md:p-10">
        {/* Product Image Upload */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4).fill("").map((_, index) => (
              <label key={index} htmlFor={`image-${index}`}>
                <input
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  accept="image/*"
                  type="file"
                  id={`image-${index}`}
                  hidden
                />
                <img
                  className="cursor-pointer max-w-24"
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index])
                      : assets.upload_area
                  }
                  alt="uploadArea"
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col max-w-md gap-1">
          <label htmlFor="product-name" className="text-base font-medium">Product Name</label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          />
        </div>

        {/* Product Description */}
        <div className="flex flex-col max-w-md gap-1">
          <label htmlFor="product-description" className="text-base font-medium">Product Description</label>
          <textarea
            id="product-description"
            rows={4}
            placeholder="Type here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="category" className="text-base font-medium">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>
                {item.path}
              </option>
            ))}
          </select>
        </div>

        {/* Price & Offer Price */}
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex flex-col flex-1 w-32 gap-1">
            <label htmlFor="product-price" className="text-base font-medium">Product Price</label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            />
          </div>

          <div className="flex flex-col flex-1 w-32 gap-1">
            <label htmlFor="product-offer" className="text-base font-medium">Offer Price</label>
            <input
              id="product-offer"
              type="number"
              placeholder="0"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
