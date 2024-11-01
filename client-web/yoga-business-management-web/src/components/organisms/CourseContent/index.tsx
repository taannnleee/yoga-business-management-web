import React, { useState, useRef, useEffect } from "react";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import {Button} from "@mui/material";
interface Lesson {
    id: number;
    title: string;
    duration: string;
    isTrial: boolean;
}

interface Chapter {
    id: number;
    title: string;
    lessons: Lesson[];
    totalLessons: number;
    totalTime: string;
}

const chapters: Chapter[] = [
    {
        id: 1,
        title: "Phần 1: Tổng quan",
        totalLessons: 1,
        totalTime: "3 phút",
        lessons: [
            { id: 1, title: "Bài 1: Giới thiệu và các lưu ý trước khi tập", duration: "3 phút", isTrial: true }
        ],
    },
    {
        id: 2,
        title: "Phần 2: Đánh thức cơ thể",
        totalLessons: 2,
        totalTime: "33 phút",
        lessons: [
            { id: 2, title: "Bài 1: Khởi động", duration: "15 phút", isTrial: true },
            { id: 3, title: "Bài 2: Bài tập cơ bản", duration: "18 phút", isTrial: true }
        ],
    },
    {
        id: 3,
        title: "Phần 3: Tăng cường thải độc",
        totalLessons: 2,
        totalTime: "24 phút",
        lessons: [
            { id: 4, title: "Bài 1: Thải độc toàn thân", duration: "12 phút", isTrial: true },
            { id: 5, title: "Bài 2: Bài tập cho phổi", duration: "12 phút", isTrial: false }
        ],
    },
];

const CourseContent: React.FC = () => {
    const [openPanel, setOpenPanel] = useState<number | null>(null);

    const togglePanel = (id: number) => {
        setOpenPanel(openPanel === id ? null : id);
    };

    return (
        <div className="w-full max-w-7xl mx-auto mt-[70px] pb-[48px] flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
            {chapters.map((chapter) => (
                <div key={chapter.id} className="w-full border-b border-gray-300 my-1">
                    {/* Panel Header */}
                    <div
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200"
                        onClick={() => togglePanel(chapter.id)}
                    >
                        <h3 className="text-lg font-semibold">
                            {openPanel === chapter.id ? "- " : "+ "} {chapter.title}
                        </h3>
                        <span className="text-gray-600">
                            {chapter.totalLessons} bài học - {chapter.totalTime}
                        </span>
                    </div>

                    {/* Panel Content */}
                    <div
                        className={`overflow-hidden transition-all duration-200 ease-in-out ${
                            openPanel === chapter.id ? "h-auto opacity-100" : "h-0 opacity-0"
                        }`}
                    >
                        <div className={`p-4 bg-white transition-all duration-200 ease-in-out`}>
                            <ul>
                                {chapter.lessons.map((lesson, index) => (
                                    <div key={lesson.id}>
                                        <li className="flex justify-between items-center py-2">
                                            <div>
                                                <OndemandVideoIcon className="text-blue-500 mr-1 ml-8"/>
                                                <span className="text-gray-800 font-medium">{lesson.title}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 mr-2">{lesson.duration}</span>
                                                {lesson.isTrial && (
                                                    <Button variant="contained" color="primary" sx={{ marginLeft: "auto" }}>
                                                        Học thử
                                                    </Button>
                                                )}
                                            </div>

                                        </li>
                                        {index < chapter.lessons.length - 1 && (
                                            <hr className="border-gray-300 my-2" />
                                        )}
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CourseContent;
