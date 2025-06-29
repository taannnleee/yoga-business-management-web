import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '../../components/SIdeBar';
import { Button, Pagination, TablePagination } from '@mui/material';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../store';
import { apiURL } from '../../config/constanst';

import ActionMenu from './ActionMenu';
import { toast } from 'react-toastify';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import axiosInstance from 'utils/axiosClient';

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
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [users, setUsers] = React.useState<IUser[]>([]);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(0);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      renderHeader: () => <div className="font-bold text-gray-800">ID</div>,
    },
    {
      field: 'username',
      headerName: 'Tên đăng nhập',
      width: 250,
      renderHeader: () => <div className="font-bold text-gray-800">Tài khoản người dùng</div>,
    },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'roles',
      headerName: 'Vai trò',
      width: 250,
      renderCell: (params) => {
        switch (params.value) {
          case 'admin':
            return (
              <p className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-800">
                Quản trị viên
              </p>
            );
          case 'staff':
            return (
              <p className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">
                Nhân viên
              </p>
            );
          default:
            return (
              <p className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-800">
                Người dùng
              </p>
            );
        }
      },
    },

    { field: 'phone', headerName: 'Số điện thoại', width: 200 },
    { field: 'fullname', headerName: 'Tên người dùng', width: 200 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      type: 'string',
      width: 150,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params: GridRenderCellParams<boolean>) =>
        params.value === true ? (
          <p className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-800">
            Đang hoạt động
          </p>
        ) : (
          <p className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-800">
            Đã bị khóa
          </p>
        ),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      type: 'string',
      width: 300,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params: GridRenderCellParams<any>) => {
        const handleDeactivateUser = async (id: string | number) => {
          try {
            const response = await axiosInstance.put(`/api/admin/profiles/${id}`);
            console.log('response', response);
            if (response?.data?.status === 200) {
              toast.success('Vô hiệu hóa tài khoản thành công');
              getAllUser({ addLoadingEffect: true });
            } else {
              toast.error('Vô hiệu hóa tài khoản thất bại');
            }
          } catch (error) {
            console.log('error');
          }
        };

        const handleActivateUser = async (id: string | number) => {
          try {
            const response = await axiosInstance.put(`/api/admin/profiles/${id}`);
            if (response?.data?.status === 200) {
              toast.success('Kích hoạt tài khoản thành công');
              getAllUser({ addLoadingEffect: false });
            } else {
              toast.error('Kích hoạt tài khoản thất bại');
            }
          } catch (error) {
            console.log('error');
          }
        };

        const options = [
          params?.row?.status === true
            ? {
                id: 'deactivate',
                title: 'Vô hiệu hóa tài khoản',
                onPress: () => handleDeactivateUser(params.row?.id),
                onActionSuccess: () => getAllUser({ addLoadingEffect: false }),
              }
            : {
                id: 'activate',
                title: 'Kích hoạt tài khoản',
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

      const response = await axiosInstance.get('/api/admin/getAllUser');
      const result = await response.data;
      console.log('response user', result.data);
      if (response) {
        setUsers(result.data);
        // setTotalPage(response?.data?._totalPage);
      }
    } catch (error) {
      console.log('GET USER ERROR', error);
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
        <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white shadow-xl">
          <div className="flex flex-row items-center justify-between">
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
