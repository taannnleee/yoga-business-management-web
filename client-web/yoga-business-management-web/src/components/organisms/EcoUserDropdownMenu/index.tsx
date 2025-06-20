"use client";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
  ChevronDownIcon,
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
  setActiveTab: (tab: string) => void;
}

const UserDropdownMenu: React.FC<IProps> = ({ isHovered, setActiveTab }) => {
  const dropdownItems = ["Sản phẩm 1", "Sản phẩm 2", "Sản phẩm 3"];
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
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
    };

    handleUpdate(); // ← Chạy ngay lần đầu
    window.addEventListener("access-token-updated", handleUpdate);

    return () => {
      window.removeEventListener("access-token-updated", handleUpdate);
    };
  }, []);
  // Hàm logout sẽ gọi API và xử lý đăng xuất
  const logout = async () => {
    try {
      // Gọi API logout sử dụng fetch
      const response = await axiosInstance.post(
        `${API_URL}/api/auth/logout`,
        {} // Body rỗng
      );

      // Kiểm tra nếu logout thành công
      if (response.status === 200) {
        // Xóa token khỏi localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        toast.sendToast("Success", "Đăng xuất thành công");

        // Điều hướng về trang chủ
        router.replace("/login");
      } else {
        // Xử lý trường hợp logout không thành công
        toast.sendToast(
          "Error",
          "Đăng xuất thất bại, vui lòng thử lại.",
          "error"
        );
      }
    } catch (error) {
      // Xử lý lỗi trong quá trình gọi API
      console.error("Logout error", error);
      toast.sendToast(
        "Error",
        "Đăng xuất thất bại, vui lòng thử lại.",
        "error"
      );
    }
  };
  const handleTabClick = (tab: string) => {
    localStorage.setItem("profileTab", tab);
    if (window.location.pathname === "/profile") {
      window.dispatchEvent(new Event("profile-tab-changed"));
    } else {
      router.push("/profile");
    }
  };
  return (
    isHovered && (
      <div className="absolute left-0 top-full z-50">
        {accessToken ? (
          <div className="space-y-2 w-[200px] bg-white p-4 shadow-lg rounded-lg">
            <p
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => router.push("/profile")}
            >
              <span>👤</span> Thông tin cá nhân
            </p>
            <p
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => handleTabClick("address")}
            >
              <span>🏠</span> Địa chỉ
            </p>
            <p
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => handleTabClick("orders")}
            >
              <span>📦</span> Đơn hàng của tôi
            </p>
            <p
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => handleTabClick("saved")}
            >
              <span>❤️</span> Sản phẩm yêu thích
            </p>
            <p
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={logout}
            >
              <span>🚪</span> Đăng xuất
            </p>
          </div>
        ) : (
          <div className="space-y-2 w-28 bg-white p-4 shadow-lg rounded-lg">
            <p
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => router.replace("/login")}
            >
              <span>🔑</span> Đăng nhập
            </p>
            <p
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => router.replace("/create-account")}
            >
              <span>📝</span> Tạo tài khoản
            </p>
          </div>
        )}
      </div>
    )
  );
};

export default UserDropdownMenu;
