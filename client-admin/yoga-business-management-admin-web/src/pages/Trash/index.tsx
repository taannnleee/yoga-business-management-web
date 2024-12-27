import * as React from 'react';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import { toast } from 'react-toastify';
import ActionMenu from '../../components/ActionMenu';
import { apiURL } from '../../config/constanst';
import Spinner from '../../components/Spinner';
import MainLayout from '../../components/SIdeBar';

const TrashStoreProductManagement = () => {
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [actionLoading, setActionLoading] = React.useState<boolean>(false);
  const [productToRestore, setProductToRestore] = React.useState<IProduct | null>(null);
  const [openRestoreConfirmModal, setOpenRestoreConfirmModal] = React.useState<boolean>(false);

  const accessToken = localStorage.getItem('accessToken');

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/api/admin/get-all-product?page=${page}&size=10&status=false`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response?.data?.status === 200) {
        console.log("tanle")
        console.log(response.data.data.content);
        setProducts(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Không thể tải sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  // Chức năng khôi phục sản phẩm
  const restoreProduct = async (productId: string | number) => {
    try {
      setActionLoading(true);
      const response = await axios.get(`${apiURL}/api/admin/change-status/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response?.data?.status === 200) {
        toast.success('Khôi phục sản phẩm thành công');
        getAllProducts();  // Reload products list
      } else {
        toast.error('Khôi phục sản phẩm không thành công');
      }
    } catch (error) {
      console.error('Failed to restore product:', error);
      toast.error('Đã có lỗi khi khôi phục sản phẩm');
    } finally {
      setActionLoading(false);
      setOpenRestoreConfirmModal(false); // Close restore modal
    }
  };

  React.useEffect(() => {
    getAllProducts();
  }, [page]);

  const columns: GridColDef[] = [
    {
      field: 'upc',
      headerName: 'Mã sản phẩm',
      width: 200,
      renderCell: (params) => <div>{params.row.code}</div>,
    },
    {
      field: 'name',
      headerName: 'Tên sản phẩm',
      width: 250,
      renderCell: (params) => <div>{params.row.title}</div>,
    },
    {
      field: 'price',
      headerName: 'Giá bán',
      width: 200,
      renderCell: (params) => <div>{params.row.price.toLocaleString()} VND</div>,
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 150,
      renderCell: (params) => <div>{new Date(params.row.createdAt).toLocaleDateString()}</div>,
    },
    {
      field: 'updatedAt',
      headerName: 'Ngày cập nhật',
      width: 150,
      renderCell: (params) => <div>{new Date(params.row.updatedAt).toLocaleDateString()}</div>,
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 300,
      renderCell: (params) => {
        const options = [
          {
            id: 'restore',
            title: 'Khôi phục sản phẩm',
            onPress: () => {
              setProductToRestore(params.row);
              setOpenRestoreConfirmModal(true);
            },
            onActionSuccess: () => getAllProducts(),
          },
        ];
        return actionLoading ? (
          <Spinner size={20} />
        ) : (
          <ActionMenu options={options} />
        );
      },
    },
  ];

  return (
    <>
      <MainLayout
        title="Danh sách sản phẩm đã xóa"
        content={
          <>
            <div className="mb-6 flex w-full items-center justify-between gap-y-2">
              <div className="flex items-center"></div>
            </div>
            <DataGrid
              loading={isLoading}
              rows={products}
              paginationMode="server"
              page={page}
              rowCount={totalPages * 10}
              pageSize={10}
              columns={columns}
              hideFooterPagination
              disableSelectionOnClick
              // onSelectionModelChange={(newSelectionModel) => {
              //   setDeleteDisable(!deleteDisable);
              //   setSelectionModel(newSelectionModel);
              // }}
              selectionModel={selectionModel}
              checkboxSelection={false}
              style={{ height: 500, width: '100%' }}
              className="custom-data-grid"
            />
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, page) => setPage(page)}
            />
          </>
        }
      />

      {/* Modal xác nhận khôi phục */}
      {openRestoreConfirmModal && (
        <Dialog open={openRestoreConfirmModal} onClose={() => setOpenRestoreConfirmModal(false)}>
          <DialogTitle>Khôi phục sản phẩm</DialogTitle>
          <DialogContent>
            <p>Bạn có chắc chắn muốn khôi phục sản phẩm này không?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRestoreConfirmModal(false)} color="primary">
              Không
            </Button>
            <Button
              onClick={() => {
                if (productToRestore) restoreProduct(productToRestore.id);
              }}
              color="primary"
            >
              Có
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default TrashStoreProductManagement;
