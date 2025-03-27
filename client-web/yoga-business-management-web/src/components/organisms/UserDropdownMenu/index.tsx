"use client";
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Bars3Icon,
    ShoppingCartIcon,
    UserIcon,
    ChevronDownIcon
} from "@heroicons/react/24/solid";
import SearchBar from "../../molecules/SearchBar";
import Logo from "@/components/atom/Logo";
import FulfillmentMangement from "../FulfillmentMangement";
import useDebounce from "@/hooks/useDebounce";
import Image from "next/image";
import LogoCourse from "../../atom/ButtonCourse";
import ButtonCourse from "../../atom/ButtonCourse";
import { useToast } from "@/hooks/useToast";
import CartButton from "@/components/molecules/CartButton";
import HoverDropdown from "@/components/molecules/HoverDropdown";
import { API_URL } from "@/config/url";
import axiosInstance from "@/utils/axiosClient";
interface IProps {
    isHovered: boolean;
}

const UserDropdownMenu: React.FC<IProps> = ({ isHovered }) => {
    const dropdownItems = ['Sản phẩm 1', 'Sản phẩm 2', 'Sản phẩm 3'];
    const router = useRouter();
    const toast = useToast();
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    const [isGettingProductCategory, setIsGettingProductCategory] =
        useState<boolean>(false);
    const [displayMenu, setDisplayMenu] = useState<boolean>(false);
    const [openRegister, setOpenRegister] = useState<boolean>(false);
    const [openMobileDrawer, setOpenMobileDrawer] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const debounceKeyword = useDebounce(keyword, 900);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [openSearchDropDown, setOpenSearchDropdown] = useState<boolean>(false);
    const clickInsideDropdown = useRef(false);
    // Check if the access token exists
    const accessToken = localStorage.getItem("accessToken");

    // Hàm logout sẽ gọi API và xử lý đăng xuất
    const logout = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                return;
            }

            // Gọi API logout sử dụng fetch
            const response = await axiosInstance.post(
                `${API_URL}/api/auth/logout`,
                {}, // Body rỗng
            );

            // Kiểm tra nếu logout thành công
            if (response.status === 200) {
                // Xóa token khỏi localStorage
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                toast.sendToast("Success", "Đăng xuất thành công");

                // Điều hướng về trang chủ
                router.replace("/login");
            } else {
                // Xử lý trường hợp logout không thành công
                toast.sendToast("Error", "Đăng xuất thất bại, vui lòng thử lại.", "error");
            }
        } catch (error) {
            // Xử lý lỗi trong quá trình gọi API
            console.error("Logout error", error);
            toast.sendToast("Error", "Đăng xuất thất bại, vui lòng thử lại.", "error");
        }
    };


    return (
        isHovered && (
            <div className="absolute left-0 top-full mt-2 bg-white p-4 shadow-lg z-50">
                {accessToken ? (
                    <div className="space-y-2 w-28 bg-white p-4 shadow-lg rounded-lg transform translate-y-[-24px]">
                        <p className="cursor-pointer w-full" onClick={() => router.push("/address")}>Địa chỉ</p>
                        <p className="cursor-pointer w-full" onClick={() => router.push("/bmi")}>Chỉ số BMI</p>
                        <p className="cursor-pointer" onClick={() => router.push("/order")}>Đơn hàng của bạn</p>
                        <p className="cursor-pointer" onClick={() => router.push("/profile")}>Thông tin cá nhân</p>
                        <p className="cursor-pointer" onClick={() => router.push("/wishlist")}>Sản phẩm yêu thích</p>
                        <p
                            className="cursor-pointer"
                            onClick={logout}  // Using logout before it is declared
                        >
                            Đăng xuất
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2 w-28 bg-white p-4 shadow-lg rounded-lg transform translate-y-[-24px]">
                        <p className="cursor-pointer" onClick={() => router.replace("/login")}>
                            Đăng nhập
                        </p>
                        <p className="cursor-pointer" onClick={() => router.replace("/create-account")}>
                            Tạo tài khoản
                        </p>
                        <p className="cursor-pointer">Facebook</p>
                        <p className="cursor-pointer">Google</p>
                    </div>

                )}
            </div>
        )
    );
};

export default UserDropdownMenu;