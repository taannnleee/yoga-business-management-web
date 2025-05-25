"use client";
import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "@/utils/axiosClient";
import { useRouter, useParams } from "next/navigation";

interface RoadmapTopic {
    id: number;
    title: string;
    description: string;
}

interface RoadmapProps {
    id: number;
    title: string;
    description: string;
    topicRoadmapIds: RoadmapTopic[];
}
const Roadmap = () => {
    const router = useRouter();
    const [roadmap, setRoadmap] = useState<RoadmapProps[]>([]);

    const fetchRoadMap = async () => {
        try {
            const response = await axiosInstance.get(`/api/roadmap`);
            const data = response.data.data;
            setRoadmap(data);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    useEffect(() => {
        fetchRoadMap();
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-800">
            <header className="flex items-center justify-between px-6 py-4 shadow">
                <div className="flex items-center space-x-2">
                    <div className="bg-orange-500 text-white font-bold px-3 py-1 rounded">F8</div>
                    <span className="font-semibold">Học Lập Trình Để Đi Làm</span>
                </div>
                <div className="space-x-3">
                    <button className="text-gray-600">Đăng ký</button>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded">Đăng nhập</button>
                </div>
            </header>

            <div className="flex">
                <aside className="w-48 bg-gray-100 p-4 min-h-screen">
                    <nav className="space-y-4">
                        <div className="flex items-center space-x-2 font-semibold">
                            <span>🏠</span>
                            <span>Trang chủ</span>
                        </div>
                        <div className="flex items-center space-x-2 font-semibold text-blue-600">
                            <span>🗺️</span>
                            <span>Lộ trình</span>
                        </div>
                        <div className="flex items-center space-x-2 font-semibold">
                            <span>📄</span>
                            <span>Bài viết</span>
                        </div>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <h1 className="text-2xl font-bold mb-4">Lộ trình học</h1>
                    <p className="mb-6 text-gray-600">
                        Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {roadmap.map((item, index) => (
                            <div
                                key={index}
                                className="border p-6 rounded-lg shadow hover:shadow-lg transition-all"
                            >
                                <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                                <p className="text-gray-700 mb-4">{item.description}</p>
                                <button onClick={() => { router.push(`/course/roadmap/topic-roadmap/${item.id}`); }} className="bg-blue-600 text-white px-4 py-2 rounded">
                                    XEM CHI TIẾT
                                </button>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
export default Roadmap;
