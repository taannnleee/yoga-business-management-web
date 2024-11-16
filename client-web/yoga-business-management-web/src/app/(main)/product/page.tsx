"use client";
import React, { useState, useEffect } from 'react';
import { LeftSideGetAllProduct } from "@/components/template/LeftSide/LeftSideGetAllProduct";
import { RightSideGetAllProduct } from "@/components/template/RightSide/RightSideGetAllProduct";
import { LeftSideGetAllProductSkeleton } from "@/components/template/LeftSide/LeftSideGetAllProductSkeleton";
import BottomContent from "@/components/molecules/BottomContent";

const ProductPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0); // Total items to be fetched (can be dynamic)
    const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page

    // Simulating data fetching and pagination
    useEffect(() => {
        const fetchData = async () => {
            // Simulate fetching process
            setTimeout(() => {
                setTotalItems(50); // Example total items count
                setLoading(false);
            }, 2000); // 2 seconds for example
        };

        fetchData();
    }, []);

    // Pagination calculation (example)
    const pages = Math.ceil(totalItems / itemsPerPage);

    const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
    };

    const onNextPage = () => {
        if (currentPage < pages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const onPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="flex flex-col min-h-screen"> {/* Ensure full height layout */}
            <div className="flex flex-row space-x-4 flex-grow"> {/* Allowing Right and Left Side to grow */}
                {/* Left Side - Show Skeleton or Product Component */}
                <div className="flex-none w-1/3">
                    {loading ? <LeftSideGetAllProductSkeleton /> : <LeftSideGetAllProduct />}
                </div>

                {/* Right Side - Show Product Component */}
                <div className="flex flex-col justify-between">
                    {<RightSideGetAllProduct />}
                        <BottomContent
                            totalItems={totalItems}
                            currentPage={currentPage}
                            pages={pages}
                            onRowsPerPageChange={onRowsPerPageChange}
                            onNextPage={onNextPage}
                            onPreviousPage={onPreviousPage}
                            setCurrentPage={setCurrentPage}
                        />
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
