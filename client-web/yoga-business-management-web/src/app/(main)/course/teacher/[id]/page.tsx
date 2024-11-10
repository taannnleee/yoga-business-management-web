"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CourseCard from "@/components/organisms/CourseCard"; // Đường dẫn tới component CourseCard
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface Course {
    id: number;
    title: string;
    image: string;
    author: string;
    rating: number;
}

interface Teacher {
    id: number;
    fullName: string;
    introduction: string;
    email: string;
    phoneNumber: string;
    experienceYears: number;
    profilePicture: string;
}

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
}

const TeacherDetailPage: React.FC = () => {
    const router = useRouter();
    const { id: teacherId } = useParams<{ id: string }>();

    // State để lưu dữ liệu giáo viên
    const [teacherInfo, setTeacherInfo] = useState<Teacher | null>(null); // Đảm bảo là một đối tượng hoặc null
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    

    // Fetch teacher info from API
    useEffect(() => {
        const fetchTeacherInfo = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`http://localhost:8080/api/teacher/get-teacher/${teacherId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (data.status === 200) {
                    setTeacherInfo(data.data); // Lưu dữ liệu giáo viên vào state
                } else {
                    setError("Không thể tải thông tin giáo viên.");
                }
            } catch (err) {
                setError("Có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeacherInfo();
    }, [teacherId]);

    // Fetch các khóa học của giáo viên từ API
    useEffect(() => {
        const fetchTeacherCourses = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`http://localhost:8080/api/course/all-teacher-courses/${teacherId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (data.status === 200) {
                    setCourses(data.data); // Lưu các khóa học của giáo viên vào state
                } else {
                    setError("Không thể tải các khóa học.");
                }
            } catch (err) {
                setError("Có lỗi xảy ra khi tải các khóa học.");
            } finally {
                setIsLoadingCourses(false);
            }
        };

        fetchTeacherCourses();
    }, [teacherId]);

    if (isLoading) {
        return <div>Đang tải thông tin giáo viên...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!teacherInfo) {
        return <div>Không có thông tin giáo viên.</div>;
    }

    // Splitting courses into groups of 4
    const coursesPerPage = 4;
    const courseGroups = [];
    for (let i = 0; i < courses.length; i += coursesPerPage) {
        courseGroups.push(courses.slice(i, i + coursesPerPage));
    }

    return (
        <div className="w-screen">
            {/* Header Section */}
            <div className="h-[452px] flex mx-36">
                <img
                    src={teacherInfo.profilePicture}
                    alt={teacherInfo.fullName}
                    className="w-[200px] h-[100px] rounded-full object-cover"
                />
                <div className="ml-4 flex flex-col justify-center">
                    <h1 className="text-2xl font-bold">{teacherInfo.fullName}</h1>
                    <h2 className="text-lg text-gray-600">{teacherInfo.introduction}</h2>
                    <div className="flex space-x-4 mt-2">
                        {/* Các liên kết social media */}
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            <button className="text-blue-600">Facebook</button>
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            <button className="text-red-600">Youtube</button>
                        </a>
                    </div>
                    <p className="mt-4 text-sm">
                        Email: {teacherInfo.email} <br />
                        Phone: {teacherInfo.phoneNumber} <br />
                        Kinh nghiệm: {teacherInfo.experienceYears} năm
                    </p>
                    <p className="mt-4 text-sm">Đại sứ Yoga Việt Nam - CEO Zenlife Yoga

                        Chuyên gia Yoga Nguyễn Hiếu đã có hơn 12 năm nghiên cứu và giảng dạy Yoga tại các trung tâm và đã huấn luyện cho hàng nghìn học viên khắp Việt Nam và thế giới.

                        Chị là Đại sứ Yoga Việt Nam do Trung tâm Unesco Phát triển Văn hóa và Thể thao phong tặng.

                        Chị đã thiết kế rất nhiều chương trình Yoga trực tuyến, sở hữu kênh  đào tạo Yoga online lớn nhất Việt Nam.

                        Hiện tại, chị là tổng giám đốc công ty Zenlife Yoga Việt Nam và là huấn luyện viên trưởng cho chương trình đào tạo giáo viên Yoga.

                        Hiện nay, dù đã gần 40 tuổi và có 2 con lớn, Chuyên gia Yoga Nguyễn Hiếu vẫn sở hữu một cơ thể cân đối trẻ trung, khỏe mạnh và dẻo dai như ở tuổi đôi mươi, với vòng eo 60 cm là niềm ao ước của mọi phụ nữ ở độ tuổi này.</p>
                </div>
            </div>

            {/* Courses Section */}
            <div className="p-4 mx-36">
                <h3 className="text-xl font-semibold mt-6">Các khóa học Yoga của {teacherInfo.fullName}</h3>
                {courseGroups.map((group, index) => (
                    <CourseCard key={index} courses={group} />
                ))}
            </div>
        </div>
    );
};

export default TeacherDetailPage;
