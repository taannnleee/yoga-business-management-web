import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, Typography, Button, TextField, Grid, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Header from '../../components/Header';
import FooterSection from '../../components/FooterSection';
import axios from 'axios';
import { apiURL } from '../../config/constanst';
import { toast } from 'react-toastify';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface FormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    experienceYears: number;
    profilePicture: File | null;
}

interface Teacher {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    experienceYears: number;
    profilePicture: string;
}

const TeacherManagement: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        experienceYears: 0,
        profilePicture: null,
    });
    const [previewImage, setPreviewImage] = useState<string>('https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png');
    const [loading, setLoading] = useState<boolean>(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [totalTeachers, setTotalTeachers] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    // Fetch teachers from the API
    const fetchTeachers = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.get(`${apiURL}/api/admin/all-teachers`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    page,
                    limit: rowsPerPage,
                },
            });
            setTeachers(response.data.data);
            setTotalTeachers(response.data.total);
        } catch (error) {
            console.error('Failed to fetch teachers', error);
            toast.error('Không thể tải danh sách giáo viên.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTeachers();
    }, [page, rowsPerPage]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;
        if (type === 'file' && files) {
            const file = files[0];
            setFormData(prevData => ({ ...prevData, profilePicture: file }));
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleImageUpload = async (): Promise<string | null> => {
        const accessToken = localStorage.getItem('accessToken');
        if (formData.profilePicture) {
            const formDataObj = new FormData();
            formDataObj.append('file', formData.profilePicture);

            try {
                const response = await axios.post<{ data: { url: string } }>(
                    `${apiURL}/api/image/upload`,
                    formDataObj,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                return response.data.data.url;
            } catch (error) {
                console.error('Image upload failed', error);
                return null;
            }
        }
        return null;
    };

    const handleSubmit = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        const imageUrl = await handleImageUpload();

        if (imageUrl) {
            const teacherData = {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                experienceYears: formData.experienceYears,
                profilePicture: imageUrl,
            };

            try {
                const response = await axios.post(`${apiURL}/api/admin/add-teacher`, teacherData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                toast.success('Tạo Giáo Viên thành công!');
                setFormData({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    experienceYears: 0,
                    profilePicture: null,
                });
                setPreviewImage('https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png'); // Reset preview image
                fetchTeachers();
            } catch (error) {
                console.error('Teacher creation failed', error);
                toast.error('Đã có lỗi xảy ra khi tạo giáo viên.');
            }
        } else {
            toast.error('Vui lòng tải ảnh đại diện.');
        }

        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const accessToken = localStorage.getItem('accessToken');
        setLoading(true);
        try {
            await axios.delete(`${apiURL}/api/admin/delete-teacher/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            toast.success('Xóa giáo viên thành công!');
            fetchTeachers();
        } catch (error) {
            console.error('Delete failed', error);
            toast.error('Đã có lỗi xảy ra khi xóa giáo viên.');
        }
        setLoading(false);
    };

    const handleEdit = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setFormData({
            fullName: teacher.fullName,
            email: teacher.email,
            phoneNumber: teacher.phoneNumber,
            experienceYears: teacher.experienceYears,
            profilePicture: null,
        });
        setPreviewImage(teacher.profilePicture);
        setEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (selectedTeacher) {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const imageUrl = await handleImageUpload();

            const updatedTeacherData = {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                experienceYears: formData.experienceYears,
                profilePicture: imageUrl || selectedTeacher.profilePicture,
            };

            try {
                await axios.put(`${apiURL}/api/admin/update-teacher/${selectedTeacher.id}`, updatedTeacherData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                toast.success('Cập nhật giáo viên thành công!');
                fetchTeachers();
                setEditDialogOpen(false);
            } catch (error) {
                console.error('Update failed', error);
                toast.error('Đã có lỗi xảy ra khi cập nhật giáo viên.');
            }
            setLoading(false);
        }
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const columns: GridColDef[] = [
        {
            field: 'profilePicture',
            headerName: 'Ảnh',
            width: 100,
            renderCell: (params) => (
                <img
                    src={params.value || 'https://via.placeholder.com/100'}
                    alt={params.row.fullName}
                    width="50"
                    height="50"
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                />
            ),
        },
        {
            field: 'fullName',
            headerName: 'Họ và Tên',
            width: 200,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
        },
        {
            field: 'phoneNumber',
            headerName: 'Số Điện Thoại',
            width: 150,
        },
        {
            field: 'experienceYears',
            headerName: 'Kinh Nghiệm',
            width: 150,
            valueFormatter: (params) => `${params.value} năm`,
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 180,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" color="primary" onClick={() => handleEdit(params.row)}>
                        Cập Nhật
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                        sx={{ ml: 1 }}
                    >
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <Header title="Quản lý giáo viên" />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Thêm Giáo Viên
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Họ và Tên"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Số Điện Thoại"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Số Năm Kinh Nghiệm"
                            name="experienceYears"
                            type="number"
                            value={formData.experienceYears}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                backgroundColor: '#f0f0f0',
                                cursor: 'pointer',
                                overflow: 'hidden',
                            }}
                            onClick={() => document.getElementById('profile-picture-input')?.click()}
                        >
                            <img
                                src={previewImage || ""}
                                alt="Ảnh Đại Diện"
                                width="100"
                                height="100"
                                style={{ objectFit: 'cover' }}
                            />
                        </Box>
                        <input
                            type="file"
                            id="profile-picture-input"
                            name="profilePicture"
                            hidden
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                            Tạo Giáo Viên
                        </Button>
                    </Grid>
                </Grid>

                {/* Teacher list using DataGrid */}
                <Box sx={{ mt: 4, height: 400, width: '100%' }}>
                    <DataGrid
                        rows={teachers}
                        columns={columns}
                        pageSize={rowsPerPage}
                        rowsPerPageOptions={[5]}
                        getRowId={(row) => row.id.toString()}
                        onPageChange={handleChangePage}
                        onPageSizeChange={handleChangeRowsPerPage}
                        pagination
                    />
                </Box>
            </Box>

            {/* Update Teacher Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Cập Nhật Giáo Viên</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Họ và Tên"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Số Điện Thoại"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Kinh Nghiệm"
                                name="experienceYears"
                                value={formData.experienceYears}
                                onChange={handleChange}
                                type="number"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">Hủy</Button>
                    <Button
                        onClick={handleUpdate}
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Cập Nhật"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Full-screen spinner */}
            {loading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                    }}
                >
                    <CircularProgress size={60} color="inherit" />
                </Box>
            )}

            <FooterSection />
        </>
    );
};

export default TeacherManagement;
