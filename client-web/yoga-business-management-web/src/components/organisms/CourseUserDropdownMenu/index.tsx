import { Logout, AccountCircle, School, Calculate } from "@mui/icons-material";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config/url";
import axiosInstance from "@/utils/axiosClient";
import { useToast } from "@/hooks/useToast";

interface IProps {
  isHovered: boolean;
}

const UserDropdownMenu: React.FC<IProps> = ({ isHovered }) => {
  const router = useRouter();
  const toast = useToast();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
    }
  }, []);

  const logout = async () => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/api/auth/logout`,
        {}
      );
      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.sendToast("Success", "Đăng xuất thành công");
        router.replace("/login");
      } else {
        toast.sendToast(
          "Error",
          "Đăng xuất thất bại, vui lòng thử lại.",
          "error"
        );
      }
    } catch (error) {
      toast.sendToast(
        "Error",
        "Đăng xuất thất bại, vui lòng thử lại.",
        "error"
      );
    }
  };

  return (
    isHovered && (
      <div className="absolute left-0 top-full mt-[-2px] min-w-[180px] bg-white shadow-xl rounded-xl z-50 border border-gray-100">
        {accessToken ? (
          <div className="flex flex-col py-2">
            <button
              className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100 rounded-lg transition"
              onClick={() => router.push("/course/bmi")}
            >
              <Calculate fontSize="small" className="text-gray-500" />
              <span>Chỉ số BMI</span>
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100 rounded-lg transition"
              onClick={() => router.push("/course/order")}
            >
              <School fontSize="small" className="text-gray-500" />
              <span>Khóa học của tôi</span>
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100 rounded-lg transition text-red-600"
              onClick={logout}
            >
              <Logout fontSize="small" className="text-red-400" />
              <span>Đăng xuất</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col py-2">
            <button
              className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100 rounded-lg transition"
              onClick={() => router.replace("/login")}
            >
              <AccountCircle fontSize="small" className="text-gray-500" />
              <span>Đăng nhập</span>
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100 rounded-lg transition"
              onClick={() => router.replace("/create-account")}
            >
              <AccountCircle fontSize="small" className="text-gray-500" />
              <span>Tạo tài khoản</span>
            </button>
          </div>
        )}
      </div>
    )
  );
};

export default UserDropdownMenu;
