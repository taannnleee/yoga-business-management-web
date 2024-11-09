"use client"
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CourseContent from "@/components/organisms/CourseContent";
import { title } from "process";
import Video from "next-video";

interface Section {
    id: number;
    title: string;
    lectures: Lecture[];
}

interface Lecture {
    id: number;
    title: string;
    content: string;
    videoPath: string;
}

interface Teacher {
    id: number;
    fullName: string;
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
    sections: Section[];
    teacher: Teacher;
}

const CourseDetailPage: React.FC = () => {
    const router = useRouter();
    const { id: courseId } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [sections, setSections] = useState<Section[] | null>(null);  // State for sections
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleStartProgram = () => {
        // const firstLesson = course?.sections[0]?.lectures[0];
        // if (firstLesson) {
        //     router.push(`/course/lession/${firstLesson.id}`);
        // }
    };

    useEffect(() => {
        if (courseId) {
            const fetchCourseData = async () => {
                try {
                    const token = localStorage.getItem("accessToken");
                    setLoading(true);
                    const response = await fetch(
                        `http://localhost:8080/api/course/get-course/${courseId}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                        }
                    );
                    const data = await response.json();

                    if (data.status === 200) {
                        setCourse(data.data);
                    } else {
                        setError("Không thể tải dữ liệu khóa học.");
                    }
                } catch (err) {
                    setError("Đã xảy ra lỗi khi gọi API.");
                } finally {
                    setLoading(false);
                }
            };

            // Fetch course data
            fetchCourseData();
        }
    }, [courseId]);

    // Fetch sections after course data is fetched
    useEffect(() => {
        if (courseId && course) {
            const fetchSections = async () => {
                try {
                    const token = localStorage.getItem("accessToken");
                    const response = await fetch(
                        `http://localhost:8080/api/course/get-all-section-by-id-course/${courseId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();

                    console.log(data.message)

                    if (data.status === 200) {
                        console.log("độ dài của mảng")
                        console.log(data.data.length)
                        const transformedData: Section[] = data.data.map((item: any) => ({
                            id: item.id,
                            title: item.title,
                        }));
                        console.log("đã vào trong api section")
                        console.log(transformedData)
                        setSections(transformedData);

                    } else {
                        setError("Không thể tải dữ liệu phần học.");
                    }
                } catch (err) {
                    setError("Đã xảy ra lỗi khi gọi API sections.");
                }
            };

            fetchSections();
        }
    }, [course, courseId]); // This runs when the course data is fetched

    useEffect(() => {
        console.log("Dữ liệu sections đã được set:");
        console.log(sections)
    }, [sections]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!course) return <div>Không có khóa học nào</div>;

    return (
        <div className="w-screen">
            {/* Background Image Section */}
            <div
                className="relative h-[500px] w-full bg-cover bg-center flex items-center justify-center opacity-90 bg-[#f1f1f1]"
                style={{ backgroundImage: `url(${course.imagePath})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative text-center">
                    <h3 className="text-orange-600 text-[36px] font-bold">{course.name}</h3>
                    <p className="text-white text-[24px] my-6 font-thin">Discover the secrets of timeless youth</p>
                    <button
                        className="mt-6 w-[300px] h-[54px] bg-[#ee4987] text-white text-[14px] font-bold rounded hover:bg-[#fced0e] hover:text-[#ec3496] transition duration-200"
                        onClick={handleStartProgram}
                    >
                        BẮT ĐẦU CHƯƠNG TRÌNH NÀY
                    </button>
                </div>
            </div>

            {/* Introduction Section */}
            <div className="container mx-auto mt-10 px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/2 text-gray-800">
                        <h2 className="text-2xl font-semibold mb-4">Giới thiệu chương trình</h2>
                        <p className="mb-4">{course.instruction}</p>
                    </div>
                    <div className="lg:w-1/2 flex flex-col items-center">
                        <div>
                            <div className="w-full max-w-[750px]">
                                {/* Top Black Line */}
                                <div className="border-t-2 border-black-500"/>
                                <Video src={course.videoPath} className="w-full rounded-lg shadow-lg"/>
                                {/* Bottom Black Line */}
                                <div className="border-b-2 border-black-500"/>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mt-4">Video giới thiệu</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* What's study Section */}
            <div className="w-full max-w-7xl mx-auto mt-[70px] flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Bạn sẽ học được gì</h2>
                <div className="flex justify-start items-center w-full">
                    <ul>
                        <li className="text-gray-600 text-lg mb-2">{course.description}</li>
                    </ul>
                </div>
            </div>

            {/* Sections Display */}
            {sections && (
                <div className="w-full max-w-7xl mx-auto mt-[70px] flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">Các Mục Học</h2>
                    <div className="w-full">
                        {sections.map((section) => (
                            <div key={section.id} className="mb-4">
                                <h3 className="text-xl font-semibold">{section.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Teacher Info Section */}
            <div className="w-full max-w-7xl mx-auto mt-[70px] flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Giảng viên</h2>
                <div className="flex justify-center items-center w-full">
                    <div className="flex">
                        <div key={course.teacher.id} className="flex flex-col items-center w-[285px] h-[313px]">
                            <img
                                src={course.teacher.profilePicture}
                                alt={course.teacher.fullName}
                                className="rounded-full cursor-pointer transition-opacity duration-300 hover:opacity-50"
                            />
                            <h3 className="text-lg cursor-pointer font-semibold my-[20px]">{course.teacher.fullName}</h3>
                            <p className="text-gray-600 cursor-pointer">{course.teacher.experienceYears} năm kinh nghiệm</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {sections && (
                    <div className="w-full max-w-7xl mx-auto mt-[70px] flex flex-col items-center">
                        <h2 className="text-2xl font-bold mb-4">Các Mục Học</h2>
                        <div className="w-full">
                            {sections.map((section) => (
                                <div key={section.id} className="mb-4">
                                    <h3 className="text-xl font-semibold">{section.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetailPage;
