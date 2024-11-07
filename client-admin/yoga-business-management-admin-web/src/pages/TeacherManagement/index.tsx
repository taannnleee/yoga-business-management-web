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

interface FormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    experienceYears: number;
    profilePicture: File | null;
}

const TeacherManagement: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        experienceYears: 0,
        profilePicture: null,
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;

        if (type === "file" && files) {
            const file = files[0];
            setFormData(prevData => ({ ...prevData, profilePicture: file }));
            setPreviewImage(URL.createObjectURL(file));  // Preview uploaded image
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
                            Authorization: `Bearer ${accessToken}`, // Add token to headers
                        },
                    }
                );
                return response.data.data.url;  // Assuming the API returns the image URL in `data.url`
            } catch (error) {
                console.error("Image upload failed", error);
                return null;
            }
        }
        return null;
    };

    const handleSubmit = async () => {
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
                const response = await axios.post(
                    `${apiURL}/api/admin/add-teacher`,
                    teacherData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`, // Add token to headers
                        },
                    }
                );
                console.log("Teacher created successfully:", response.data);
                alert("Tạo Giáo Viên thành công!");
            } catch (error) {
                console.error("Teacher creation failed", error);
                alert("Đã có lỗi xảy ra khi tạo giáo viên.");
            }
        } else {
            alert("Vui lòng tải ảnh đại diện.");
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
