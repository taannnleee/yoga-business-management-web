'use client';

import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import MainLayout from '../../components/SIdeBar';
import axiosInstance from 'utils/axiosClient';
import { toast } from 'react-toastify';
import EditableInput from '../../components/EditableInput';
import ModalCourse from 'components/ModelCourse';

interface Course {
  id: number;
  name: string;
  description: string;
  imagePath: string;
}

interface TopicRoadmap {
  title: string;
  content: string;
  courses?: Course[];
}

interface Roadmap {
  title: string;
  description: string;
  topicRoadmaps: TopicRoadmap[];
}

const DEFAULT_TOPIC = {
  title: 'Chủ đề',
  content: 'Nội dung',
};

const DEFAULT_ROADMAP = {
  title: 'Lộ trình',
  description: 'Mô tả lộ trình',
};

const CreateRoadmapPage: React.FC = () => {
  const history = useHistory();
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap>({
    ...DEFAULT_ROADMAP,
    topicRoadmaps: [{ ...DEFAULT_TOPIC }],
  });

  const handleCourseSelect = (course: Course) => {
    if (selectedTopicIndex === null) return;

    setRoadmap((prev) => {
      const updatedTopics = [...prev.topicRoadmaps];
      const current = updatedTopics[selectedTopicIndex];
      const existingCourses = current.courses || [];

      const alreadyExists = existingCourses.some((c) => c.id === course.id);
      if (!alreadyExists) {
        updatedTopics[selectedTopicIndex] = {
          ...current,
          courses: [...existingCourses, course],
        };
      }

      return { ...prev, topicRoadmaps: updatedTopics };
    });

    setSelectedTopicIndex(null);
  };

  const handleTopicChange = (index: number, field: 'title' | 'content', value: string) => {
    const updatedTopics = [...roadmap.topicRoadmaps];
    updatedTopics[index][field] = value;
    setRoadmap({ ...roadmap, topicRoadmaps: updatedTopics });
  };

  const addTopic = () => {
    setRoadmap({
      ...roadmap,
      topicRoadmaps: [...roadmap.topicRoadmaps, { ...DEFAULT_TOPIC }],
    });
  };

  const removeTopic = (index: number) => {
    const updatedTopics = roadmap.topicRoadmaps.filter((_, i) => i !== index);
    setRoadmap({ ...roadmap, topicRoadmaps: updatedTopics });
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post('/api/admin/roadmap/create', roadmap);
      if (response.data.status === 200) {
        toast.success('Tạo lộ trình thành công!');
        setRoadmap({ ...DEFAULT_ROADMAP, topicRoadmaps: [{ ...DEFAULT_TOPIC }] });
      } else {
        toast.error('Tạo thất bại!');
      }
    } catch {
      toast.error('Lỗi khi gửi dữ liệu');
    }
  };

  return (
    <MainLayout
      title="Quản lý lộ trình"
      content={
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
          <div className="mb-4">
            <label className="block font-medium">Tiêu đề lộ trình</label>
            <EditableInput
              defaultValue={DEFAULT_ROADMAP.title}
              onChange={(value) => setRoadmap({ ...roadmap, title: value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium">Mô tả</label>
            <EditableInput
              defaultValue={DEFAULT_ROADMAP.description}
              onChange={(value) => setRoadmap({ ...roadmap, description: value })}
              type="textarea"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Chủ đề trong lộ trình</h3>
            {roadmap.topicRoadmaps.map((topic, index) => (
              <div key={index} className="border p-4 mb-4 rounded-md bg-gray-50">
                <div className="mb-2">
                  <label className="block text-sm font-medium">Tiêu đề chủ đề</label>
                  <EditableInput
                    defaultValue={DEFAULT_TOPIC.title}
                    onChange={(value) => handleTopicChange(index, 'title', value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Nội dung</label>
                  <EditableInput
                    defaultValue={DEFAULT_TOPIC.content}
                    onChange={(value) => handleTopicChange(index, 'content', value)}
                    type="textarea"
                    className="mt-1 block w-full border rounded px-3 py-2"
                    rows={3}
                  />
                </div>

                <div className="mt-4">
                  <div
                    className="border-2 border-dashed border-gray-400 p-3 rounded text-center text-gray-600 cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedTopicIndex(index)}
                  >
                    + Thêm khóa học
                  </div>
                </div>

                {topic.courses && topic.courses.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {topic.courses.map((course, courseIndex) => (
                      <li
                        key={course.id}
                        className="p-2 border rounded bg-white text-sm flex justify-between items-center"
                      >
                        <span>{course.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedTopics = [...roadmap.topicRoadmaps];
                            updatedTopics[index].courses = updatedTopics[index].courses?.filter(
                              (_, i) => i !== courseIndex
                            );
                            setRoadmap({ ...roadmap, topicRoadmaps: updatedTopics });
                          }}
                          className="text-red-500 text-xs ml-4 hover:underline"
                        >
                          Xóa
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {roadmap.topicRoadmaps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    className="text-red-500 text-sm underline mt-2"
                  >
                    Xóa chủ đề
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addTopic}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
            >
              + Thêm chủ đề
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-6"
            >
              Tạo lộ trình
            </button>
          </div>

          {selectedTopicIndex !== null && (
            <ModalCourse
              onClose={() => setSelectedTopicIndex(null)}
              onSelect={handleCourseSelect}
            />
          )}
        </div>
      }
    />
  );
};

export default CreateRoadmapPage;
