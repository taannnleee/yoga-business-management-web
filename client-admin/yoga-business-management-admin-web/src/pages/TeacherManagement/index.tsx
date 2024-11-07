import React, { useState, ChangeEvent } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Grid,
} from '@mui/material';
import Header from '../../components/Header';
import FooterSection from '../../components/FooterSection';
import axios from 'axios';
import { apiURL } from '../../config/constanst';

interface TeacherData {
    fullName: string;
    email: string;
    phoneNumber: string;
    experienceYears: number | string;
    profilePicture: File | null;
}

const TeacherManagement: React.FC = () => {
    const [formData, setFormData] = useState<TeacherData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        experienceYears: '',
        profilePicture: null
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'profilePicture' && files) {
            const file = files[0];
            setFormData({
                ...formData,
                profilePicture: file,
            });
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData({
                ...formData,
                [name]: name === 'experienceYears' ? Number(value) : value,
            });
        }
    };

    const handleSubmit = async () => {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                formDataToSend.append(key, value);
            }
        });

        try {
            const response = await axios.post(`${apiURL}/api/auth/login`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                alert('Giáo viên đã được tạo thành công');
            }
        } catch (error) {
            console.error('Lỗi khi tạo giáo viên:', error);
            alert('Lỗi khi tạo giáo viên');
        }
    };

    return (
        <>
            <Header title="Quản lý giáo viên" />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Thêm Giáo Viên</Typography>
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
                        <Button
                            variant="contained"
                            component="label"
                        >
                            Upload Ảnh Đại Diện
                            <input
                                type="file"
                                name="profilePicture"
                                hidden
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </Button>
                        {previewImage && (
                            <Box mt={2}>
                                <img src={previewImage} alt="Ảnh Đại Diện" width="100" height="100" />
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Tạo Giáo Viên
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <FooterSection />
        </>
    );
};

export default TeacherManagement;
