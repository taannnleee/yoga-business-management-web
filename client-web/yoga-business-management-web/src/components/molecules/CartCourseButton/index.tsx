// src/components/molecules/CartButton/LeftSideProductDetail.tsx

"use client"; // This marks the file as a client-side component

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import axios from "axios";
import axiosInstance from "@/utils/axiosClient";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { incrementTotalItems, setTotalItems } from "@/redux/cart/cartSlice"; // Redux actions
import { API_URL } from "@/config/url";
import { RootState } from "@/redux/store";
const CartCourseButton = () => {
    const totalItems = useSelector((state: RootState) => state.cart.totalItems);
    const dispatch = useDispatch();
    const router = useRouter();


    return (
        <button
            className="rounded-xl px-4 py-2 text-center text-gray-600 text-sm w-fit flex space-x-1 items-center hover:bg-gray-100"
            onClick={() => router.replace("/course/cart-course")}
        >
            <ShoppingCartIcon className="w-8 h-8 text-gray-600" />
            {totalItems > 0 && (
                <span className="absolute top-4 right-6 rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                    {totalItems}
                </span>
            )}
        </button>
    );
};

export default CartCourseButton;
