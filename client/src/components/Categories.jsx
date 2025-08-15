import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../assets/assets';

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (path) => {
    navigate(`/category/${path}`);
    window.scrollTo(0, 0);
  };

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-semibold md:text-3xl">Categories</h2>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {categories.map(({ image, text, path, bgColor }, idx) => (
          <div
            key={idx}
            onClick={() => handleCategoryClick(path)}
            className="flex flex-col items-center justify-center gap-2 p-5 transition rounded-lg cursor-pointer hover:bg-green-100 group"
            style={{ backgroundColor: bgColor || '#f9fafb' }}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(path)}
          >
            <img
              src={image}
              alt={text}
              className="transition-transform max-w-28 group-hover:scale-110"
            />
            <p className="text-sm font-medium text-center">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;




/*
import React from 'react';
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext.jsx';

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <div className='mt-16'>
      <p className='text-2xl font-medium md:text-3xl'>Categories</p>
      <div className='grid grid-cols-2 gap-6 mt-6 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'>
        {categories.map((category, index) => (
          <div
            key={index}
            className='flex flex-col items-center justify-center gap-2 px-3 py-5 rounded-lg cursor-pointer group'
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.text.toLowerCase()}`);
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className='transition group-hover:scale-110 max-w-28'
            />
            <p className='text-sm font-medium'>{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
*/
