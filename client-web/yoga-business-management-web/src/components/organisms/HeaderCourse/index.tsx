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
import CourseUserDropdownMenu from "@/components/organisms/CourseUserDropdownMenu";
import { RootState } from "@/redux/store";

import { useSelector, useDispatch } from "react-redux"; // Redux hooks
interface IHeaderV2Props { }

interface Medal {
  id: number;
  name: number;
  description: string;
  price: number;
  durationInDays: number;
  url: string;
}

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

  const [medal, setMedal] = useState<Medal>();
  const medal1 = useSelector((state: RootState) => state.membership.medal);
  const fetchMedal = async () => {
    try {
      const response = await axiosInstance.get(`/api/membership/type`);
      const data = response.data.data;
      setMedal(data);
      console.log("Medal data fetcheddd:", response.data.data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchMedal();
  }, []);

  return (
    <>
      <div className="fixed w-full shadow-lg pb-4  bg-white laptop:pb-0 border-b border-gray-200 z-[10000]">
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
            <a href="/course" className="text-gray-600 hover:text-orange-600">
              Trang chủ
            </a>
            <a href="/course/roadmap" className="text-gray-600 hover:text-orange-600">
              Lộ trình học
            </a>
            <a href="/course/trending" className="text-gray-600 hover:text-orange-600">
              Khám phá
            </a>
            <a href="/course/working-with-ai" className="text-gray-600 hover:text-orange-600">
              Luyện tập với AI
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
                <CourseUserDropdownMenu isHovered={isHovered} />

              </div>

              <CourseCartButton />
              <div className="w-10 h-10">
                <img src={medal?.url} alt="Yoga Image" />
              </div>


            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default HeaderV2Course;
