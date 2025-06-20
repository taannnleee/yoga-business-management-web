import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { apiURL } from '../../config/constanst';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import FooterSection from '../../components/FooterSection';
import UploadWidget from '../../designs/UploadWidget';
import MainLayout from '../../components/SIdeBar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axiosInstance from 'utils/axiosClient';

interface SubCategory {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
  status: string;
}

const CategoryManagement: React.FC = () => {
  const [formData, setFormData] = useState<{ name: string }>({ name: '' });
  const [subcategoryName, setSubcategoryName] = useState<string>(''); // State cho subcategory
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]); // State lưu danh sách subcategory
  const [loadingSubCategories, setLoadingSubCategories] = useState(false); // State hiển thị loading

  // Dialog State
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [urlImage, setUrlImage] = useState<string>('');

  // Trạng thái lưu thông tin đã submit form hay chưa
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/admin/get-all-category`, {
        params: {
          page,
          limit: rowsPerPage,
        },
      });
      setCategories(response.data.data);
      setTotalCategories(response.data.totalCount); // Use total count from response
    } catch (error) {
      console.error('Failed to fetch categories', error);
      toast.error('Không thể tải danh mục.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [page, rowsPerPage]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitted(true); // Đặt trạng thái isSubmitted là true khi người dùng submit form
    if (!formData.name || formData.name.length > 50) {
      toast.error('Tên danh mục không được để trống và phải dưới 50 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(`/api/admin/add-category`, {
        name: formData.name,
        urlImage: urlImage,
      });
      toast.success('Tạo danh mục thành công!');
      setFormData({ name: '' });
      setIsSubmitted(false); // Reset lại trạng thái isSubmitted sau khi submit thành công
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category', error);
      toast.error('Đã có lỗi xảy ra khi tạo danh mục.');
    }
    setLoading(false);
  };

  const handleRowClick = (params: any) => {
    // Lưu cả id và name của category đã chọn
    setSelectedCategoryId(params.row.id);
    setSelectedCategoryName(params.row.name);
    fetchSubCategories(params.row.id); // Lưu tên của danh mục vào state
    setOpenDialog(true); // Mở dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategoryId(null); // Reset lại id khi đóng dialog
    setSelectedCategoryName(''); // Reset lại name khi đóng dialog
    setSubcategoryName(''); // Reset lại subcategory name
  };

  const handleSubmitSubcategory = async () => {
    if (!selectedCategoryId || !subcategoryName) {
      toast.error('Vui lòng nhập tên category phụ.');
      return;
    }
    if (subcategoryName.length > 50) {
      toast.error('Tên category phụ không được dài quá 50 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(`/api/admin/add-subcategory`, {
        name: subcategoryName,
        categoryId: selectedCategoryId,
      });
      toast.success('Tạo category phụ thành công!');
      setSubcategoryName(''); // Reset lại subcategory name sau khi thành công
      // setOpenDialog(false);
      fetchSubCategories(selectedCategoryId.toString());
    } catch (error) {
      console.error('Failed to create subcategory', error);
      toast.error('Đã có lỗi xảy ra khi tạo category phụ.');
    }
    setLoading(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Tên Danh Mục', width: 200 },
    { field: 'status', headerName: 'Trạng Thái', width: 150 },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 180,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="error"
            sx={{ ml: 1 }}
            onClick={(event) => handleDeleteCategory(params.row, event)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  // Hàm xử lý xóa
  const handleDeleteCategory = async (
    rowData: Category,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation(); // Dừng sự kiện chọn dòng khi nhấn nút xóa
    console.log('Xóa mục có ID:', rowData.id);
    console.log('Xóa danh mục');
    console.log(rowData.id);
    try {
      const response = await axiosInstance.get(`/api/admin/change-status-category/${rowData.id}`);

      toast.success('xóa danh mục thành công!');
      // const categoryId = selectedCategoryId!;
      fetchCategories();
    } catch (error) {
      console.error('Failed to xóa danh mục', error);
      toast.error('Đã có lỗi xảy ra khi xóa danh mục.');
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    setLoadingSubCategories(true); // Hiển thị loading
    try {
      const response = await axiosInstance.get(
        `/api/admin/get-all-subcategory-of-category/${categoryId}`,
      );
      setSubCategories(response.data.data); // Lưu danh sách subcategory
    } catch (error) {
      console.error('Failed to fetch subcategories', error);
      toast.error('Không thể tải danh sách subcategory.');
    }
    setLoadingSubCategories(false); // Tắt loading
  };

  const handleDeleSubCategory = async (categoryId1: string) => {
    console.log('Xóa danh mục phụ');
    console.log(categoryId1);
    try {
      const response = await axiosInstance.get(
        `/api/admin/change-status-sub-category/${categoryId1}`,
      );

      toast.success('Xóa danh mục phụ thành công!');
      const categoryId = selectedCategoryId!;
      fetchSubCategories(categoryId.toString());
    } catch (error) {
      console.error('Failed to xóa danh mục phụ', error);
      toast.error('Đã có lỗi xảy ra khi xóa danh mục phụ.');
    }
  };

  return (
    <MainLayout
      title="Quản lý danh mục"
      content={
        <>
          <Box padding={3}>
            <Box marginBottom={3}>
              <TextField
                label="Tên Danh Mục"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={isSubmitted && (!formData.name || formData.name.length > 50)} // Chỉ kiểm tra lỗi khi đã submit form
                helperText={
                  isSubmitted && !formData.name
                    ? 'Tên danh mục không được để trống.'
                    : isSubmitted && formData.name.length > 50
                      ? 'Tên danh mục không được dài quá 50 ký tự.'
                      : ''
                }
              />
              <UploadWidget
                setThumbnailUploaded={(image: string) => setUrlImage(image)}
                thumbnailUploaded={urlImage}
              />
            </Box>
            <Box marginTop={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || !formData.name || formData.name.length > 50 || !urlImage} // Kiểm tra urlImage
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Tạo Danh Mục'}
              </Button>
            </Box>

            {/* DataGrid */}
            <Box marginTop={5} height={400}>
              <DataGrid
                rows={categories}
                columns={columns}
                pageSize={rowsPerPage}
                rowCount={totalCategories}
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newRowsPerPage) => {
                  setRowsPerPage(newRowsPerPage);
                  setPage(0);
                }}
                loading={loading}
                onRowClick={handleRowClick}
              />
            </Box>
          </Box>

          {/* Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Chi tiết Danh Mục</DialogTitle>
            <DialogContent>
              <Box>
                {/* <p>ID: {selectedCategoryId}</p> */}
                <p>Tên Danh Mục: {selectedCategoryName}</p>

                {/* TextField cho category phụ */}
                <TextField
                  label="Tên danh mục phụ"
                  fullWidth
                  name="subcategoryName"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  margin="normal"
                  error={subcategoryName.length > 50} // Kiểm tra lỗi nếu dài quá 50 ký tự
                  helperText={
                    subcategoryName.length > 50
                      ? 'Tên category phụ không được dài quá 50 ký tự.'
                      : ''
                  }
                />

                <Box mt={2}>
                  <h3>Danh sách Danh Mục Phụ</h3>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Tên Danh Mục Phụ</TableCell>
                        <TableCell>Hành Động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subCategories.map((subcategory) => (
                        <TableRow key={subcategory.id}>
                          <TableCell>{subcategory.name}</TableCell>
                          <TableCell>{subcategory.name}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleDeleSubCategory(subcategory.id.toString())}
                              color="secondary"
                            >
                              Xóa
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Đóng
              </Button>
              <Button
                onClick={handleSubmitSubcategory}
                color="primary"
                disabled={loading || !subcategoryName || subcategoryName.length > 50}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Tạo danh mục phụ'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      }
    />
  );
};

export default CategoryManagement;
