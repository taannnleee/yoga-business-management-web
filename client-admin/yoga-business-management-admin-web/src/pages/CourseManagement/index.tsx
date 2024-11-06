import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  SelectChangeEvent,
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
  level: string;
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
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

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
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data.data);
      } catch (error) {
        setError(
          'Error fetching courses: ' + (error instanceof Error ? error.message : 'Unknown error'),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const newSortOrder = event.target.value;
    setSortOrder(newSortOrder);
    const sortedCourses = [...courses].sort((a, b) =>
      newSortOrder === 'A-Z' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );
    setCourses(sortedCourses);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const openDialog = (course?: Course) => {
    setSelectedCourse(course || undefined);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedCourse(undefined);
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <MainLayout
      title="Quản lý khóa học"
      content={
        <Box sx={{ padding: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4">Khóa học</Typography>
            <Button variant="contained" color="primary" onClick={() => openDialog()}>
              + Khóa học mới
            </Button>
          </Box>

          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Select value={sortOrder} onChange={handleSortChange} size="small">
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
                    <CardContent
                      sx={{ flex: 1 }}
                      component={Link}
                      to={`/course-detail/${course.id}`}
                    >
                      <Typography variant="h6">{course.name}</Typography>
                      <Typography color="textSecondary">{course.description}</Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                      >{`Thời lượng: ${course.duration} phút`}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Giá: {course.price ? `${course.price} VNĐ` : 'Miễn phí'}
                      </Typography>
                    </CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton color="primary" onClick={() => openDialog(course)}>
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
          <FormDialog
            open={isDialogOpen}
            onClose={closeDialog}
            course={selectedCourse}
            onSave={() => setCourses([...courses])}
          />
        </Box>
      }
    />
  );
};

const FormDialog = ({
  open,
  onClose,
  course,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  course?: Course;
  onSave: () => void;
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [courseName, setCourseName] = useState(course?.name || '');
  const [instruction, setInstruction] = useState(course?.description || '');
  const [description, setDescription] = useState(course?.description || '');
  const [duration, setDuration] = useState(course?.duration.toString() || '');
  const [imagePath, setImagePath] = useState(course?.imagePath || '');
  const [level, setLevel] = useState(course?.level || '');
  const [videoPath, setVideoPath] = useState('');
  const [price, setPrice] = useState(course?.price ? course.price.toString() : '');

  const isEditMode = !!course;

  const handleSaveCourse = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const url = isEditMode
        ? `${apiURL}/api/admin/update-course/${course?.id}`
        : `${apiURL}/api/admin/add-course`;
      const method = isEditMode ? 'PUT' : 'POST';

      await axios({
        url,
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          name: courseName,
          instruction,
          description,
          duration,
          imagePath,
          level,
          videoPath,
          price,
        },
      });

      onClose();
      onSave();
      alert(isEditMode ? 'Course updated successfully' : 'Course created successfully');
    } catch (error) {
      setError(
        'Error saving course: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  };

  useEffect(() => {
    if (open) {
      setCourseName(course?.name || '');
      setInstruction(course?.description || '');
      setDescription(course?.description || '');
      setDuration(course?.duration.toString() || '');
      setImagePath(course?.imagePath || '');
      setPrice(course?.price ? course.price.toString() : '');
      // Fetch teachers and topics here
    }
  }, [open, course]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditMode ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          autoFocus
          margin="dense"
          label="Tên khóa học"
          type="text"
          fullWidth
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Hướng dẫn"
          type="text"
          fullWidth
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Mô tả"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Thời gian (phút)"
          type="number"
          fullWidth
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Đường dẫn hình ảnh"
          type="text"
          fullWidth
          value={imagePath}
          onChange={(e) => setImagePath(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Cấp độ"
          type="number"
          fullWidth
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Đường dẫn video"
          type="text"
          fullWidth
          value={videoPath}
          onChange={(e) => setVideoPath(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Giá"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSaveCourse}>{isEditMode ? 'Lưu' : 'Tạo khóa mới'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseManagement;
