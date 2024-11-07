import React, { useEffect, useState } from 'react';
import UploadWidget from '../../designs/UploadWidget';
import UploadMultipleWidget from '../../designs/UploadMultipleWidget';
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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import axios from 'axios';
import { apiURL } from '../../config/constanst';
import { Course } from '../../types/course';
import { Teacher } from '../../types/teacher';
import { Topic } from '../../types/topic';
import UploadVideoWidget from '../../designs/UploadVideoWidget';
import { toast } from 'react-toastify';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  course?: Course;
  onSave: () => void;
}

const FormDialog = ({ open, onClose, course, onSave }: FormDialogProps) => {
  const [courseName, setCourseName] = useState(course?.name || '');
  const [description, setDescription] = useState(course?.description || '');
  const [duration, setDuration] = useState(course?.duration.toString() || '');
  const [imagePath, setImagePath] = useState(course?.imagePath || '');
  const [price, setPrice] = useState(course?.price ? course.price.toString() : '');
  const [level, setLevel] = useState(course?.level ? course.level.toString() : '');
  const [videoPath, setVideoPath] = useState(course?.videoPath ? course.videoPath.toString() : '');
  const [instruction, setInstruction] = useState(
    course?.instruction ? course.instruction.toString() : '',
  );
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
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

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${apiURL}/api/admin/all-teachers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTeachers(data.data || []);
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
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${apiURL}/api/admin/all-topic`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTopics(data.data || []);
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
      const accessToken = localStorage.getItem('accessToken');
      const url = isEditMode
        ? `${apiURL}/api/admin/update-course/${course?.id}`
        : `${apiURL}/api/admin/add-course`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await axios({
        url,
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditMode ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}

        {/* Select Topic */}
        <FormControl sx={{ mr: 5, mt: 2 }}>
          <FormLabel>Chọn chủ đề</FormLabel>
          {loadingTeachers ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <RadioGroup
              name="topic-selection"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              {topics.map((topic) => (
                <FormControlLabel
                  key={topic.id}
                  value={topic.id}
                  control={<Radio />}
                  label={topic.name}
                />
              ))}
            </RadioGroup>
          )}
        </FormControl>

        {/* Select Teacher */}
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
        <TextField
          margin="dense"
          label="Thời gian (phút)"
          type="number"
          fullWidth
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        {/* Upload Image */}
        <UploadWidget
          setThumbnailUploaded={(image: string) => setImagePath(image)}
          thumbnailUploaded={imagePath} // where imagePath is a string in the parent component's state
        />

        <TextField
          margin="dense"
          label="Cấp độ"
          type="number"
          fullWidth
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />
        {/*<TextField*/}
        {/*  margin="dense"*/}
        {/*  label="Đường dẫn video"*/}
        {/*  type="text"*/}
        {/*  fullWidth*/}
        {/*  value={videoPath}*/}
        {/*  onChange={(e) => setVideoPath(e.target.value)}*/}
        {/*/>*/}

        {/* Upload Image */}
        <UploadVideoWidget
          setThumbnailUploaded={(image: string) => setVideoPath(image)}
          thumbnailUploaded={videoPath} // where imagePath is a string in the parent component's state
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
        <Button onClick={handleCreateCourse}>{isEditMode ? 'Lưu' : 'Tạo khóa mới'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
