"use client"
import React from "react";
import CourseCard from "@/components/organisms/CourseCard";

const DisCoverPage: React.FC<any> = () => {
    const categoryCourses = [
        {
            id: 1,
            name: "YOGA cơ bản",
            courses: [
                {
                    id: 1,
                    title: "108 Toạ pháp Yoga - Bí mật trẻ mãi",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/108toaphap.jpg",
                    author: "Giáo viên A",
                    rating: 4.5,
                },
                {
                    id: 2,
                    title: "Tập yoga cơ bản ngay tại nhà với Nguyễn Hiếu",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yogacobanngaytainha.jpg",
                    author: "Giáo viên B",
                    rating: 4.0,
                },
                // Add more courses if needed...
            ],
        },
        {
            id: 2,
            name: "Đốt mỡ, giảm cân",
            courses: [
                {
                    id: 3,
                    title: "7 ngày giảm cân an toàn",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yoga chua benh da day Nguyen Hieu (1).png",
                    author: "Giáo viên C",
                    rating: 4.2,
                },
                {
                    id: 4,
                    title: "Yoga tăng trưởng chiều cao - Phát triển trí thông minh",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yogatangchieucao.jpg",
                    author: "Giáo viên D",
                    rating: 4.1,
                },
                // Add more courses if needed...
            ],
        },
        {
            id: 3,
            name: "Trẻ hoá",
            courses: [
                {
                    id: 5,
                    title: "Yoga - Phục hồi nội tiết kéo dài tuổi xuân",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yoga chua benh da day Nguyen Hieu.png",
                    author: "Giáo viên E",
                    rating: 4.3,
                },
                {
                    id: 6,
                    title: "Yoga trẻ hóa và làm đẹp cho khuôn mặt",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/trehoakhuonmat.jpg",
                    author: "Giáo viên F",
                    rating: 4.4,
                },
                // Add more courses if needed...
            ],
        },
        {
            id: 4,
            name: "Trị liệu",
            courses: [
                {
                    id: 7,
                    title: "Yoga chữa bệnh dạ dày",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/daday.jpg",
                    author: "Nguyễn Hiếu",
                    rating: 4.6,
                },
                {
                    id: 8,
                    title: "Yoga khí công chữa bệnh khớp và cột sống phục hồi sức khỏe",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/nguyenhieuyoga.jpg",
                    author: "Chuyên gia Yoga",
                    rating: 4.5,
                },
                {
                    id: 9,
                    title: "Yoga chữa bệnh trị liệu cho cột sống",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yogacotsong.jpg",
                    author: "Yogi Nguyễn Hiếu",
                    rating: 4.4,
                },
                // Add more courses if needed...
            ],
        },
        {
            id: 5,
            name: "Thiền",
            courses: [
                {
                    id: 10,
                    title: "Thiền và quản trị cảm xúc cho người hiện đại",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/thien va quan tri cam xuc - do mai (1).png",
                    author: "Giáo viên G",
                    rating: 4.7,
                },
                {
                    id: 11,
                    title: "Bí mật Thiền ứng dụng thay đổi cuộc đời",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/bimathien.jpg",
                    author: "Giáo viên H",
                    rating: 4.8,
                },
                // Add more courses if needed...
            ],
        },
        {
            id: 6,
            name: "Yoga nâng cao",
            courses: [
                {
                    id: 12,
                    title: "Tập yoga nâng cao thật dễ",
                    image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/yoganangcao.jpg",
                    author: "Nguyễn Hiếu",
                    rating: 4.9,
                },
                // Add more courses if needed...
            ],
        },
        // Add more categories if needed...
    ];


    return (
        <div className="w-screen">
            {categoryCourses.map((category) => (
                <div key={category.id} className="w-full max-w-6xl px-4 mx-auto mt-[30px]">
                    <h2 className="text-xl text-left mb-2">{category.name}</h2>
                    <CourseCard  courses={category.courses}/>
                </div>
            ))}
        </div>
    );
};

export default DisCoverPage;
