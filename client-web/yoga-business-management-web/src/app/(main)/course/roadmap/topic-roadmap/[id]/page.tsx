"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosClient";
import { useRouter, useParams } from "next/navigation";

interface Course {
  id: number;
  name: string;
  description: string;
  instruction?: string | null;
  duration?: string | null;
  imagePath?: string | null;
  level?: number;
  videoPath?: string | null;
  price?: number | null;
  originalPrice?: number | null;
  isFree?: boolean;
  thumbnailUrl?: string;
  capacity: number;
}

interface TopicRoadMapResponse {
  id: number;
  title: string;
  content: string;
  course: Course[];
}

interface RoadmapResponse {
  id: number;
  title: string;
  description: string;
  topicRoadmapsResponse: TopicRoadMapResponse[];
}

const TopicRoadmapPage: React.FC = () => {
  const router = useRouter();
  const { id: roadMapId } = useParams<{ id: string }>();
  const [data, setData] = useState<RoadmapResponse | null>(null);

  const fetchMedal = async () => {
    try {
      const response = await axiosInstance.get(`/api/roadmap/${roadMapId}`);
      const data = response.data.data;
      setData(data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchMedal();
  }, []);

  if (!data) return <div className="p-6 text-gray-600">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* <h1 className="text-2xl font-bold mb-4">1. {data.title}</h1>
            <p className="mb-6 text-gray-700">{data.description}</p> */}

      {data.topicRoadmapsResponse.map((topic, index) => (
        <div key={topic.id} className="mb-10">
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">
            {index + 1}. {topic.title}
          </h2>
          <p className="text-gray-600 mb-4">{topic.content}</p>

          <div className="space-y-6">
            {topic.course.length > 0 ? (
              topic.course.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col md:flex-row bg-white shadow rounded-xl overflow-hidden border"
                >
                  <img
                    src={
                      course.imagePath ||
                      "https://via.placeholder.com/300x180.png?text=Course+Image"
                    }
                    alt={course.name}
                    className="w-full md:w-60 h-40 object-cover"
                  />
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-lg mb-1">{course.name}</h3>
                    <div className="mb-2">
                      {course.isFree ? (
                        <span className="text-red-500 font-semibold">
                          Miễn phí
                        </span>
                      ) : (
                        <>
                          {course.originalPrice && (
                            <span className="line-through text-gray-500 mr-2">
                              {course.originalPrice.toLocaleString()}đ
                            </span>
                          )}
                          <span className="text-red-500 font-semibold">
                            {course.price?.toLocaleString()}đ
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {course.description}
                    </p>
                    <button
                      onClick={() => {
                        router.push(`/course/detail/${course.id}`);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
                    >
                      XEM KHÓA HỌC
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 italic">Chưa có khoá học</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicRoadmapPage;
