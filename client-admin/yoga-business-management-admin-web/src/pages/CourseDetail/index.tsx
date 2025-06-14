import React, { useState, useEffect } from 'react';
import UploadWidget from '../../designs/UploadWidget';
import UploadVideoWidget from '../../designs/UploadVideoWidget';
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
  duration,
  Autocomplete,
  Slider,
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
import axiosInstance from 'utils/axiosClient';

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
  const [showVideoForm, setShowVideoForm] = useState(false); // State for showing video form

  const [imagePath, setImagePath] = useState('');

  const [videoPath, setVideoPath] = useState('');
  const [videoDuration, setVideoDuration] = useState<string>('');

  const [currentSection, setCurrentSection] = useState({ title: '', id: 0 });

  //lecture
  const [newLecture, setNewLecture] = useState({ title: '', content: '', videoPath: '' }); // State for new lecture data
  const [productOptions, setProductOptions] = useState<IProduct[]>([]);
  const [productKeyword, setProductKeyword] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
  const [startSecond, setStartSecond] = useState(0);
  const [endSecond, setEndSecond] = useState(0);

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
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/product/filter', {
          params: {
            page: 1,
            pageSize: 10,
            keyword: productKeyword,
          },
        });
        if (response.status === 200) {
          setProductOptions(response.data.data.content); // content là mảng sản phẩm trong ListDto
        }
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    };

    if (productKeyword.length >= 2) {
      fetchProducts();
    }
  }, [productKeyword]);
  const fetchSections = async () => {
    try {
      const response = await axiosInstance.get(`/api/admin/get-all-section-by-id-course/${id}`);
      if (response.status === 200) {
        setSections(response.data.data);
        console.log('Dữ liệu sections:', response.data.data);
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
      const response = await axiosInstance.post(`/api/admin/add-section`, {
        idCourse: id,
        title: inputValue,
      });

      if (response.status === 200) {
        const result = response.data;
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
      // 1. Gọi API để tạo bài giảng trước
      const response = await axiosInstance.post(`/api/admin/add-lecture`, {
        idSection: currentSection.id,
        title: newLecture.title,
        content: newLecture.content,
        videoPath: videoPath,
        duration: videoDuration,
        image: imagePath,
      });

      if (response.status === 200) {
        const result = response.data;
        const newLectureId = result.data.id;

        console.log('Thêm bài giảng thành công:', result);

        // 2. Sau khi có ID, gọi API để thêm quảng cáo sản phẩm nếu có
        if (selectedProducts.length > 0) {
          const adResponse = await axiosInstance.post('/api/admin/ads/lecture/add', {
            lectureId: newLectureId,
            productIds: selectedProducts.map((p) => p.id),
            startSecond,
            endSecond,
          });

          if (adResponse.status !== 200) {
            throw new Error('Không thể lưu quảng cáo sản phẩm.');
          }
        }

        // 3. Cập nhật state giao diện
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
        setVideoPath('');
      } else {
        console.error('Lỗi khi thêm bài giảng:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  const handleSetVideoDuration = (duration: string) => {
    setVideoDuration(duration);
  };
  const totalSeconds = Math.floor(parseFloat(videoDuration) * 60); // ví dụ 0.27 phút → 16 giây

  return (
    <>
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
          {/*<Button color="inherit">Thông tin</Button>*/}
          {/*<Button color="inherit">Giá bán</Button>*/}
          {/*<Button color="inherit">Affiliate</Button>*/}
          {/*<Button color="inherit">Xuất bản</Button>*/}
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
                          py: 1.5, // Padding top & bottom
                          border: '1px solid #ddd', // Màu viền
                          borderRadius: 2, // Bo góc viền
                          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Hiệu ứng đổ bóng nhẹ
                          backgroundColor: '#f9f9f9', // Màu nền nhạt để nổi bật nội dung
                          '&:hover': {
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)', // Hiệu ứng khi hover
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
                setThumbnailUploaded={(image: string) => setVideoPath(image)} // Cập nhật đường dẫn video
                thumbnailUploaded={videoPath} // Giá trị video đã tải lên
                setVideoDuration={handleSetVideoDuration}
                videoDuration={videoDuration}
              />
              <Box mt={3} p={2} bgcolor="#fff" borderRadius={2} boxShadow={1}>
                <Typography variant="h6">Quảng cáo sản phẩm trong khoá học</Typography>

                <Autocomplete
                  multiple
                  options={productOptions}
                  getOptionLabel={(option) => option.title ?? ''}
                  filterOptions={(x) => x}
                  onInputChange={(event, value) => setProductKeyword(value)}
                  onChange={(e, value) => {
                    setSelectedProducts(value);
                    setTimeout(() => {
                      console.log(
                        'Selected Product IDs:',
                        value.map((p) => p.id),
                      );
                    }, 0);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn sản phẩm"
                      placeholder="Nhập tên sản phẩm..."
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={option.imagePath}
                        alt={option.title}
                        style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                      />
                      <span>{option.title}</span>
                    </li>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <span
                        {...getTagProps({ index })}
                        key={option.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: 8,
                          backgroundColor: '#e0f7fa',
                          padding: '4px 8px',
                          borderRadius: 8,
                        }}
                      >
                        <img
                          src={option.imagePath}
                          alt={option.title}
                          style={{ width: 30, height: 30, objectFit: 'cover', marginRight: 6 }}
                        />
                        {option.title}
                      </span>
                    ))
                  }
                />

                {videoDuration && selectedProducts && (
                  <Box mt={3}>
                    <Typography gutterBottom>Chọn thời gian hiển thị quảng cáo (giây)</Typography>
                    <Slider
                      value={[startSecond, endSecond]}
                      min={0}
                      max={totalSeconds}
                      step={1}
                      onChange={(event, newValue) => {
                        const [start, end] = newValue as number[];
                        setStartSecond(start);
                        setEndSecond(end);
                      }}
                      valueLabelDisplay="on"
                      valueLabelFormat={(value) => formatTime(value)} // Hiển thị mm:ss
                    />
                    <Typography variant="body2" color="text.secondary">
                      Tổng thời lượng video: {formatTime(totalSeconds)} (giây)
                    </Typography>
                  </Box>
                )}
              </Box>

              <FormControlLabel control={<Checkbox name="draft" />} label="Nháp" />
              <Button onClick={saveLecture} variant="contained" color="primary" sx={{ mt: 2 }}>
                Lưu Bài Giảng
              </Button>
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
      <FooterSection />
    </>
  );
}

export default CourseEditor;
