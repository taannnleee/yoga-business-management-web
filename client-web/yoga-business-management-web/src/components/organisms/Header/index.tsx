"use client";

import React, { useState } from "react";

//design

import { Bars4Icon, UserPlusIcon } from "@heroicons/react/20/solid";
import {
  Bars3Icon,
  ShoppingCartIcon,
  TruckIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

//hooks
import { useRouter } from "next/navigation";

import axios from "axios";
import { Box, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import SearchBar from "../../molecules/SearchBar";
import Logo from "@/components/atom/Logo";
import FulfillmentMangement from "../FulfillmentMangement";

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

  return (
    <>
      <div className="w-full shadow-lg pb-4 laptop:pb-0 border-b border-gray-100">
        <div className="w-full flex space-x-4 tablet:space-x-6 laptop:space-x-6 desktop:space-x-8 items-center px-4 py-4  justify-between laptop:justify-around">
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
              onChange={() => {}}
              onCategoryChange={() => {}}
              category=""
            />
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
