"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Video from "next-video";
import Image from "next/image";
import Button from "@/components/atom/Button";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import LectureItem from "@/components/organisms/LessionItem";
import { API_URL } from "@/config/url";
import axiosInstance from "@/utils/axiosClient";
import { motion, AnimatePresence } from "framer-motion";

interface Lecture {
  id: number;
  title: string;
  content: string;
  videoPath: string;
  duration: string;
  image: string;
}

interface Section {
  id: number;
  title: string;
  lectures: Lecture[];
}

interface Teacher {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  experienceYears: number;
  profilePicture: string;
  introduction: string;
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

interface Ad {
  id: number;
  startSecond: number;
  endSecond: number;
  content: string;
  productId: number;
  price: string;
  imagePath: string;
  title: string;
}

const LessionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.idCourse;
  const lectureId = params?.id;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [visibleAds, setVisibleAds] = useState<Ad[]>([]);
  const handleExpandCollapse = () => {
    setIsExpanded((prev) => !prev);
  };

  const fetchSections = async () => {
    try {
      const res = await axiosInstance.get(
        `${API_URL}/api/course/get-course-filter-lecture/${courseId}`
      );
      if (res.data.status === 200) {
        setCourse(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching course:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLecture = async () => {
    try {
      const res = await axiosInstance.get(
        `${API_URL}/api/lecture/get-lecture/${courseId}/${lectureId}`
      );
      if (res.data.status === 200) {
        setLecture(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching lecture:", err);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await axiosInstance.get(
        `${API_URL}/api/lecture/ads/${lectureId}`
      );
      console.log("Ads response:", res.data.data);
      if (res.data.status === 200) {
        setAds(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching ads:", err);
    }
  };

  useEffect(() => {
    fetchSections();
    if (lectureId) {
      fetchLecture();
      fetchAds();
    }
  }, [lectureId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    // Tạo mới và cập nhật visibleAds khi currentTime thay đổi
    const newVisibleAds = ads.filter(
      (ad) => currentTime >= ad.startSecond && currentTime <= ad.endSecond
    );
    setVisibleAds(newVisibleAds); // Cập nhật visibleAds khi có quảng cáo mới
  }, [currentTime, ads]);

  useEffect(() => {
    setCurrentAdIndex(0);
  }, [visibleAds]);
  useEffect(() => {
    setCurrentAdIndex(0);
  }, [visibleAds]);
  return (
    <div className="flex flex-col items-center py-6 px-4 min-h-screen bg-white">
      <div className="w-full max-w-[750px] relative">
        <div className="border-t-2 border-black-500" />
        <Video
          ref={videoRef}
          src={lecture?.videoPath}
          className="w-full rounded-lg shadow-lg"
        />
        <div className="border-b-2 border-black-500" />

        {/* Popup Ads */}
        <AnimatePresence mode="wait">
          {visibleAds.length > 0 && (
            <motion.div
              key={visibleAds[currentAdIndex].productId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-2 right-2 bg-white p-3 rounded-lg shadow-lg border border-gray-300 max-w-[150px] text-sm z-20"
            >
              {/* Nút đóng "X" */}
              <button
                onClick={() => setVisibleAds([])}
                className="absolute top-1 right-1 text-gray-500 hover:text-black text-xs font-bold"
                aria-label="Đóng quảng cáo"
              >
                ✕
              </button>

              {visibleAds[currentAdIndex].imagePath && (
                <div className="w-full h-[150px] relative mb-2">
                  <Image
                    src={visibleAds[currentAdIndex].imagePath}
                    alt={visibleAds[currentAdIndex].title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <p className="font-semibold">
                {visibleAds[currentAdIndex].title}
              </p>
              <p className="text-red-500 font-semibold mt-1">
                {visibleAds[currentAdIndex].price?.toLocaleString()}₫
              </p>
              <Button
                onClick={() =>
                  window.open(
                    `/product-detail/${visibleAds[currentAdIndex].productId}`,
                    "_blank" // Mở trong tab mới
                  )
                }
                variant="primary"
                className="mt-2 text-xs"
              >
                Xem sản phẩm
              </Button>

              {visibleAds.length > 1 && (
                <div className="flex justify-end mt-2">
                  <button
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() =>
                      setCurrentAdIndex(
                        (prev) => (prev + 1) % visibleAds.length
                      )
                    }
                  >
                    ▶
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4">
        <Button
          onClick={() => router.push("/course/working-with-ai")}
          variant="primary"
        >
          Tập luyện với AI
        </Button>
      </div>

      <div className="flex flex-row justify-between w-full max-w-[750px] mt-6 p-4">
        <div className="flex flex-col space-y-4">
          {lecture ? (
            <>
              <div className="flex flex-row items-center">
                <h3 className="text-2xl font-bold">{lecture.title}</h3>
                <span className="ml-5 text-sm text-gray-500">
                  {lecture.duration}
                </span>
              </div>
              <div
                className="flex flex-row items-center space-x-3 cursor-pointer"
                onClick={() =>
                  router.push(`/course/teacher/${course?.teacher.id}`)
                }
              >
                <Image
                  src={course?.teacher.profilePicture || "/default-image.jpg"}
                  alt="Avatar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {course?.teacher.fullName}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {course?.teacher.introduction}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div>Loading lecture data...</div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      {isExpanded ? (
        <div
          className="z-10 fixed bottom-0 w-full bg-gradient-to-r from-pink-500 to-orange-500 py-5 px-8 h-[366px] flex flex-col text-white shadow-md transition-height duration-300 overflow-y-auto"
          style={{
            backgroundImage:
              "-webkit-linear-gradient(-84.28deg, rgb(236, 52, 150) 0%, rgb(255, 118, 0) 100%)",
          }}
        >
          <div className="flex justify-between items-center w-full">
            <button onClick={handleExpandCollapse} className="text-white">
              <ExpandCircleDownIcon />
            </button>
            <span className="font-semibold text-sm md:text-base mx-4 whitespace-nowrap">
              Tập Yoga cơ bản ngay tại nhà
            </span>
            <Button
              variant="secondary"
              onClick={() =>
                router.push(
                  `/course/lession/${courseId}/${parseInt(lectureId as string) + 1}`
                )
              }
            >
              Bài tiếp theo
            </Button>
          </div>
          <div className="mt-4 w-full text-left overflow-y-auto max-h-[250px]">
            {course?.sections.map((section) => (
              <div key={section.id} className="mb-4">
                <h2 className="text-xl font-bold">{section.title}</h2>
                {section.lectures.map((lec) => (
                  <LectureItem
                    courseId={course.id}
                    isChoosen={lec.id === parseInt(lectureId as string)}
                    key={lec.id}
                    id={lec.id}
                    title={lec.title}
                    thumbnail={lec.image}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="fixed bottom-0 w-full bg-gradient-to-r from-pink-500 to-orange-500 py-5 px-8 flex justify-between items-center text-white shadow-md transition-height duration-300"
          style={{
            backgroundImage:
              "-webkit-linear-gradient(-84.28deg, rgb(236, 52, 150) 0%, rgb(255, 118, 0) 100%)",
          }}
        >
          <button onClick={handleExpandCollapse} className="text-white">
            <ExpandCircleDownIcon className="rotate-180" />
          </button>
          <span className="font-semibold text-sm md:text-base mx-4 whitespace-nowrap">
            Tập Yoga cơ bản ngay tại nhà
          </span>
          <Button
            variant="secondary"
            onClick={() =>
              router.push(
                `/course/lession/${courseId}/${parseInt(lectureId as string) + 1}`
              )
            }
          >
            Bài tiếp theo
          </Button>
        </div>
      )}
    </div>
  );
};

export default LessionPage;
