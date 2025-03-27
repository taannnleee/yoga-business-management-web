"use client";
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bars3Icon,
  UserIcon,
  ChevronDownIcon
} from "@heroicons/react/24/solid";
import Logo from "@/components/atom/Logo";
import FulfillmentMangement from "../FulfillmentMangement";
import useDebounce from "@/hooks/useDebounce";
import ButtonCourse from "../../atom/ButtonCourse";
import { useToast } from "@/hooks/useToast";
import CartButton from "@/components/molecules/CartButton";
import HoverDropdown from "@/components/molecules/HoverDropdown";
import { API_URL } from "@/config/url";
import axiosInstance from "@/utils/axiosClient";
import UserDropdownMenu from "@/components/organisms/UserDropdownMenu";
interface IHeaderV2Props { }

const HeaderV2Ecommerce: React.FC<IHeaderV2Props> = (props) => {
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
  // Handle the hover modal visibility
  const [isHovered, setIsHovered] = useState(false);
  // Check if the access token exists
  const accessToken = localStorage.getItem("accessToken");


  return (
    <>
      <div className="fixed w-full shadow-lg pb-4  bg-white laptop:pb-0 border-b border-gray-200 z-50">
        <div className="w-full flex space-x-4  tablet:space-x-6 laptop:space-x-6 desktop:space-x-8 items-center px-4 py-4  justify-between laptop:justify-around">
          <div className="flex laptop:hidden  w-1/3 laptop:w-0">
            <button
              className="bg-gray-100 p-2 rounded-lg active:bg-gray-300"
              onClick={() => setOpenMobileDrawer(true)}
            >
              <Bars3Icon className="text-gray-500 font-bold w-5 h-5" />
            </button>
          </div>
          <Logo />
          <nav className="hidden laptop:flex space-x-6">
            <a href="/" className="text-gray-600 hover:text-orange-600">
              Trang chủ
            </a>
            <a href="/about" className="text-gray-600 hover:text-orange-600">
              Giới thiệu
            </a>

            <HoverDropdown buttonText="Sản phẩm" items={dropdownItems} />


            {/* Tư vấn dropdown */}
            <div className="relative group">
              <button className="text-black hover:text-orange-600 flex items-center relative">
                <span>Tư vấn</span>
                <ChevronDownIcon className="w-5 h-5 ml-1 text-black" />

                {/* Pseudo bridge */}
                <div className="absolute left-0 top-full w-full h-4 bg-transparent group-hover:block z-10"></div>
              </button>

              {/* Dropdown menu */}
              <div
                className="absolute left-[-75%] hidden w-40 mt-2 bg-white shadow-lg group-hover:block z-50 overflow-visible">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer"
                    onClick={() => router.push("/choose-mat")}
                  >
                    <span className="text-black hover:text-orange-600 text-sm">Chọn thảm yoga</span>
                  </li>
                  <li
                    onClick={() => router.push("/yoga-clothing")}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer">
                    <span className="text-black hover:text-orange-600 text-sm">Chọn quần áo yoga</span>
                  </li>
                  <li
                    onClick={() => router.push("/question")}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer">
                    <span className="text-black hover:text-orange-600 text-sm">Câu hỏi thường gặp - FAQ</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tin tức dropdown */}
            <div className="relative group">
              <button className="text-black hover:text-orange-600 flex items-center relative">
                {/* <span>Tin tức</span> */}
                {/* <ChevronDownIcon className="w-5 h-5 ml-1 text-black" /> */}

                {/* Pseudo bridge */}
                <div className="absolute left-0 top-full w-full h-4 bg-transparent group-hover:block z-10"></div>
              </button>

              {/* Dropdown menu */}
              <div
                className="absolute left-[-75%] hidden w-40 mt-2 bg-white shadow-lg group-hover:block z-50 overflow-visible">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer">
                    <span className="text-black hover:text-orange-600 text-sm">Khuyến mãi</span>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer">
                    <span className="text-black hover:text-orange-600 text-sm">Yoga và Thiền</span>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer">
                    <span className="text-black hover:text-orange-600 text-sm">Ebook yoga</span>
                  </li>
                </ul>
              </div>
            </div>

            <ButtonCourse className={"mt-[-12px]"} />
          </nav>
          <div>
            <NotificationsIcon className={"cursor-pointer"} onClick={() => router.push("/notification")} style={{ fontSize: '30px' }} />
          </div>

          <div className="flex w-1/3 laptop:hidden laptop:w-0 flex-row-reverse">
            {false ? null : (
              <div className="flex flex-row-reverse laptop:hidden  w-1/3 laptop:w-0">
                <FulfillmentMangement />
              </div>
            )}
          </div>

          <div className="hidden laptop:flex">
            <div className="hidden laptop:flex flex-end space-x-1 items-center justify-between w-64">

              <FulfillmentMangement />
              <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <button
                  className="rounded-xl px-4 py-2 text-center text-gray-600 text-sm w-fit flex space-x-1 items-center hover:bg-gray-100"
                >
                  <UserIcon className="w-8 h-8 text-gray-600" />
                </button>

                {/* Hover modal */}

                <UserDropdownMenu isHovered={isHovered} />

              </div>
              <CartButton />
            </div>

          </div>

        </div>
        {/*<div className="flex laptop:hidden px-2">*/}
        {/*  <SearchBar*/}
        {/*    placeholder="Search for anything, any words"*/}
        {/*    onChange={() => {*/}
        {/*    }}*/}
        {/*    onCategoryChange={() => {*/}
        {/*    }}*/}
        {/*    category=""*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
    </>
  );
};

export default HeaderV2Ecommerce;
