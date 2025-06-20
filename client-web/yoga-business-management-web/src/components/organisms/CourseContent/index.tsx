import React, { useState, useRef, useEffect } from "react";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/CheckCircleOutline";
import axiosInstance from "@/utils/axiosClient";
import { API_URL } from "@/config/url";
interface Lecture {
  id: number;
  title: string;
  content: string;
  videoPath: string;
  duration: string;
  isPublic: boolean;
  isDone: boolean;
}

interface Section {
  id: number;
  title: string;
  lectures: Lecture[];
}
interface CourseContentProps {
  courseId: string;
  sections: Section[];
}

const CourseContent: React.FC<CourseContentProps> = ({
  sections,
  courseId,
}) => {
  const router = useRouter();
  const [openPanel, setOpenPanel] = useState<number | null>(null);

  const [localSections, setLocalSections] = useState<Section[]>([]);

  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  const updateLectureDoneState = (lectureId: number, isDone: boolean) => {
    setLocalSections((prev) =>
      prev.map((section) => ({
        ...section,
        lectures: section.lectures.map((lec) =>
          lec.id === lectureId ? { ...lec, isDone } : lec
        ),
      }))
    );
  };

  const togglePanel = (id: number) => {
    setOpenPanel(openPanel === id ? null : id);
  };

  const handleMarkAsDone = async (lectureId: number) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/api/lecture-done/${lectureId}`
      );
      updateLectureDoneState(lectureId, true);
      console.log("Product added to cart:", response.data.data);
    } catch (err: any) {
      console.error("Error marking lecture as done:", err.message);
    } finally {
    }
  };
  const handleUnMarkAsDone = async (lectureId: number) => {
    try {
      const response = await axiosInstance.delete(
        `${API_URL}/api/lecture-done/${lectureId}`
      );
      updateLectureDoneState(lectureId, false);
      console.log("Product added to cart:", response.data.data);
    } catch (err: any) {
      console.error("Error marking lecture as done:", err.message);
    } finally {
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-[70px] pb-[48px] flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
      {localSections.map((section) => (
        <div key={section.id} className="w-full border-b border-gray-300 my-1">
          {/* Panel Header */}
          <div
            className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200"
            onClick={() => togglePanel(section.id)}
          >
            <h3 className="text-lg font-semibold">
              {openPanel === section.id ? "- " : "+ "} {section.title}
            </h3>
            {/* <span className="text-gray-600">
                           
                            {section.lectures.length} bài học - {
                                section.lectures.reduce((total, lecture) => {
                                   
                                    const duration = parseFloat(lecture.duration);
                                    return total + (isNaN(duration) ? 0 : duration); 
                                }, 0).toFixed(2)
                            } phút
                        </span> */}
          </div>

          {/* Panel Content */}
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              openPanel === section.id ? "h-auto opacity-100" : "h-0 opacity-0"
            }`}
          >
            <div
              className={`p-4 bg-white transition-all duration-200 ease-in-out`}
            >
              <ul>
                {section.lectures.map((lecture, index) => (
                  <div key={lecture.id}>
                    {lecture.isPublic ? (
                      <li
                        onClick={() =>
                          router.push(
                            `/course/lession/${courseId}/${lecture.id}`
                          )
                        }
                        className="flex justify-between items-center py-2 cursor-pointer ml-8"
                      >
                        <div>
                          <OndemandVideoIcon className="text-blue-500 mr-1" />
                          {lecture.isDone ? (
                            <CheckCircleOutlineIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnMarkAsDone(lecture.id);
                              }}
                              className="text-green-500 ml-2"
                              fontSize="medium"
                            />
                          ) : (
                            <RadioButtonUncheckedIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsDone(lecture.id);
                              }}
                              className="text-gray-400 ml-2"
                              fontSize="medium"
                            />
                          )}

                          <span className="text-gray-800 font-medium">
                            {lecture.title}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 mr-2">
                            {lecture.duration} phút
                          </span>

                          <Button
                            onClick={() => {
                              router.push(
                                `/course/lession/${courseId}/${lecture.id}`
                              );
                            }}
                            variant="contained"
                            color="primary"
                            sx={{ marginLeft: "auto" }}
                          >
                            Học
                          </Button>
                        </div>
                      </li>
                    ) : (
                      <li className="flex justify-between items-center py-2 cursor-pointer ml-8">
                        <div>
                          <OndemandVideoIcon className="text-blue-500 mr-1" />
                          {lecture.isDone ? (
                            <CheckCircleOutlineIcon
                              className="text-green-500 ml-2"
                              fontSize="medium"
                            />
                          ) : (
                            <RadioButtonUncheckedIcon
                              className="text-gray-400 ml-2"
                              fontSize="medium"
                            />
                          )}
                          <span className="text-gray-800 font-medium">
                            {lecture.title}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 mr-2">
                            {lecture.duration} phút
                          </span>
                          <span className="text-red-500">Riêng tư</span>
                          {index < section.lectures.length - 1 && (
                            <hr className="border-gray-300 my-2" />
                          )}
                        </div>
                      </li>
                    )}
                    {index < section.lectures.length - 1 && (
                      <hr className="border-t border-gray-300 mx-8" />
                    )}
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
      {/* {lecture.timesLearned >= 5 && (
                <div className="text-green-600 font-semibold">
                    🎉 Bạn đã học bài này {lecture.timesLearned} lần! Rất chăm chỉ!
                </div>
            )} */}
    </div>
  );
};

export default CourseContent;
