// File: components/template/RightSide/RightSideGetAllProduct.tsx

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export const RightSideGetAllProduct: React.FC = () => {
    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);
    const selectedSubCategory = useSelector((state: RootState) => state.category.selectedSubCategory);

    // State to manage sorting
    const [selectedSort, setSelectedSort] = useState('');

    // Handle sorting change
    const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedSort(event.target.value as string);
    };

    return (
        <div className="flex flex-row justify-between m-4">
            <h1 className="text-2xl font-bold text-center">
                {selectedSubCategory || selectedCategory || 'Select a category or subcategory'}
            </h1>
            <div className="flex justify-end items-center mt-4">
                {/* Right-aligning the sorting section */}
                <FormControl className={"w-48 h-4"}>
                    <InputLabel id="sort-select-label text-center">Sắp xếp</InputLabel>
                    <Select
                        labelId="sort-select-label"
                        id="sort-select"
                        value={selectedSort}
                        label="Sắp xếp"
                        onChange={handleSortChange}
                        variant={"filled"}
                    >
                        <MenuItem className={"text-xs"} value="">Mặc định</MenuItem>
                        <MenuItem className={"text-xs"} value="asc">A -> Z</MenuItem>
                        <MenuItem className={"text-xs"} value="desc">Z -> A</MenuItem>
                        <MenuItem className={"text-xs"} value="priceAsc">Giá tăng dần</MenuItem>
                        <MenuItem className={"text-xs"} value="priceDesc">Giá giảm dần</MenuItem>
                        <MenuItem className={"text-xs"} value="newest">Hàng mới nhất</MenuItem>
                        <MenuItem className={"text-xs"} value="oldest">Hàng cũ nhất</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};
