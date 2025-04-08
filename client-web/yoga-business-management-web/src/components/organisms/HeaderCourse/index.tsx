"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosClient";
import WishListCourseButton from "@/components/molecules/WishListCourseButton";
import CourseCartButton from "@/components/molecules/CourseCartButton";
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
  ChevronDownIcon
} from "@heroicons/react/24/solid";
import axios from "axios";
import SearchBar from "../../molecules/SearchBar";
import Logo from "@/components/atom/Logo";
import FulfillmentMangement from "../FulfillmentMangement";
import useDebounce from "@/hooks/useDebounce";
import Image from "next/image";
import LogoCourse from "@/components/atom/LogoCourse";
import ButtonShop from "@/components/atom/ButtonShop";
import UserDropdownMenu from "@/components/organisms/UserDropdownMenu";
interface IHeaderV2Props { }

const HeaderV2Course: React.FC<IHeaderV2Props> = (props) => {
  const router = useRouter();

  //state
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
  const [isHovered, setIsHovered] = useState(false);
  const clickInsideDropdown = useRef(false);



  return (
    <>
      <div className="fixed w-full shadow-lg pb-4  bg-white laptop:pb-0 border-b border-gray-200">
        <div className="w-full flex space-x-4  tablet:space-x-6 laptop:space-x-6 desktop:space-x-8 items-center px-4 py-4  justify-between laptop:justify-around">
          <div className="flex laptop:hidden  w-1/3 laptop:w-0">
            <button
              className="bg-gray-100 p-2 rounded-lg active:bg-gray-300"
              onClick={() => setOpenMobileDrawer(true)}
            >
              <Bars3Icon className="text-gray-500 font-bold w-5 h-5" />
            </button>
          </div>
          <LogoCourse />
          <nav className="hidden laptop:flex space-x-6">
            <a href="/" className="text-gray-600 hover:text-orange-600">
              Nhận ưu đãi
            </a>
            <a href="/" className="text-gray-600 hover:text-orange-600">
              Kích hoạt thẻ
            </a>
            <a href="/" className="text-gray-600 hover:text-orange-600">
              Khám phá
            </a>
            <a href="/" className="text-gray-600 hover:text-orange-600">
              Luyện tập
            </a>
            <ButtonShop className={"mt-[-14px]"} />
          </nav>


          <div className="hidden laptop:flex">
            <div className="hidden laptop:flex flex-end space-x-1 items-center justify-between w-64">

              <div className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                <button
                  className="rounded-xl px-4 py-2 text-center text-gray-600 text-sm w-fit flex space-x-1 items-center hover:bg-gray-100"
                  onClick={() => router.replace("/login")}
                >
                  <UserIcon className="w-8 h-8 text-gray-600" />
                </button>
                <UserDropdownMenu isHovered={isHovered} />

              </div>
              <WishListCourseButton />
              <CourseCartButton />
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default HeaderV2Course;
