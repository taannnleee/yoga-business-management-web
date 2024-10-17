"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import SearchBar from "../../molecules/SearchBar";
import Logo from "@/components/atom/Logo";
import FulfillmentMangement from "../FulfillmentMangement";
import useDebounce from "@/hooks/useDebounce";

interface IHeaderV2Props {}

const HeaderV2: React.FC<IHeaderV2Props> = (props) => {
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
  const clickInsideDropdown = useRef(false);

  const searchingByKeyword = async (keyword: string) => {
    try {
      const searchResponse = await axios.post(
        "http://localhost:4000/products/search",
        {
          keyword: keyword,
        }
      );

      if (searchResponse) {
        if (searchResponse?.data?.data?.length > 0) {
          setSearchResults(searchResponse?.data?.data);
        }
      }
    } catch (error) {
      console.log("searching error", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (debounceKeyword?.length > 0) {
      searchingByKeyword(debounceKeyword);
    }
  }, [debounceKeyword]);

  const handleItemClick = (item: any) => {
    let splits = (item?.name as string)?.split(" ");
    let final = "";

    const prefix = splits?.map((key: any, index: number) => {
      if (index == splits?.length - 1) {
        final = final + `${key}`;
      } else {
        final = final + `${key}-`;
      }
    });

    router.push(`/product-detail/${final}-${item?.upc}`);
  };

  return (
    <>
      <div className="w-full shadow-lg pb-4  bg-white laptop:pb-0 border-b border-gray-200">
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
          <div className="flex w-1/3 laptop:hidden laptop:w-0 flex-row-reverse">
            {false ? null : (
              <div className="flex flex-row-reverse laptop:hidden  w-1/3 laptop:w-0">
                <FulfillmentMangement />
              </div>
            )}
          </div>
          <div className="laptop:w-[500px] desktop:w-[700px] hidden laptop:flex">
            <SearchBar
              placeholder="Search for anything, any words"
              onChange={(value) => {
                setKeyword(value);
              }}
              onFocus={() => setOpenSearchDropdown(true)}
              onBlur={() => {
                if (!clickInsideDropdown.current) {
                  setOpenSearchDropdown(false);
                }
              }}
              onCategoryChange={() => {}}
              category=""
            />

            {openSearchDropDown && (
              <div
                className="absolute min-h-[150px] max-h-[400px] overflow-auto bottom-auto top-[80px] left-auto ml-4 px-4 py-4 flex gap-y-4 flex-col bg-white border-2 border-gray-50 shadow-md w-[600px] h-auto rounded-xl"
                onMouseDown={() => (clickInsideDropdown.current = true)}
                onMouseUp={() => (clickInsideDropdown.current = false)}
              >
                {searchResults?.length > 0 ? (
                  <>
                    {searchResults?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            handleItemClick(item);
                            setOpenSearchDropdown(false);
                          }}
                          className="flex items-center gap-x-4 cursor-pointer hover:opacity-80"
                        >
                          <div>
                            <img
                              src={item?.thumbnail}
                              className="w-[40px] h-[40px]"
                              alt={item?.name}
                            />
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm text-regular">
                              {item?.name}
                            </p>
                            <p className="mt-2 text-green-600 text-xs">
                              {item?.price?.displayPrice}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <h2 className="text-md text-gray-600 font-bold">
                      Các danh mục
                    </h2>
                    <div className="w-full flex flex-wrap gap-y-4 gap-x-2">
                      <div className="px-4 py-2 border-gray-300 border rounded-full text-sm text-gray-600 text-regular">
                        Coffee
                      </div>
                      <div className="px-4 py-2 border-gray-300 border rounded-full text-sm text-gray-600 text-regular">
                        Milk
                      </div>
                      <div className="px-4 py-2 border-gray-300 border rounded-full text-sm text-gray-600 text-regular">
                        Tea
                      </div>
                      <div className="px-4 py-2 border-gray-300 border rounded-full text-sm text-gray-600 text-regular">
                        Boba tea
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="hidden laptop:flex">
            <div className="hidden laptop:flex flex-end space-x-1 items-center justify-between w-64">
              <button
                className=" rounded-xl px-4 py-2 text-center text-gray-600  text-sm w-fit flex space-x-1 items-center hover:bg-gray-100"
                onClick={() => router.replace("/login")}
              >
                <UserIcon className="w-8 h-8 text-gray-600" />
              </button>
              <FulfillmentMangement />
              <button
                className=" rounded-xl px-4 py-2 text-center text-gray-600  text-sm w-fit flex space-x-1 items-center hover:bg-gray-100"
                onClick={() => router.replace("/login")}
              >
                <ShoppingCartIcon className="w-8 h-8 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex laptop:hidden px-2">
          <SearchBar
            placeholder="Search for anything, any words"
            onChange={() => {}}
            onCategoryChange={() => {}}
            category=""
          />
        </div>
      </div>
    </>
  );
};

export default HeaderV2;
