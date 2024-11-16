import React, { useState, useEffect } from 'react';
import UploadWidget from '../../designs/UploadWidget';
import UploadVideoWidget from '../../designs/UploadVideoWidget';
import MainLayout from '../../components/SIdeBar';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Divider,
  Collapse,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { apiURL } from '../../config/constanst';
import { useParams } from 'react-router-dom';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArticleIcon from '@mui/icons-material/Article';
import QuizIcon from '@mui/icons-material/Quiz';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GetAppIcon from '@mui/icons-material/GetApp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Header from '../../components/Header';
import FooterSection from '../../components/FooterSection';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Params {
  id: string;
}

interface LectureResponse {
  id: number;
  title: string;
  content: string;
  videoPath: string;
  duration: String;
  image: String;
}

interface SectionResponse {
  id: number;
  title: string;
  lectures: LectureResponse[];
}

function CourseEditor() {
  const [isChapterOpen, setChapterOpen] = useState<{ [key: string]: boolean }>({});
  const [showChapterInfo, setShowChapterInfo] = useState(false);
  const [inputValue, setInputValue] = useState('Tên chương mới');
  const [sections, setSections] = useState<SectionResponse[]>([]);
  const [showNewChapterField, setShowNewChapterField] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showLectureList, setShowLectureList] = useState(false);

  const [imagePath, setImagePath] = useState('');
  const [videoPath, setVideoPath] = useState('');
  const [videoDuration, setVideoDuration] = useState<string>('');
  const [currentSection, setCurrentSection] = useState({ title: '', id: 0 });
  const [newLecture, setNewLecture] = useState({ title: '', content: '', videoPath: '' });

  const { id } = useParams<Params>();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleNewLectureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewLecture((prev) => ({ ...prev, [name]: value }));
  };

  const handleChapterToggle = (sectionId: string) => {
    setChapterOpen((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleAddLectureClick = (section: SectionResponse) => {
    setCurrentSection({ title: section.title, id: section.id });
    setOpenModal(true);
    setShowChapterInfo(false);
  };

  const handleAddChapter = () => {
    setShowChapterInfo(true);
    setShowNewChapterField(true);
    setShowVideoForm(false);
  };

  const fetchSections = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${apiURL}/api/admin/get-all-section-by-id-course/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setSections(result.data);
        console.log('Dữ liệu sections:', result.data);
      } else {
        console.error('Lỗi khi lấy danh sách sections:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [id]);

  const saveChapter = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${apiURL}/api/admin/add-section`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idCourse: id,
          title: inputValue,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Thêm chương thành công:', result);

        setSections((prevSections) => [
          ...prevSections,
          { id: result.data.id, title: inputValue, lectures: [] },
        ]);
        setShowNewChapterField(false);
        setShowChapterInfo(false);
        setInputValue('Tên chương mới');
      } else {
        console.error('Lỗi khi thêm chương:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleVideoButtonClick = () => {
    setShowVideoForm(true);
    setOpenModal(false);
  };

  const saveLecture = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${apiURL}/api/admin/add-lecture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idSection: currentSection.id,
          title: newLecture.title,
          content: newLecture.content,
          videoPath: videoPath,
          duration: videoDuration,
          image: imagePath,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Thêm bài giảng thành công:', result);

        setSections((prevSections) =>
          prevSections.map((section) =>
            section.id === currentSection.id
              ? { ...section, lectures: [...section.lectures, result.data] }
              : section,
          ),
        );

        setOpenModal(false);
        setShowVideoForm(false);
        setNewLecture({ title: '', content: '', videoPath: '' });
        setVideoPath("");
      } else {
        console.error('Lỗi khi thêm bài giảng:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const handleSetVideoDuration = (duration: string) => {
    setVideoDuration(duration);
  };

  const handleToggleLectureList = () => {
    setShowLectureList((prev) => !prev);
  };

  return (
    <MainLayout
      title="Quản lý khóa học"
      content={
        <Box>
          <Header title={'Cập nhật khoá học'} />
          <Box padding={4} bgcolor="#f5f6fa">
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h6">Khóa học đặc biệt</Typography>
              <Button variant="contained" color="primary">
                Xem trước
              </Button>
            </Box>

            {/* Tabs */}
            <Box display="flex" gap={4} mb={3}>
              <Button color="primary">Bài giảng</Button>
              <Button color="inherit">Thông tin</Button>
              <Button color="inherit">Giá bán</Button>
              <Button color="inherit">Affiliate</Button>
              <Button color="inherit">Xuất bản</Button>
            </Box>

            <Divider />

            {/* Content */}
            <Box display="flex" gap={4} mt={3} alignItems="flex-start">
              {/* Left Side - Lesson Structure */}
              <Box
                width="30%"
                position="relative"
                minHeight="400px"
                bgcolor="#fff"
                p={2}
                borderRadius={2}
                boxShadow={1}
              >
                {sections.map((section) => (
                  <Box key={section.id} mb={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={section.title}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => handleChapterToggle(section.id.toString())}
                          >
                            <span>
                              {isChapterOpen[section.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </span>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {/* Collapse for Chapter Details */}
                    <Collapse in={isChapterOpen[section.id]} timeout="auto" unmountOnExit>
                      {/* Display lectures for the chapter */}
                      {section.lectures.length > 0 ? (
                        section.lectures.map((lecture) => (
                          <Box
                            key={lecture.id}
                            sx={{
                              pl: 2,
                              py: 1.5,
                              border: '1px solid #ddd',
                              borderRadius: 2,
                              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                              backgroundColor: '#f9f9f9',
                              '&:hover': {
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                              },
                            }}
                          >
                            <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
                              {lecture.title}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ pl: 2 }}>
                          Chưa có bài giảng nào.
                        </Typography>
                      )}
                      {/* Button to Add Lecture */}
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleAddLectureClick(section)}
                      >
                        Thêm bài giảng
                      </Button>
                    </Collapse>
                  </Box>
                ))}

                {showNewChapterField && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Tên chương mới"
                    value={inputValue}
                    onChange={handleInputChange}
                    sx={{ mt: 2 }}
                  />
                )}
              </Box>

              {/* Right Side - Chapter Information */}
              {showChapterInfo && (
                <Box flex={1} padding={2} bgcolor="#fff" borderRadius={2} boxShadow={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Tiêu đề: Tên chương mới</Typography>
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Box width="45%">
                    <Typography variant="subtitle1" mb={1}>
                      Giá trị chỉnh sửa
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Tên chương mới"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={saveChapter}>
                    Cập nhật
                  </Button>
                </Box>
              )}

              {/* Video Form */}
              {showVideoForm && (
                <Box flex={1} padding={2} bgcolor="#fff" borderRadius={2} boxShadow={1} mt={3}>
                  <Typography variant="h6">Bài giảng Video</Typography>
                  <Box flex={1} padding={2} bgcolor="#fff" borderRadius={2} boxShadow={1}>
                    <Typography variant="h6">Chương hiện tại: {currentSection.title}</Typography>
                  </Box>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="title"
                    label="Tiêu đề"
                    type="text"
                    fullWidth
                    value={newLecture.title}
                    onChange={handleNewLectureChange}
                  />
                  <TextField
                    margin="dense"
                    name="content"
                    label="Nội dung"
                    type="text"
                    fullWidth
                    value={newLecture.content}
                    onChange={handleNewLectureChange}
                  />

                  {/* Upload Image */}
                  <UploadWidget
                    setThumbnailUploaded={(image: string) => setImagePath(image)}
                    thumbnailUploaded={imagePath}
                  />

                  <UploadVideoWidget
                    setThumbnailUploaded={(image: string) => setVideoPath(image)}
                    thumbnailUploaded={videoPath}
                    setVideoDuration={handleSetVideoDuration}
                  />

                  <FormControlLabel control={<Checkbox name="draft" />} label="Nháp" />
                  <Button onClick={saveLecture} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Lưu Bài Giảng
                  </Button>
                </Box>
              )}

              {/* Draggable Lecture List */}
              {showLectureList && (
                <Box flex={1} padding={2} bgcolor="#fff" borderRadius={2} boxShadow={1} mt={3}>
                  <Typography variant="h6">Danh sách bài giảng có thể kéo thả</Typography>
                  <DragDropContext onDragEnd={(result) => console.log(result)}>
                    <Droppable droppableId="lectureList">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {sections.flatMap((section, index) =>
                            section.lectures.map((lecture, lectureIndex) => (
                              <Draggable
                                key={lecture.id}
                                draggableId={`lecture-${lecture.id}`}
                                index={lectureIndex}
                              >
                                {(provided) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={{
                                      mb: 2,
                                      p: 2,
                                      border: '1px solid #ddd',
                                      borderRadius: 2,
                                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                      backgroundColor: '#f9f9f9',
                                      '&:hover': {
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                                      },
                                    }}
                                  >
                                    <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
                                      {lecture.title}
                                    </Typography>
                                  </Box>
                                )}
                              </Draggable>
                            )),
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Box>
              )}
            </Box>

            {/* Button at the Bottom Left */}
            <Box display="flex" justifyContent="flex-start" mt={3}>
              <Button
                variant="contained"
                color="primary"
                sx={{ fontWeight: 'bold', fontSize: 16 }}
                onClick={handleAddChapter}
              >
                + Thêm chương
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ fontWeight: 'bold', fontSize: 16, ml: 2 }}
                onClick={handleToggleLectureList}
              >
                + Thêm bài giảng kéo thả
              </Button>
            </Box>

            {/* Modal for Adding Lecture */}
            <Dialog open={openModal} onClose={handleCloseModal}>
              <DialogTitle>Chọn loại bài giảng</DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Button startIcon={<VideoLibraryIcon />} fullWidth onClick={handleVideoButtonClick}>
                      Video
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button startIcon={<ArticleIcon />} fullWidth>
                      Tài liệu
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button startIcon={<QuizIcon />} fullWidth>
                      Quiz
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button startIcon={<SlideshowIcon />} fullWidth>
                      Slideshow
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button startIcon={<MovieCreationIcon />} fullWidth>
                      Video Thực tế
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button startIcon={<LiveTvIcon />} fullWidth>
                      Live
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button startIcon={<PictureAsPdfIcon />} fullWidth>
                      PDF
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button startIcon={<GetAppIcon />} fullWidth>
                      Downloadable
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button startIcon={<FitnessCenterIcon />} fullWidth>
                      Exercise
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>
          </Box>
        </Box>
      }
    />
  );
  <FooterSection />
}

export default CourseEditor;