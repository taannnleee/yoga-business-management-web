import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Typography,
    Select,
    MenuItem,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MainLayout from '../../components/SIdeBar';
import axios from 'axios';
import { apiURL } from '../../config/constanst';
import LoadingSkeleton from '../../components/LoadingSkeleton';

interface Course {
    id: string;
    name: string;
    description: string;
    imagePath?: string;
    duration: number;
    price?: number;
}

interface Teacher {
    id: string;
    fullName: string;
}

interface Topic {
    id: string;
    name: string;
    description: string;
}

const CourseManagement = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<string>('A-Z');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`${apiURL}/api/admin/all-course`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                setCourses(data.data);
            } catch (error) {
                setError("Error fetching courses: " + (error instanceof Error ? error.message : "Unknown error"));
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newSortOrder = event.target.value as string;
        setSortOrder(newSortOrder);
        const sortedCourses = [...courses].sort((a, b) =>
            newSortOrder === 'A-Z'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        );
        setCourses(sortedCourses);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout
            title="Quản lý khóa học"
            content={
                <Box sx={{ padding: 4 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h4">Khóa học</Typography>
                        <FormDialog />
                    </Box>

                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Select
                            value={sortOrder}
                            // onChange={handleSortChange}
                            size="small"
                        >
                            <MenuItem value="A-Z">A-Z</MenuItem>
                            <MenuItem value="Z-A">Z-A</MenuItem>
                        </Select>
                        <TextField
                            placeholder="Nhập tên khóa học"
                            size="small"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Box>

                    {loading ? (
                        <LoadingSkeleton />
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : filteredCourses.length === 0 ? (
                        <Typography color="textSecondary">Không tìm thấy khóa học nào.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {filteredCourses.map((course) => (
                                <Grid item xs={12} key={course.id}>
                                    <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 100, height: 100, borderRadius: 1 }}
                                            image={course.imagePath || 'https://via.placeholder.com/100'}
                                            alt={course.name}
                                        />
                                        <CardContent sx={{ flex: 1 }}>
                                            <Typography variant="h6">{course.name}</Typography>
                                            <Typography color="textSecondary">{course.description}</Typography>
                                            <Typography variant="body2" color="textSecondary">{`Thời lượng: ${course.duration} phút`}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Giá: {course.price ? `${course.price} VNĐ` : "Miễn phí"}
                                            </Typography>
                                        </CardContent>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <IconButton color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            }
        />
    );
};

const FormDialog = () => {
    const [open, setOpen] = React.useState(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // State để lưu các giá trị từ form
    const [courseName, setCourseName] = useState<string>('');
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (open) {
            fetchTeachers();
            fetchTopics();
        }
    }, [open]);

    const fetchTeachers = async () => {
        setLoadingTeachers(true);
        setError(null);
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${apiURL}/api/admin/all-teachers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });


            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setTeachers(data.data || []);
        } catch (error) {
            setError("Error fetching teachers: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setLoadingTeachers(false);
        }
    };

    const fetchTopics = async () => {
        setLoadingTeachers(true);
        setError(null);
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${apiURL}/api/admin/all-topic`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });


            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setTopics(data.data || []);
        } catch (error) {
            setError("Error fetching teachers: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setLoadingTeachers(false);
        }
    };


    const handleCreateCourse = async () => {
        try {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${apiURL}/api/admin/create-course`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: courseName,
                    teacherId: selectedTeacher,
                    topicId: selectedTopic,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create course');
            }

            setOpen(false); // Close dialog on success
            alert('Course created successfully');
        } catch (error) {
            setError("Error creating course: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                + Khóa học mới
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Nhập tên khóa học mới</DialogTitle>
                <DialogContent>
                    <FormControl sx={{ mr: 5, mt: 2 }}>
                        <FormLabel>Chọn chủ đề</FormLabel>
                        {loadingTeachers ? (
                            <Typography>Loading...</Typography>
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : (
                            <RadioGroup
                                name="teacher-selection"
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                            >
                                {topics.map((topic) => (
                                    <FormControlLabel
                                        key={topic.id}
                                        value={topic.name}
                                        control={<Radio />}
                                        label={topic.name}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                    </FormControl>

                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>Chọn giáo viên</FormLabel>
                        {loadingTeachers ? (
                            <Typography>Loading...</Typography>
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : (
                            <RadioGroup
                                name="teacher-selection"
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                            >
                                {teachers.map((teacher) => (
                                    <FormControlLabel
                                        key={teacher.id}
                                        value={teacher.id}
                                        control={<Radio />}
                                        label={teacher.fullName}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                    </FormControl>

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên khóa học"
                        type="text"
                        fullWidth
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleCreateCourse} >
                        Tạo khóa mới
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CourseManagement;
