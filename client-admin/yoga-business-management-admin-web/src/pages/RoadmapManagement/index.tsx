'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/SIdeBar';
import axiosInstance from 'utils/axiosClient';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import ModalCourse from 'components/ModelCourse';

interface TopicRoadmap {
    id: number;
    title: string;
    content: string;
    course: Course[];
}
interface Course {
    id: number;
    name: string;
    description: string;
    imagePath: string;
}

interface Roadmap {
    id: number;
    title: string;
    description: string;
    topicRoadmapsResponse: TopicRoadmap[];
}

const RoadmapListPage: React.FC = () => {
    const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(null);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedRoadmap, setEditedRoadmap] = useState<Partial<Roadmap>>({});

    const history = useHistory();
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const fetchRoadmaps = async (page = 1) => {
        try {
            const response = await axiosInstance.get(`/api/admin/roadmap?page=${page}`);
            console.log(response.data.data);
            const data = response.data.data;
            setRoadmaps(data.content);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách lộ trình');
        }
    };

    const handleDelete = async (id: number) => {
        console.log('Xóa lộ trình với ID:', id);
        try {
            await axiosInstance.delete(`/api/admin/roadmap/delete/${id}`);
            toast.success('Đã xóa lộ trình thành công!');
            fetchRoadmaps(currentPage); // Refresh danh sách
        } catch (error) {
            toast.error('Xóa lộ trình thất bại');
        }
    };

    const handleEdit = (id: number) => {
        // window.location.href = `/admin/roadmap/edit/${id}`;
    };

    const toggleExpand = (id: number) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        fetchRoadmaps(currentPage);
    }, [currentPage]);

    const handleSave = async () => {
        if (!editingId || !editedRoadmap) return;

        try {
            const payload = {
                title: editedRoadmap.title,
                description: editedRoadmap.description,
                topicRoadmaps: (editedRoadmap.topicRoadmapsResponse ?? []).map((topic) => ({
                    id: topic.id,
                    title: topic.title,
                    content: topic.content,
                    courses: topic.course ?? [],
                })),
            };
            await axiosInstance.put(`/api/admin/roadmap/update/${editingId}`, payload);
            toast.success('Cập nhật thành công!');
            setEditingId(null);
            setEditedRoadmap({});
            fetchRoadmaps(currentPage);
        } catch (error) {
            toast.error('Cập nhật thất bại');
        }
    };
    const handleCourseSelect = (course: Course) => {
        if (selectedTopicIndex === null || editingId === null) return;

        const currentTopics = editedRoadmap.topicRoadmapsResponse ?? [];

        const updatedTopics = [...currentTopics];
        const topic = updatedTopics[selectedTopicIndex];
        const currentCourses = topic.course ?? [];

        // Nếu chưa có khóa học này, thêm vào
        if (!currentCourses.some(c => c.id === course.id)) {
            updatedTopics[selectedTopicIndex] = {
                ...topic,
                course: [...currentCourses, course],
            };

            setEditedRoadmap((prev) => ({
                ...prev,
                topicRoadmapsResponse: updatedTopics,
            }));
        }

        setSelectedTopicIndex(null);
    };
    const handleRemoveCourse = (topicIndex: number, courseIndex: number) => {
        const currentTopics = editedRoadmap.topicRoadmapsResponse ?? [];

        const updatedTopics = [...currentTopics];
        const topic = updatedTopics[topicIndex];
        const currentCourses = topic.course ?? [];

        // Xóa course tại index
        const updatedCourses = currentCourses.filter((_, idx) => idx !== courseIndex);

        updatedTopics[topicIndex] = {
            ...topic,
            course: updatedCourses,
        };

        setEditedRoadmap((prev) => ({
            ...prev,
            topicRoadmapsResponse: updatedTopics,
        }));
    };




    return (
        <MainLayout
            title="Danh sách lộ trình"
            content={
                <div className="p-6 bg-white rounded shadow max-w-6xl mx-auto mt-10">
                    <button
                        onClick={() => history.push('/create/roadmap-management')}
                        className="bg-lime-600 text-white px-2 py-1 rounded hover:bg-red-600 text-xs w-[90  px]"
                    >
                        Thêm lộ trình học
                    </button>
                    <h2 className="text-2xl font-bold mb-4">Danh sách lộ trình</h2>

                    <table className="w-full border text-sm table-fixed">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border px-4 py-2 w-1/4 truncate">Tiêu đề</th>
                                <th className="border px-4 py-2 w-2/5 truncate">Mô tả</th>
                                <th className="border px-4 py-2 w-1/6 text-center">Số chương</th>
                                <th className="border px-4 py-2 w-1/6 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roadmaps.map((roadmap) => (
                                <React.Fragment key={roadmap.id}>
                                    <tr>
                                        <td className="border px-4 py-2 truncate max-w-xs">
                                            {editingId === roadmap.id ? (
                                                <input
                                                    type="text"
                                                    value={editedRoadmap.title ?? roadmap.title}
                                                    onChange={(e) =>
                                                        setEditedRoadmap({ ...editedRoadmap, title: e.target.value })
                                                    }
                                                    className="border px-2 py-1 w-full"
                                                />
                                            ) : (
                                                roadmap.title
                                            )}
                                        </td>
                                        <td className="border px-4 py-2 whitespace-pre-wrap break-words">
                                            {editingId === roadmap.id ? (
                                                <textarea
                                                    value={editedRoadmap.description ?? roadmap.description}
                                                    onChange={(e) =>
                                                        setEditedRoadmap({ ...editedRoadmap, description: e.target.value })
                                                    }
                                                    className="border px-2 py-1 w-full"
                                                />
                                            ) : (
                                                roadmap.description
                                            )}
                                        </td>

                                        <td className="border px-4 py-2 text-center">
                                            {roadmap.topicRoadmapsResponse.length}
                                            {roadmap.topicRoadmapsResponse.length > 0 && (
                                                <button
                                                    onClick={() => toggleExpand(roadmap.id)}
                                                    className="text-blue-600 underline ml-2 text-xs"
                                                >
                                                    {expandedRows.includes(roadmap.id) ? 'Ẩn' : 'Xem'}
                                                </button>
                                            )}
                                        </td>
                                        <td className="border px-4 py-2 text-center space-y-1">
                                            {editingId === roadmap.id ? (
                                                <button
                                                    onClick={handleSave}
                                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs w-full"
                                                >
                                                    Hoàn thành
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingId(roadmap.id);
                                                        setEditedRoadmap({
                                                            title: roadmap.title,
                                                            description: roadmap.description,
                                                            topicRoadmapsResponse: roadmap.topicRoadmapsResponse.map((t) => ({ ...t })),
                                                        });
                                                    }}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs w-full"
                                                >
                                                    Sửa
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(roadmap.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs w-full"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expand row */}
                                    {expandedRows.includes(roadmap.id) && (
                                        <tr>
                                            <td colSpan={4} className="bg-gray-50 px-6 py-4">
                                                <div className="grid gap-6">
                                                    {(editedRoadmap.topicRoadmapsResponse ?? roadmap.topicRoadmapsResponse).map((topic, topicIndex) => (
                                                        <div
                                                            key={topic.id}
                                                            className="border-2 border-gray-500 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                                                        >
                                                            <input
                                                                type="text"
                                                                value={
                                                                    editedRoadmap.topicRoadmapsResponse?.[topicIndex]?.title ??
                                                                    topic.title
                                                                }
                                                                onChange={(e) => {
                                                                    const updatedTopics = [...(editedRoadmap.topicRoadmapsResponse ?? roadmap.topicRoadmapsResponse)];
                                                                    updatedTopics[topicIndex] = {
                                                                        ...updatedTopics[topicIndex],
                                                                        title: e.target.value,
                                                                    };
                                                                    setEditedRoadmap((prev) => ({
                                                                        ...prev,
                                                                        topicRoadmapsResponse: updatedTopics,
                                                                    }));
                                                                }}
                                                                className="w-full border p-2 text-sm font-semibold mb-2"
                                                            />
                                                            <textarea
                                                                value={
                                                                    editedRoadmap.topicRoadmapsResponse?.[topicIndex]?.content ??
                                                                    topic.content
                                                                }
                                                                onChange={(e) => {
                                                                    const updatedTopics = [...(editedRoadmap.topicRoadmapsResponse ?? roadmap.topicRoadmapsResponse)];
                                                                    updatedTopics[topicIndex] = {
                                                                        ...updatedTopics[topicIndex],
                                                                        content: e.target.value,
                                                                    };
                                                                    setEditedRoadmap((prev) => ({
                                                                        ...prev,
                                                                        topicRoadmapsResponse: updatedTopics,
                                                                    }));
                                                                }}
                                                                className="w-full border p-2 text-sm text-gray-700 whitespace-pre-line mb-3"
                                                            />
                                                            <div className="mt-4">
                                                                {topic.course && topic.course.length > 0 ? (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                        {topic.course.map((course, courseIndex) => (
                                                                            <div key={course.id} className="relative border p-3 rounded shadow-sm bg-gray-50">
                                                                                <div className="font-medium text-sm">{course.name}</div>
                                                                                <div className="text-xs text-gray-600 mb-2">{course.description}</div>
                                                                                {course.imagePath && (
                                                                                    <img
                                                                                        src={course.imagePath}
                                                                                        alt={course.name}
                                                                                        className="w-full h-32 object-cover rounded"
                                                                                    />
                                                                                )}
                                                                                {editingId === roadmap.id && (
                                                                                    <button
                                                                                        onClick={() => handleRemoveCourse(topicIndex, courseIndex)}
                                                                                        className="absolute top-1 right-1 text-red-600 text-xs bg-white border border-red-500 rounded px-1"
                                                                                    >
                                                                                        ✕
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-xs italic text-gray-500">Không có khóa học</div>
                                                                )}

                                                                {editingId === roadmap.id && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setSelectedTopicIndex(topicIndex)}
                                                                        className="text-blue-600 text-xs mt-2 underline block"
                                                                    >
                                                                        + Thêm khóa học
                                                                    </button>
                                                                )}
                                                            </div>

                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    {selectedTopicIndex !== null && (
                        <ModalCourse
                            onSelect={handleCourseSelect}
                            onClose={() => setSelectedTopicIndex(null)}
                        />
                    )}


                    {/* Phân trang */}
                    <div className="flex justify-center items-center mt-6 space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Trang trước
                        </button>
                        <span>{`Trang ${currentPage} / ${totalPages}`}</span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Trang sau
                        </button>
                    </div>
                </div>
            }
        />
    );
};

export default RoadmapListPage;
