"use client"
import React from "react";
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
const courses = [
    {
        id: 1,
        title: "Tập Yoga cơ bản ngay tại nhà với Nguyễn Hiếu",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yogacobanngaytainha.jpg",
        author: "Nguyễn Hiếu",
        rating: 4.5,
    },
    {
        id: 2,
        title: "108 Toạ Pháp Yoga - Bí mật trẻ mãi",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/108toaphap.jpg",
        author: "Nguyễn Hiếu",
        rating: 4.0,
    },
    {
        id: 3,
        title: "Yoga giảm eo giữ dáng",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/yoga-giam-eo-giu-dang.jpeg",
        author: "Nguyễn Hiếu",
        rating: 4.7,
    },
    {
        id: 4,
        title: "Yoga trẻ hoá và làm đẹp cho khuôn mặt",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yoga chua benh da day Nguyen Hieu.png",
        author: "Nguyễn Hiếu",
        rating: 3.8,
    },
    {
        id: 5,
        title: "Yoga chữa bệnh trị liệu cho cột sống",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yoga chua benh da day Nguyen Hieu.png",
        author: "Nguyễn Hiếu",
        rating: 4.5,
    },
    {
        id: 6,
        title: "Yoga tăng trưởng chiều cao - Phát triển trí thông minh",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/108toaphap.jpg",
        author: "Nguyễn Hiếu",
        rating: 4.0,
    },
    {
        id: 7,
        title: "7 Ngày giảm cân an toàn",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yoganangcao.jpg",
        author: "Nguyễn Hiếu",
        rating: 4.7,
    },
    {
        id: 8,
        title: "Tập yoga nâng cao thật dễ",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/nguyenhieuyoga.jpg",
        author: "Nguyễn Hiếu",
        rating: 3.8,
    },
    {
        id: 9,
        title: "Yoga khí công chữa bệnh khớp và cột sống phục hồi sức khỏe",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yogacotsong.jpg",
        author: "Nguyễn Hiếu",
        rating: 4.5,
    },
    {
        id: 10,
        title: "Yoga chữa bệnh dạ dày",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yoganamgioi.jpg",
        author: "Nguyễn Hiếu",
        rating: 4.0,
    },
    {
        id: 11,
        title: "Bí mật Thiền ứng dụng thay đổi cuộc đời",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yoga chua benh mat ngu.jpg",
        author: "Nguyễn Hiếu",
        rating: 4.7,
    },
    {
        id: 12,
        title: "Yoga trẻ hoá và làm đẹp cho khuôn mặt",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yogatangchieucao.jpg",
        author: "Nguyễn Hiếu",
        rating: 3.8,
    },
];
const TeacherDetailPage: React.FC = () => {
    const router = useRouter();
    const { id: teacherId } = useParams<{ id: string }>();

    // Sample teacher data
    const teacherInfo = {
        name: "Nguyễn Hiếu",
        title: "Đại sứ Yoga Việt Nam - CEO Zenlife Yoga",
        description: `
            Chuyên gia Yoga Nguyễn Hiếu đã có hơn 12 năm nghiên cứu và giảng dạy Yoga tại các trung tâm và đã huấn luyện cho hàng nghìn học viên khắp Việt Nam và thế giới.
            Chị là Đại sứ Yoga Việt Nam do Trung tâm Unesco Phát triển Văn hóa và Thể thao phong tặng.
            Chị đã thiết kế rất nhiều chương trình Yoga trực tuyến, sở hữu kênh đào tạo Yoga online lớn nhất Việt Nam.
            Hiện tại, chị là tổng giám đốc công ty Zenlife Yoga Việt Nam và là huấn luyện viên trưởng cho chương trình đào tạo giáo viên Yoga.
            Hiện nay, dù đã gần 40 tuổi và có 2 con lớn, Chuyên gia Yoga Nguyễn Hiếu vẫn sở hữu một cơ thể cân đối trẻ trung, khỏe mạnh và dẻo dai như ở tuổi đôi mươi, với vòng eo 60 cm là niềm ao ước của mọi phụ nữ ở độ tuổi này.
        `,
        facebook: "#", // Facebook link
        youtube: "#", // YouTube link
        imageUrl: "https://yoga.vn/data/avatars/photo_5b63c7116803fa784a69e833_1533285335.jpg", // Teacher's image URL
    };

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
                <img src={teacherInfo.imageUrl} alt={teacherInfo.name} className="w-[200px] h-[100px] rounded-full object-cover" />
                <div className="ml-4 flex flex-col justify-center">
                    <h1 className="text-2xl font-bold">{teacherInfo.name}</h1>
                    <h2 className="text-lg text-gray-600">{teacherInfo.title}</h2>
                    <div className="flex space-x-4 mt-2">
                        <a href={teacherInfo.facebook} target="_blank" rel="noopener noreferrer">
                            <button className="text-blue-600">Facebook</button>
                        </a>
                        <a href={teacherInfo.youtube} target="_blank" rel="noopener noreferrer">
                            <button className="text-red-600">Youtube</button>
                        </a>
                    </div>
                    <p className="mt-4 text-sm">{teacherInfo.description}</p>
                </div>
            </div>

            {/* Courses Section */}
            <div className="p-4 mx-36">
                <h3 className="text-xl font-semibold mt-6">Các khóa học Yoga của Nguyễn Hiếu</h3>
                {courseGroups.map((group, index) => (
                    <CourseCard key={index} courses={group} />
                ))}
            </div>
        </div>
    );
};

export default TeacherDetailPage;
