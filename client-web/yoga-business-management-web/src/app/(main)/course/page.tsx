"use client";

import React, { useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from "next/image";
import CourseCard from "@/components/organisms/CourseCard";

interface IHomePageProps {}

const reasons = [
    {
        title: "Học mọi lúc mọi nơi",
        description: "Chỉ cần có điện thoại máy tính bảng, laptop hoặc TV kết nối Internet",
        image: "https://yoga.vn/statics/yoga/img/reason-2.png",
    },
    {
        title: "Tiết kiệm chi phí",
        description: "Học phí chỉ bằng 1/10 so với các trung tâm dạy Yoga",
        image: "https://yoga.vn/statics/yoga/img/reason-6.png",
    },
    {
        title: "Chương trình học đa dạng",
        description: "Hơn 1000 bài học được Giảng dạy bởi các huấn luyện viên Yoga số 1 Việt Nam và Ấn Độ, theo từng cấp độ và nhu cầu học của bạn",
        image: "https://yoga.vn/statics/yoga/img/reason-4.png",
    },
    {
        title: "Được tư vấn miễn phí",
        description: "Được tư vấn về sức khỏe dinh dưỡng, chế độ luyện tập bởi các chuyên gia",
        image: "https://yoga.vn/statics/yoga/img/reason-5.png",
    },
];

const instructors = [
    {
        name: "Đỗ Gia Trân",
        title: "Giảng viên yoga",
        image: "https://yoga.vn/data/avatars/photo_63350c78e275cb77848b4571_1680498787.jpg"
    },
    {
        name: "Tuệ Giang",
        title: "Tuệ Giang yoga",
        image: "https://yoga.vn/data/avatars/photo_1617978708_1617978708.jpg"
    },
    {
        name: "Lê Thị Phương Chi",
        title: "Chi Detox",
        image: "https://yoga.vn/data/avatars/photo_1579440593_1579440593.jpg"
    },
    {
        name: "Nguyễn Hiếu",
        title: "Đại sứ Yoga Việt Nam - CEO Zenlife" +
            "Yoga",
        image: "https://yoga.vn/data/avatars/photo_5b63c7116803fa784a69e833_1533285335.jpg"
    },
    {
        name: "Phạm Thị D",
        title: "Giảng viên yoga",
        image: "https://yoga.vn/data/avatars/photo_5b63c9246803fa3b6669e833_1537344000.jpg"
    },
    {
        name: "Phạm Thị E",
        title: "Giảng viên yoga",
        image: "https://yoga.vn/data/avatars/photo_5b63c9506803fa4d3469e833_1533285525.jpg"
    },
    {
        name: "Phạm Thị E",
        title: "Giảng viên yoga",
        image: "https://yoga.vn/data/avatars/photo_5b63c9ab6803faf16669e833_1533285597.jpg"
    },
    {
        name: "Phạm Thị E",
        title: "Giảng viên yoga",
        image: "https://yoga.vn/data/avatars/photo_5b63c9d26803faf16669e834_1533285637.jpg"
    },
    {
        name: "Phạm Thị E",
        title: "Giảng viên yoga",
        image: "https://yoga.vn/data/avatars/photo_5b63ca016803fa3b6669e834_1533285666.jpg"
    },
    {
        name: "Phạm Thị E",
        title: "Giảng viên yoga",
        image: "https://yoga.vn/data/avatars/photo_5b63ca2f6803fa784a69e834_1537343078.jpg"
    },
    {
        name: "Phạm Thị E",
        title: "Giảng viên yoga",
        image: "https://yoga.vn/data/avatars/photo_5b63ca946803fa784a69e835_1537343121.jpg"
    },
];

const CoursePage: React.FC<IHomePageProps> = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to get the current instructors for the slider
    const getCurrentInstructors = () => {
        const start = currentIndex * 4;
        return instructors.slice(start, start + 4);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(instructors.length / 4));
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.ceil(instructors.length / 4)) % Math.ceil(instructors.length / 4));
    };

    return (
        <div className="w-screen">
            {/* Background Image Section */}
            <div
                className="h-screen bg-[url('https://yoga.vn/statics/yoga/img/yoga.jpg')] bg-cover bg-center flex items-center justify-center">
                <button
                    className="w-[400px] h-[54px] bg-[#ee4987] text-white text-[24px] font-bold rounded hover:bg-[#fced0e] hover:text-[#ec3496] transition duration-200">
                    BẮT ĐẦU CHƯƠNG TRÌNH NÀY
                </button>
            </div>

            {/* Reasons Section with Margin */}
            <div className="w-full max-w-6xl px-4 mx-auto mt-[30px]">
                <div className="text-center text-2xl font-bold mb-6">4 LÝ DO NÊN HỌC YOGA ONLINE</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reasons.map((reason, index) => (
                        <div key={index} className="flex flex-col items-center bg-white rounded-lg p-6 text-center">
                            <img src={reason.image} alt={reason.title} className="w-[75px] h-[75px] mb-4"/>
                            <h3 className="text-lg font-semibold text-gray-800">{reason.title}</h3>
                            <p className="text-gray-700 mt-2">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slider Section */}
            <div className="w-full max-w-7xl mx-auto mt-[30px] flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">CHỌN HUẤN LUYỆN VIÊN CỦA BẠN</h2>
                <div className="flex justify-between items-center w-full">
                    <button onClick={prevSlide} className="p-2 bg-gray-200 rounded-full">
                        <ArrowBackIcon />
                    </button>
                    <div className="flex space-x-2">
                        {getCurrentInstructors().map((instructor, index) => (
                            <div key={index} className=" flex flex-col items-center w-[285px] h-[313px]">
                                <img
                                    src={instructor.image}
                                    alt={instructor.name}
                                    className="rounded-full cursor-pointer transition-opacity duration-300 hover:opacity-50"
                                />
                                <h3 className="text-lg cursor-pointer font-semibold my-[20px]">{instructor.name}</h3>
                                <p className="text-gray-600 cursor-pointer">{instructor.title}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={nextSlide} className="p-2 bg-gray-200 rounded-full">
                        <ArrowForwardIcon />
                    </button>
                </div>
                <div className="relative mt-[35px] mb-[45px]">
                    <div className="absolute bottom-[4px] left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {Array.from({length: Math.ceil(instructors.length / 4)}).map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full ${currentIndex === index ? "bg-yellow-500" : "bg-gray-300"}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* CÁC KHÓA HỌC NỔI BẬT Section */}
            <div className="w-full max-w-6xl px-4 mx-auto mt-[30px]">
                <h2 className="text-2xl font-bold text-center mb-6">CÁC KHÓA HỌC NỔI BẬT</h2>
                <CourseCard />
            </div>
            <div className="flex justify-center mt-4"> {/* Flex container for centering */}
                <button
                    className="bg-[#ee4987] w-[198px] h-[46px] text-white text-[18px] font-light rounded hover:bg-[#fced0e] hover:text-[#ec3496] transition duration-200"
                >
                    Xem toàn bộ khoá học
                </button>
            </div>


        </div>
    );
};

export default CoursePage;
