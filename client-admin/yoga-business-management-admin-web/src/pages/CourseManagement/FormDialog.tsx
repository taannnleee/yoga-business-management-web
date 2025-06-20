import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { apiURL } from '../../config/constanst';
import { Course } from '../../types/course';
import { Teacher } from '../../types/teacher';
import { Topic } from '../../types/topic';
import UploadWidget from '../../designs/UploadWidget';
import UploadVideoWidget from '../../designs/UploadVideoWidget';
import { toast } from 'react-toastify';
import axiosInstance from 'utils/axiosClient';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  course?: Course;
  onSave: () => void;
}

const FormDialog = ({ open, onClose, course, onSave }: FormDialogProps) => {
  const [courseName, setCourseName] = useState(course?.name || '');
  const [description, setDescription] = useState(course?.description || '');
  const [duration, setDuration] = useState<string>('');
  const [imagePath, setImagePath] = useState(course?.imagePath || '');
  const [price, setPrice] = useState(course?.price ? course.price.toString() : '');
  const [level, setLevel] = useState(course?.level ? course.level.toString() : '');
  const [videoPath, setVideoPath] = useState(course?.videoPath || '');
  const [instruction, setInstruction] = useState(course?.instruction || '');
  const [selectedTopic, setSelectedTopic] = useState(course?.topicId || '');
  const [selectedTeacher, setSelectedTeacher] = useState(course?.teacherId || '');
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!course;

  useEffect(() => {
    if (open) {
      fetchTeachers();
      fetchTopics();
    }
  }, [open]);
  useEffect(() => {
    if (isEditMode && course) {
      setSelectedTopic(course.topicId?.toString() || '');
      setSelectedTeacher(course.teacherId?.toString() || '');
      console.log('Course in edit mode:', course);
      console.log('Selected Topic:', selectedTopic);
    }
  }, [isEditMode, course]);

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/api/admin/all-teachers`);
      setTeachers(response.data.data || []);
    } catch (error) {
      setError(
        'Error fetching teachers: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
      setLoadingTeachers(false);
    }
  };

  const fetchTopics = async () => {
    setLoadingTeachers(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/api/admin/all-topic`);
      setTopics(response.data.data || []);
    } catch (error) {
      setError(
        'Error fetching topics: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const url = isEditMode ? `/api/admin/update-course/${course?.id}` : `/api/admin/add-course`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await axiosInstance({
        url,
        method,
        data: {
          name: courseName,
          description,
          duration,
          imagePath,
          price,
          level,
          videoPath,
          instruction,
          topicId: selectedTopic,
          teacherId: selectedTeacher,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(isEditMode ? 'Course updated successfully' : 'Course created successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
        onClose();
        onSave();
      } else {
        toast.error('Course update failed', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      setError('Error saving course');
      toast.error('Error saving course', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleSetVideoDuration = (duration: string) => {
    setDuration(duration);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditMode ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}

        {/* Select Topic */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Chọn chủ đề</InputLabel>
          {loadingTeachers ? (
            <CircularProgress size={24} />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Select
              value={selectedTopic || ''} // Tránh undefined
              onChange={(e) => setSelectedTopic(e.target.value)}
              label="Chọn chủ đề"
            >
              {topics.map((topic) => (
                <MenuItem key={topic.id} value={topic.id}>
                  {topic.name}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>

        {/* Select Teacher */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Chọn giáo viên</InputLabel>
          {loadingTeachers ? (
            <CircularProgress size={24} />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              label="Chọn giáo viên"
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.fullName}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>

        {/* Course Information */}
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

        {/* Upload Image */}
        <UploadWidget
          setThumbnailUploaded={(image: string) => setImagePath(image)}
          thumbnailUploaded={imagePath}
        />

        <TextField
          margin="dense"
          label="Cấp độ"
          type="number"
          fullWidth
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />

        {/* Upload Video */}
        <UploadVideoWidget
          setThumbnailUploaded={(image: string) => setVideoPath(image)}
          thumbnailUploaded={videoPath}
          setVideoDuration={handleSetVideoDuration}
          videoDuration={duration}
        />
        {/*<TextField*/}
        {/*  margin="dense"*/}
        {/*  label="Giá"*/}
        {/*  type="number"*/}
        {/*  fullWidth*/}
        {/*  value={price}*/}
        {/*  onChange={(e) => setPrice(e.target.value)}*/}
        {/*/>*/}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleCreateCourse}>{isEditMode ? 'Lưu' : 'Tạo khóa mới'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
