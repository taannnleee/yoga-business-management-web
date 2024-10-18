import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
} from "@mui/x-data-grid";
import MainLayout from "../../components/SIdeBar";
import { Button, Pagination, TablePagination } from "@mui/material";
import axios from "axios";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import { apiURL } from "../../config/constanst";

import ActionMenu from "./ActionMenu";
import { toast } from "react-toastify";
import LoadingSkeleton from "../../components/LoadingSkeleton";

interface IUser {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  address?: IAddress;
}

export interface IAddress {
  addressId: number;
  homeNumber: string;
  city: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
  };
  ward: {
    id: number;
    name: string;
  };
}

const UserManagement = () => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  const [users, setUsers] = React.useState<IUser[]>([]);

  const { user, accessToken } = useAppSelector(
    (state: IRootState) => state.auth
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(0);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      renderHeader: () => <div className="text-gray-800 font-bold">ID</div>,
    },
    {
      field: "username",
      headerName: "Tên người dùng",
      width: 250,
      renderHeader: () => (
        <div className="text-gray-800 font-bold">Tên người dùng</div>
      ),
    },
    {
      field: "role",
      headerName: "Vai trò",
      width: 250,
      renderCell: (params) => {
        switch (params.value) {
          case "admin":
            return (
              <p className="px-2 py-1 text-yellow-800 bg-yellow-50 rounded-full text-xs font-bold">
                Quản trị viên
              </p>
            );
          case "staff":
            return (
              <p className="px-2 py-1 text-blue-800 bg-blue-50 rounded-full text-xs font-bold">
                Nhân viên
              </p>
            );
          default:
            return (
              <p className="px-2 py-1 text-green-800 bg-green-50 rounded-full text-xs font-bold">
                Người dùng
              </p>
            );
        }
      },
    },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phoneNumber", headerName: "Số điện thoại", width: 200 },
    {
      field: "isActive",
      headerName: "Trạng thái",
      type: "string",
      width: 150,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<boolean>) =>
        params.value === true ? (
          <p className="px-2 py-1 text-green-800 bg-green-50 rounded-full text-xs font-bold">
            Đang hoạt động
          </p>
        ) : (
          <p className="px-2 py-1 text-red-800 bg-red-50 rounded-full text-xs font-bold">
            Đã bị khóa
          </p>
        ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      type: "string",
      width: 300,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<any>) => {
        const handleDeactivateUser = async (id: string | number) => {
          try {
            const payload = {
              isActive: false,
            };
            const response = await axios.put(
              `${apiURL}/profiles/${id}`,
              payload,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (response?.data?.success == true) {
              toast.success("Vô hiệu hóa tài khoản thành công");
              getAllUser({ addLoadingEffect: true });
            } else {
            }
          } catch (error) {
            console.log("error");
          }
        };

        const handleActivateUser = async (id: string | number) => {
          try {
            const payload = {
              isActive: true,
            };
            const response = await axios.put(
              `${apiURL}/profiles/${id}`,
              payload,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (response?.data?.success == true) {
              toast.success("Kích hoạt tài khoản thành công");
              getAllUser({ addLoadingEffect: false });
            } else {
            }
          } catch (error) {
            console.log("error");
          }
        };

        const options = [
          params?.row?.isActive == true
            ? {
                id: "deactivate",
                title: "Vô hiệu hóa tài khoản",
                onPress: () => handleDeactivateUser(params.row?.id),
                onActionSuccess: () => getAllUser({ addLoadingEffect: false }),
              }
            : {
                id: "activate",
                title: "Kích hoạt tài khoản",
                onPress: () => handleActivateUser(params.row?.id),
                onActionSuccess: () => getAllUser({ addLoadingEffect: false }),
              },
        ];
        return <ActionMenu options={options} />;
      },
    },
  ];

  const getAllUser = async (params?: { addLoadingEffect?: boolean }) => {
    const { addLoadingEffect } = params || {};
    try {
      addLoadingEffect && setLoading(true);
      const response = await axios.get(`http://localhost:4000/tenant/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success == true) {
        setUsers(response?.data?.data);
        setTotalPage(response?.data?._totalPage);
      }
    } catch (error) {
      console.log("GET USER ERROR", error);
    } finally {
      addLoadingEffect && setLoading(false);
    }
  };

  React.useEffect(() => {
    getAllUser({ addLoadingEffect: true });
  }, [page]);

  return (
    <MainLayout
      title="Quản lý người dùng"
      content={
        <div className="w-full flex flex-col gap-y-5 bg-white shadow-xl rounded-2xl">
          <div className="flex flex-row justify-between items-center">
            <div></div>
            <div className="flex flex-row gap-x-2">
              <Pagination
                onChange={(event, changedPage) => setPage(changedPage)}
                count={totalPage}
                defaultPage={1}
                page={page}
              />
            </div>
          </div>
          <div className="h-[800px] w-full">
            <DataGrid
              rows={users}
              loading={loading}
              paginationMode="server"
              page={page}
              rowCount={totalPage}
              pageSize={10}
              columns={columns}
              hideFooterPagination
              disableSelectionOnClick
              // onPageChange={(current) => setPage(current)}
              onSelectionModelChange={(newSelectionModel) => {
                setDeleteDisable(!deleteDisable);
                setSelectionModel(newSelectionModel);
              }}
              selectionModel={selectionModel}
              checkboxSelection={false}
            />
          </div>
        </div>
      }
    />
  );
};

export default UserManagement;
