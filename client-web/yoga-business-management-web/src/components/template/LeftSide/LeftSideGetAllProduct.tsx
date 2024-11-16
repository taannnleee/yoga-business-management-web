// File: components/template/LeftSide/LeftSideGetAllProduct.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { setSelectedCategory, setSelectedSubCategory } from '@/redux/category/categorySlice';
import { RootState } from "@/redux/store";

interface SubCategory {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    subCategories: SubCategory[];
}

export const LeftSideGetAllProduct: React.FC = () => {
    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);
    const selectedSubCategory = useSelector((state: RootState) => state.category.selectedSubCategory);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:8080/api/category/with-sub-categories', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                if (data.status === 200) {
                    setCategories(data.data);
                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryName: string) => {
        dispatch(setSelectedCategory(categoryName));
        dispatch(setSelectedSubCategory(null)); // Clear selected subcategory when category is clicked
    };

    const handleSubCategoryClick = (categoryName: string, subCategoryName: string) => {
        dispatch(setSelectedCategory(categoryName)); // Ensure the parent category is selected
        dispatch(setSelectedSubCategory(subCategoryName)); // Set selected subcategory
    };

    return (
        <div className="w-64 bg-white shadow-lg p-4 space-y-4">
            <div>
                {categories.map((category) => (
                    <div key={category.id} className="space-y-2">
                        <div
                            onClick={() => handleCategoryClick(category.name)}
                            className={`px-4 py-2 transition-all duration-300 ease-in-out cursor-pointer ${
                                category.name === selectedCategory ? 'text-red-500 font-bold' : 'hover:bg-gray-200 hover:text-orange-600'
                            }`}
                        >
                            <span className="text-black font-bold uppercase text-sm">{category.name}</span>
                        </div>
                        <ul className="mt-2 space-y-1 ml-4">
                            {category.subCategories.map((subCategory) => (
                                <li
                                    key={subCategory.id}  // Added missing key prop
                                    onClick={() => handleSubCategoryClick(category.name, subCategory.name)}  // Pass both category and subcategory names
                                    className={`w-full text-sm py-1 transition-all duration-300 ease-in-out cursor-pointer ${
                                        subCategory.name === selectedSubCategory && category.name === selectedCategory
                                            ? 'text-red-500 font-bold' // Highlight subcategory only if its parent category is selected
                                            : 'hover:bg-gray-100 hover:text-orange-600'
                                    }`}
                                >
                                    {subCategory.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
