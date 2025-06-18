// components/ModalCourse.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from 'utils/axiosClient';

interface Course {
    id: number;
    name: string;
    description: string;
    imagePath: string;
}

interface ModalCourseProps {
    onClose: () => void;
    onSelect: (course: Course) => void;
}

const ModalCourse: React.FC<ModalCourseProps> = ({ onClose, onSelect }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axiosInstance.get('/api/admin/all-course');
                setCourses(res.data.data || []);
            } catch {
                // fallback
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
                <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 text-xl">
                    ×
                </button>
                <h2 className="text-xl font-semibold mb-4">Chọn khóa học</h2>
                {loading ? (
                    <p>Đang tải danh sách khóa học...</p>
                ) : courses.length === 0 ? (
                    <p>Không có khóa học nào.</p>
                ) : (
                    <ul className="space-y-3 max-h-80 overflow-y-auto">
                        {courses.map((course) => (
                            <li
                                key={course.id}
                                className="p-3 border rounded hover:bg-gray-100 flex justify-between items-center"
                            >
                                <span>{course.name}</span>
                                <button
                                    onClick={() => onSelect(course)}
                                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Chọn
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ModalCourse;
