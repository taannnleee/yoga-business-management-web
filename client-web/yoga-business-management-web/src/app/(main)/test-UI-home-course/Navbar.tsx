import React from 'react';

export const Navbar = () => {
  const category = [
    "Home",
    "TopRated",
    "Kids Wear",
    "Mens Wear",
    "Electronics",
    "Trending Products"
  ];

  return (
    <div className='flex justify-center'>
      {category.map((item, index) => (
        <div key={index} className='px-3 relative group'>
          {index === category.length - 1 ? (
            <div className="relative">
              {item}
              {/* Dropdown Menu */}
              <div className='absolute left-0 mt-2 w-48 bg-white border border-gray-300 
                  shadow-md p-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 duration-300 delay-200'>
                <div className='hover:bg-gray-100 p-2 cursor-pointer'>Option 1</div>
                <div className='hover:bg-gray-100 p-2 cursor-pointer'>Option 2</div>
                <div className='hover:bg-gray-100 p-2 cursor-pointer'>Option 3</div>
              </div>
            </div>
          ) : (
            <div>{item}</div>
          )}
        </div>
      ))}
    </div>
  );
};
