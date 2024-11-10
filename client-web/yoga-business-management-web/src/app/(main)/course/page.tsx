"use client";

import React, { useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from "next/image";
import CourseCard from "@/components/organisms/CourseCard";
import {useRouter} from "next/navigation";

interface IHomePageProps {}
const courses = [
    {
        id: 1,
        title: "Yogalates nền tảng",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/untitled1.jpg",
        author: "Giáo viên A",
        rating: 4.5,
    },
    {
        id: 2,
        title: "Khóa học Yoga nâng cao",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/untitled1.jpg",
        author: "Giáo viên B",
        rating: 4.0,
    },
    {
        id: 3,
        title: "Khóa học Yoga cho phụ nữ mang thai",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/untitled1.jpg",
        author: "Giáo viên C",
        rating: 4.7,
    },
    {
        id: 4,
        title: "Khóa học Yoga giảm cân",
        image: "https://yoga.vn/data/sites/5b602d4d6803faee0faded36/files/thumbnail/untitled1.jpg",
        author: "Giáo viên D",
        rating: 3.8,
    },
];
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
const studentTestimonials = [
    {
        name: "Nguyễn Văn A",
        feedback: "Tôi đã học yoga ở đây và thấy rất hiệu quả. Các bài học dễ hiểu, giảng viên tận tình!",
        image: "https://yoga.vn/statics/yoga/img//images_hv/tesmonial_2.jpg",
    },
    {
        name: "Trần Thị B",
        feedback: "Thời gian linh hoạt, học được mọi lúc mọi nơi, phù hợp với công việc bận rộn của tôi.",
        image: "https://yoga.vn/statics/yoga/img//images_hv/tesmonial_3.jpg",
    },
    {
        name: "Lê Văn C",
        feedback: "Chi phí rất hợp lý và các bài học rất bài bản, tôi thấy tiến bộ rõ rệt.",
        image: "https://yoga.vn/statics/yoga/img//images_hv/tesmonial_4.jpg",
    },
    {
        name: "Phạm Thị D",
        feedback: "Chất lượng giảng dạy tuyệt vời, có rất nhiều lựa chọn bài học và lộ trình phù hợp.",
        image: "https://yoga.vn/statics/yoga/img//images_hv/tesmonial_5.jpg",
    },
    {
        name: "Nguyễn Thị E",
        feedback: "Các giảng viên rất tận tình, tôi cảm thấy tự tin hơn khi thực hành.",
        image: "https://yoga.vn/statics/yoga/img//images_hv/tesmonial_6.jpg",
    },
];
const CoursePage: React.FC<IHomePageProps> = () => {
    const router = useRouter();
    const [currentInstructorIndex, setCurrentInstructorIndex] = useState(0);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

    // Function to get the current instructors for the slider
    const getCurrentInstructors = () => {
        const start = currentInstructorIndex * 4;
        return instructors.slice(start, start + 4);
    };

    // Function to get the current testimonials for the slider
    const getCurrentTestimonials = () => {
        const start = currentTestimonialIndex * 3; // Change to 3 for the testimonials
        return studentTestimonials.slice(start, start + 3);
    };

    const nextInstructorSlide = () => {
        setCurrentInstructorIndex((prevIndex) => (prevIndex + 1) % Math.ceil(instructors.length / 4));
    };

    const prevInstructorSlide = () => {
        setCurrentInstructorIndex((prevIndex) => (prevIndex - 1 + Math.ceil(instructors.length / 4)) % Math.ceil(instructors.length / 4));
    };

    const nextTestimonialSlide = () => {
        setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % Math.ceil(studentTestimonials.length / 3));
    };

    const prevTestimonialSlide = () => {
        setCurrentTestimonialIndex((prevIndex) => (prevIndex - 1 + Math.ceil(studentTestimonials.length / 3)) % Math.ceil(studentTestimonials.length / 3));
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
            <div className="w-full max-w-6xl px-4 mx-auto mt-[70px]">
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

            {/* Slider Section for Instructors */}
            <div className="w-full max-w-7xl mx-auto mt-[70px] flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">CHỌN HUẤN LUYỆN VIÊN CỦA BẠN</h2>
                <div className="flex justify-between items-center w-full">
                    <button onClick={prevInstructorSlide} className="p-2 bg-gray-200 rounded-full">
                        <ArrowBackIcon/>
                    </button>
                    <div className="flex space-x-2">
                        {getCurrentInstructors().map((instructor, index) => (
                            <div key={index} className="flex flex-col items-center w-[285px] h-[313px]">
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
                    <button onClick={nextInstructorSlide} className="p-2 bg-gray-200 rounded-full">
                        <ArrowForwardIcon/>
                    </button>
                </div>
                <div className="relative mt-[70px] mb-[45px]">
                    <div className="absolute bottom-[4px] left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {Array.from({length: Math.ceil(instructors.length / 4)}).map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full ${currentInstructorIndex === index ? "bg-yellow-500" : "bg-gray-300"}`}
                                onClick={() => setCurrentInstructorIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* CÁC KHÓA HỌC NỔI BẬT Section */}
            <div className="w-full max-w-6xl px-4 mx-auto mt-[30px]">
                <h2 className="text-2xl font-bold text-center mb-6">CÁC KHÓA HỌC NỔI BẬT</h2>
                <CourseCard courses={courses}/>
            </div>
            <div className="flex justify-center mt-4"> {/* Flex container for centering */}
                <button
                    onClick={() =>router.push("/course/discover")}
                    className="bg-[#ee4987] w-[198px] h-[46px] text-white text-[18px] font-light rounded hover:bg-[#fced0e] hover:text-[#ec3496] transition duration-200 mt-[70px]"
                >
                    Xem toàn bộ khoá học
                </button>
            </div>
            {/* Slider Section for Student Testimonials */}
            <div className="w-full max-w-7xl mx-auto mt-[70px] flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">CẢM NHẬN HỌC VIÊN</h2>
                <div className="flex justify-between items-center w-full mt-[40px]">
                    <button onClick={prevTestimonialSlide} className="p-2 bg-gray-200 rounded-full">
                        <ArrowBackIcon/>
                    </button>
                    <div className="flex space-x-4">
                        {getCurrentTestimonials().map((testimonial, index) => (
                            <div key={index}
                                 className="bg-white shadow-md rounded-lg overflow-hidden w-[360px] h-[589px] flex flex-col items-center p-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="rounded-full w-[120px] h-[120px] object-cover"
                                />
                                <h3 className="font-semibold mt-5">{testimonial.name}</h3>
                                <p className="text-gray-600 text-center mt-2">{testimonial.feedback}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={nextTestimonialSlide} className="p-2 bg-gray-200 rounded-full">
                        <ArrowForwardIcon/>
                    </button>
                </div>
                <div className="relative mt-[35px] mb-[45px]">
                    <div className="absolute bottom-[4px] left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {Array.from({length: Math.ceil(studentTestimonials.length / 3)}).map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full ${currentTestimonialIndex === index ? "bg-yellow-500" : "bg-gray-300"}`}
                                onClick={() => setCurrentTestimonialIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
