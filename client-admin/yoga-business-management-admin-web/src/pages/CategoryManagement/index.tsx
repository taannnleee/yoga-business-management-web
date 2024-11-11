import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, Button, TextField, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { apiURL } from '../../config/constanst';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import FooterSection from '../../components/FooterSection';

interface Category {
  id: number;
  name: string;
  status: string;
}

const CategoryManagement: React.FC = () => {
  const [formData, setFormData] = useState<{ name: string }>({ name: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const fetchCategories = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`${apiURL}/api/admin/get-all-category`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page,
          limit: rowsPerPage,
        },
      });
      setCategories(response.data.data);
      setTotalCategories(response.data.data.length);
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
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    try {
      await axios.post(
        `${apiURL}/api/admin/add-category`,
        { name: formData.name },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success('Tạo danh mục thành công!');
      setFormData({ name: '' });
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category', error);
      toast.error('Đã có lỗi xảy ra khi tạo danh mục.');
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
      renderCell: () => (
        <>
          <Button variant="outlined" color="primary">
            Cập Nhật
          </Button>
          <Button variant="outlined" color="error" sx={{ ml: 1 }}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Header title="Quản lý danh mục" />
      <Box padding={3}>
        <Box marginBottom={3}>
          <TextField
            label="Tên Danh Mục"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Box>
        <Box marginTop={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !formData.name}
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
          />
        </Box>
      </Box>

      <FooterSection />
    </>
  );
};

export default CategoryManagement;
