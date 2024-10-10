import React from "react";
import { TruckIcon } from "@heroicons/react/24/solid";
import { Divider, Popover } from "@mui/material";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

interface IFulfillmentMangementProps {}

const FulfillmentMangement: React.FC<IFulfillmentMangementProps> = (props) => {
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenPopup(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenPopup(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="p-2 text-black-500 rounded-full bg-transparent justify-center items-center flex border border-gray-100"
      >
        <TruckIcon className="w-8 h-8 text-gray-600 mr-1" />
        Store 7
      </button>

      <Popover
        open={openPopup}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: -14, horizontal: "center" }}
        sx={{ width: "200px", height: "500px" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "var(--border-radius-large, 16px)",
              overflow: "visible",
              maxWidth: 327,
              boxShadow: "0px 8px 28px 0px rgba(0, 0, 0, 0.28)",
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: "50%",
                left: "50%",
                width: 20,
                height: 20,
                backgroundColor: "rgb(249 250 251)",
                transform: "translateY(-50%) rotate(45deg)",
                boxShadow: "-3px -3px 5px -2px rgba(0,0,0,0.1)",
              },
            },
          },
        }}
      >
        <div className="w-[280px] border border-gray-100 min-h-[400px] shadow-sm bg-gray-50 px-4 py-8 rounded-lg flex flex-col gap-y-4">
          <div>
            <p className="text-gray-500 text-sm font-normal">
              You are shopping at
            </p>
            <strong className="text-gray-600 text-lg">Store 7</strong>
          </div>

          <Divider sx={{ height: 4, width: "100%", margin: "4px 0" }} />

          <div>
            <p className="text-gray-600 text-sm font-semibold">
              Open until 10:00 pm
            </p>
            <strong className="text-gray-500 font-normal text-sm">
              5201 4th St #7, Lubbock, TX 79416
            </strong>
          </div>

          <a className="no-underline text-gray-700 text-sm font-semibold cursor-pointer hover:underline">
            Store Detail
          </a>

          <Divider sx={{ height: 4, width: "100%", margin: "4px 0" }} />

          <div>
            <div className="flex items-center gap-x-2">
              <ShoppingBagIcon className="w-8 h-8 text-gray-500" />
              <div>
                <p className="text-gray-600 text-sm font-semibold">
                  Free for orders over $30{" "}
                </p>
                <p className="text-sm text-gray-500 font-normal">
                  Varies by location
                </p>
              </div>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default FulfillmentMangement;
