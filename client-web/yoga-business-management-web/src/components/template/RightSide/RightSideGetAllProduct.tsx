import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ProductCard from '@/components/molecules/ProductCard'; // Import ProductCard

export const RightSideGetAllProduct: React.FC = () => {
    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);
    const selectedSubCategory = useSelector((state: RootState) => state.category.selectedSubCategory);
    console.log('Selected category:', selectedCategory);
    console.log('Selected subcategory:', selectedSubCategory);
    // State to manage sorting
    const [selectedSort, setSelectedSort] = useState('');
    const [products, setProducts] = useState<any[]>([]); // State to hold product data
    const [loading, setLoading] = useState<boolean>(false);

    // Handle sorting change
    const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedSort(event.target.value as string);
    };

    // Call API to fetch products when component is mounted or when the selectedSubCategory or selectedSort changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(
                    `http://localhost:8080/api/product/filter?subCategoryId=${selectedSubCategory?.id || 1}&categoryId=${selectedCategory?.id || 1}&page=1&pageSize=5&sortBy=${selectedSort || 'title'}&sortDir=${selectedSort || 'asc'}&keyword=Thảm`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                // Kiểm tra xem response có thành công không
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Fetched products:', data.data.content);
                setProducts(data.data.content); // Store products in state
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedSubCategory, selectedSort]); // Dependency array: fetch when subCategory or sorting changes

    return (
        <div>
            <div className="flex flex-row justify-between m-4">
                <h1 className="text-2xl font-bold text-center ml-[46px] pt-[8px]">
                    {selectedSubCategory?.name || selectedCategory?.name || 'Tất cả sản phẩm'}
                </h1>
                <div className="flex justify-end items-center mt-[-24px]">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-lg mt-8 mx-auto">
                {loading ? (
                    <div>Loading...</div> // You can add a loading spinner or skeleton here
                ) : products.length === 0 ? (
                    <div className="col-span-full text-center text-xl text-gray-500">
                        Shop chưa nhập loại sản phẩm này 😢 , vui lòng chọn loại sản phẩm khác
                    </div>
                ) : (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            loading={loading}
                            renderStars={(rating) => (
                                <div>{'⭐'.repeat(rating)}</div> // Temporary star render logic
                            )}
                            handleOpenModal={() => {
                            }}
                        />
                    ))
                )}
            </div>

        </div>
    );
};
