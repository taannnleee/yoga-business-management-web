import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MainLayout from '../../components/SIdeBar';
import { toast } from 'react-toastify';
import { apiURL } from '../../config/constanst';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from 'utils/axiosClient';

interface ITopic {
  id: number;
  name: string;
  description: string;
}

const TopicManagement = () => {
  const [topic, setTopic] = useState<ITopic>({ id: 0, name: '', description: '' });
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [open, setOpen] = useState(false); // State to control modal visibility

  // Function to handle input change in form
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTopic((prevTopic) => ({ ...prevTopic, [name]: value }));
  };

  // Function to handle form submission (create new topic)
  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post(`/api/admin/add-topic`, {
        body: JSON.stringify(topic),
      });

      if (response?.data?.status === 200) {
        toast.success('Chủ đề được tạo thành công!');
        // Clear form fields after submission
        setTopic({ id: 0, name: '', description: '' });
        // Fetch updated topics
        fetchTopics();
      } else {
        toast.error('Có lỗi xảy ra khi tạo chủ đề.');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo chủ đề.');
      console.error(error);
    }
  };

  // Fetch all topics from API
  const fetchTopics = async () => {
    try {
      const response = await axiosInstance.get(`/api/admin/all-topic`);

      if (response?.data?.status === 200 && response?.data?.data) {
        setTopics(response.data.data);
        console.log('Fetched topics:', response.data.data);
      } else {
        toast.error('Không có dữ liệu chủ đề.');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách chủ đề.');
      console.error(error);
    }
  };

  // Function to handle delete topic
  const handleDelete = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/delete-topic/${id}`);

      if (response?.data?.status === 200) {
        toast.success('Chủ đề đã được xóa thành công!');
        fetchTopics();
      } else {
        toast.error('Có lỗi xảy ra khi xóa chủ đề.');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa chủ đề.');
      console.error(error);
    }
  };

  // Function to handle update topic (open modal and set data)
  const handleUpdate = (id: number) => {
    const topicToUpdate = topics.find((t) => t.id === id);
    if (topicToUpdate) {
      setTopic(topicToUpdate);
      setOpen(true); // Open the modal for update
    }
  };

  // Function to handle update topic submission
  const handleUpdateSubmit = async () => {
    try {
      const response = await axiosInstance.put(`/api/admin/update-topic/${topic.id}`, topic);

      if (response?.data?.status === 200) {
        toast.success('Chủ đề đã được cập nhật!');
        setOpen(false); // Đóng modal
        fetchTopics(); // Reload danh sách
      } else {
        toast.error(response?.data?.message || 'Có lỗi xảy ra khi cập nhật chủ đề.');
      }
    } catch (error) {
      console.error('Update topic error:', error);
      toast.error('Có lỗi xảy ra khi cập nhật chủ đề.');
    }
  };

  // Fetch topics on component load
  useEffect(() => {
    fetchTopics();
  }, []);

  // Columns for DataGrid
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Tên Chủ Đề', width: 200 },
    { field: 'description', headerName: 'Mô Tả', width: 300 },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => handleUpdate(params.row.id)} // Open modal for update
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => handleDelete(params.row.id)} // Call handleDelete when clicked
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <MainLayout
      title="Quản lý chủ đề"
      content={
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Thêm Chủ Đề
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên Chủ Đề"
                name="name"
                value={topic.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô Tả"
                name="description"
                value={topic.description}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Tạo Chủ Đề
              </Button>
            </Grid>
          </Grid>

          <Typography variant="h5" gutterBottom>
            Danh Sách Chủ Đề
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={topics}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.id.toString()} // Ensure each row has a unique ID
            />
          </Box>

          {/* Modal for updating topic */}
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Cập Nhật Chủ Đề</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Tên Chủ Đề"
                name="name"
                value={topic.name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Mô Tả"
                name="description"
                value={topic.description}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="secondary">
                Hủy
              </Button>
              <Button onClick={handleUpdateSubmit} color="primary">
                Cập Nhật
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default TopicManagement;
