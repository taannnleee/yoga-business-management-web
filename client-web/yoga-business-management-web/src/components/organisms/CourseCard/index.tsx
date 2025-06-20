import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosClient";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
} from "@mui/material";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { div } from "@tensorflow/tfjs-core";
interface Course {
  id: number;
  name: string;
  instruction: string;
  description: string;
  duration: number;
  imagePath: string;
  level: number;
  videoPath: string;
  price: number;
  rating: number;
  capacity: number;
}

interface CourseCardProps {
  courses: Course[];
}

interface CourseOrderProps {
  id: number;
  idCourse: number;
  totalPrice: number;
  imagePath: string;
  name: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ courses }) => {
  const toast = useToast();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const itemsPerPage = 5;
  const [courseOrder, setCourseOrder] = useState<CourseOrderProps[]>([]);
  const [capacity, setCapacity] = useState<number>(0);
  const [registrationCount, setRegistrationCount] = useState<number>(0);

  const fetchCourseOrder = async () => {
    try {
      const response = await axiosInstance.get(`/api/order-course/show-order`);
      const data = response.data.data;
      setCourseOrder(data);
      console.log("Course Order Data:", data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchCourseOrder();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= courses.length ? 0 : prevIndex + itemsPerPage
    );
  };

  const roundRating = (rating: number) => {
    return Math.round(rating * 2) / 2;
  };

  const renderStars = (rating: number) => {
    const roundedRating = roundRating(rating);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          style={{ color: i < roundedRating ? "gold" : "lightgray" }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleOpenModal = async (course: Course) => {
    setSelectedCourse(course);
    setCapacity(course.capacity);
    try {
      const response = await axiosInstance.get(
        `/api/order-course/count-order-of-course/${course.id}`
      );
      setRegistrationCount(response.data.data); // Gán số lượng người đã đăng ký
    } catch (error) {
      console.error("Lỗi khi lấy số lượng đăng ký:", error);
      setRegistrationCount(0); // fallback nếu lỗi
    }
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedCourse(null);
  };
  const navigateToDetail = (id: number) => {
    router.push(`/course/detail/${id}`);
  };

  const addToCart = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/course/cart/add-to-cart`,
        {
          courseId: selectedCourse?.id,
        },
        {
          validateStatus: (status) => true, // Chấp nhận tất cả status code
        }
      );
      const data = response.data.status;
      if (data === 1040) {
        toast.sendToast(
          "Error",
          "Khóa học đã có trong giỏ hàng của bạn",
          "error"
        );
      } else {
        toast.sendToast("Success", "Thêm vào giỏ hàng thành công");
        handleCloseModal();
      }
    } catch (error) {
      toast.sendToast("Error", "Thêm vào giỏ hàng thất bại", "error");
      console.error("Error fetching cart data:", error);
    }
  };
  return (
    <Box mt={2} p={2} ml={4} mr={4}>
      <Box display="flex" alignItems="center" overflow="hidden">
        <Box display="flex" alignItems="center" overflow="hidden">
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="flex-start"
            mx={2}
            gap={5}
          >
            {courses
              .slice(currentIndex, currentIndex + itemsPerPage)
              .map((course) => (
                <Box
                  key={course.id}
                  position="relative"
                  mx={2}
                  className="w-1/4 p-2 flex flex-col items-center justify-between hover:cursor-pointer "
                  style={{ width: "calc(25% - 10px)", minWidth: "200px" }}
                >
                  <Image
                    src={course.imagePath}
                    alt={course.name}
                    width={245} // Image width
                    height={240} // Image height
                    layout="responsive" // Changed to responsive
                    objectFit="cover"
                  />

                  <Box className="product-hover absolute left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100">
                    <IconButton
                      color="secondary"
                      className="top-[-80px]"
                      onClick={() => handleOpenModal(course)}
                    >
                      <SearchIcon
                        fontSize="large"
                        className={"hover:bg-red-500 rounded-full w-[46px]"}
                      />
                    </IconButton>
                  </Box>

                  <Box textAlign="center" mt={1}>
                    <Typography
                      variant="subtitle1"
                      component="a"
                      href="#"
                      className="no-underline cursor-pointer"
                      style={{
                        color: "black",
                        transition: "color 0.3s",
                        maxWidth: "192px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "red")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "black")
                      }
                    >
                      {course.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ fontStyle: "italic", fontSize: "0.875rem" }}
                    >
                      {!course.price ? "Miễn phí" : `${course.price} VND`}
                    </Typography>
                    <Box mt={1}>{renderStars(5)}</Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
      {/* Modal for course details */}
      <Dialog open={open} onClose={handleCloseModal} maxWidth="lg">
        <DialogContent>
          <Box display="flex" width="990px" height="366px">
            {/* Left - Image */}
            <Box flex={1}>
              <Image
                src={selectedCourse?.imagePath || ""}
                alt={selectedCourse?.name || ""}
                width={390}
                height={390}
                layout="fixed"
              />
              {/* 🏷️ Thêm logic kiểm tra */}
              {selectedCourse &&
              courseOrder.some(
                (order) => order.idCourse === selectedCourse?.id
              ) ? (
                <Button
                  variant="contained"
                  color="success"
                  style={{ marginTop: "30px", marginLeft: "70px" }}
                  onClick={() =>
                    router.push(`/course/detail/${selectedCourse.id}`)
                  }
                >
                  Đi đến khóa học của bạn
                </Button>
              ) : (
                <>
                  <Typography
                    onClick={() => navigateToDetail(selectedCourse?.id || 0)}
                    variant="body1"
                    className={"text-orange-600 font-thin cursor-pointer"}
                    style={{
                      marginTop: "32px",
                      marginLeft: "120px",
                      color: "red",
                    }}
                  >
                    Xem chi tiết
                  </Typography>

                  <Button
                    onClick={() => addToCart()}
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "10px", marginLeft: "90px" }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </>
              )}
            </Box>
            {/* Right - Course details */}
            <Box flex={2} ml={2}>
              <Typography variant="h6" fontWeight="bold">
                {selectedCourse?.name}
              </Typography>
              <Typography
                variant="body2"
                fontStyle="italic"
                color="textSecondary"
              >
                Sức chứa: {registrationCount}/{capacity} học viên
              </Typography>
              <Typography
                variant="body1"
                className={"py-2"}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                }}
              >
                Bài học Yoga cho Người mới bắt đầu - Học các kỹ năng Yoga, mẹo
                luyện tập Yoga hiệu quả, các nguyên tắc cơ bản, Cách luyện tập
                các tư thế Yoga.
              </Typography>
              <Typography variant="body1" className={"py-2"}>
                <strong>Khóa học Yoga cho người mới bắt đầu giúp bạn:</strong>
              </Typography>
              <List className="benefits-list">
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon
                      style={{ color: "green", width: "16px" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={"font-thin font-mono"}
                    primary="Nắm vững các kiến thức nền tảng trong luyện tập Yoga"
                  />
                </ListItem>
                {/* Repeat the ListItem for the other benefits as per your requirement */}
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon
                      style={{ color: "green", width: "16px" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={"font-thin font-mono"}
                    primary="Cải thiện tư thế và sự liên kết của bạn"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon
                      style={{ color: "green", width: "16px" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={"font-thin font-mono"}
                    primary="Cải thiện tính linh hoạt"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon
                      style={{ color: "green", width: "16px" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={"font-thin font-mono"}
                    primary="Phát triển sự cân bằng"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon
                      style={{ color: "green", width: "16px" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={"font-thin font-mono"}
                    primary="Phát triển sự tập trung và năng suất"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon
                      style={{ color: "green", width: "16px" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={"font-thin font-mono"}
                    primary="Giảm căng thẳng và lo âu"
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CourseCard;
