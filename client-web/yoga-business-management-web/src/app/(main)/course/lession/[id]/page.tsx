"use client";
import React, { useState } from "react"; // Import useState
import CourseCard from "@/components/organisms/CourseCard";
import { useParams, useRouter } from "next/navigation";
import Video from "next-video";
import video101 from '../../../../../../videos/video101.mp4';
import Image from "next/image";
import Button from "@/components/atom/Button";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import LessionItem from "@/components/organisms/LessionItem";
import LectureItem from "@/components/organisms/LessionItem"; // Đổi từ LessionItem thành LectureItem

const sections = [
    {
        id: 1,
        title: "Phần 1: Tổng quan",
        lectures: [
            { id: 101, title: "Giới thiệu và các lưu ý trước khi tập", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 2,
        title: "Phần 2: Đánh thức cơ thể",
        lectures: [
            { id: 201, title: "Làm mềm cơ", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 202, title: "Lưu thông khí huyết", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 3,
        title: "Phần 3: Tăng cường thải độc",
        lectures: [
            { id: 301, title: "Thải độc", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 302, title: "Thư giãn tinh thần", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 4,
        title: "Phần 4: Tiêu trừ mệt mỏi",
        lectures: [
            { id: 401, title: "Bổ sung năng lượng", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 402, title: "Đẩy lùi mệt mỏi", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 5,
        title: "Phần 5: Thả lỏng dẻo dai",
        lectures: [
            { id: 501, title: "Thả lỏng thân thể", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 502, title: "An lạc tinh thần", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 6,
        title: "Phần 6: Tăng cường tiêu hóa",
        lectures: [
            { id: 601, title: "Massage nội tạng", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 602, title: "Hấp thụ tối ưu dinh dưỡng", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 7,
        title: "Phần 7: Mềm dẻo toàn thân",
        lectures: [
            { id: 701, title: "Hâm nóng nội tạng", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 702, title: "Điều hòa hơi thở", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 8,
        title: "Phần 8: Linh hoạt cơ khớp",
        lectures: [
            { id: 801, title: "Mềm dẻo gân cơ", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 802, title: "Trẻ hóa các khớp", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 9,
        title: "Phần 9: Hâm nóng cơ thể",
        lectures: [
            { id: 901, title: "Sưởi ấm cơ và nội tạng", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 902, title: "Kích hoạt sản sinh hormone có ích", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 10,
        title: "Phần 10: Điều dưỡng tinh thần",
        lectures: [
            { id: 1001, title: "Thiền thư giãn", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 1002, title: "Lắng dịu tinh thần", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 11,
        title: "Phần 11: Làm đẹp toàn thân",
        lectures: [
            { id: 1101, title: "Duy trì sức khỏe", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 1102, title: "Đánh thức vẻ đẹp", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 12,
        title: "Phần 12: Duy trì năng lượng",
        lectures: [
            { id: 1201, title: "Tối ưu năng lượng", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 1202, title: "Duy trì sức khỏe dồi dào", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
    {
        id: 13,
        title: "Phần 13: Tăng cơ săn chắc",
        lectures: [
            { id: 1301, title: "Tăng cơ, loại mỡ", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
            { id: 1302, title: "Giữ gìn cơ thể khỏe mạnh", thumbnail: "https://images.pexels.com/photos/29143437/pexels-photo-29143437/free-photo-of-cac-vu-cong-ballet-duyen-dang-t-i-studio-toronto.jpeg" },
        ],
    },
];

const LessionPage: React.FC<any> = () => {
    const router = useRouter();
    const params = useParams();
    const lectureId = params?.id;

    // State for controlling the height of the sticky bottom bar
    const [isExpanded, setIsExpanded] = useState(false);

    // Function to toggle the visibility of the sticky bottom bar
    const handleExpandCollapse = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <div className="flex flex-col items-center py-6 px-4 min-h-screen bg-white">
            <div className="w-full max-w-[750px]">
                {/* Top Black Line */}
                <div className="border-t-2 border-black-500" />
                <Video src={video101} className="w-full rounded-lg shadow-lg" />
                {/* Bottom Black Line */}
                <div className="border-b-2 border-black-500" />
            </div>

            <div className="flex flex-row justify-between w-full max-w-[750px] mt-6 p-4">
                {/* Left Side - Video Information */}
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center">
                        <h3 className="text-2xl font-bold">Giới thiệu và các lưu ý trước khi tập</h3>
                        <span className="ml-5 text-sm text-gray-500">3 phút</span>
                    </div>
                    <div className="flex flex-row items-center space-x-3 cursor-pointer"
                    onClick={() => router.push('http://localhost:3000/course/teacher/1')}
                    >
                        {/* Avatar */}
                        <Image
                            src="https://yoga.vn/data/avatars/photo_5b63c7116803fa784a69e833_1533285335.jpg"
                            alt="Avatar"
                            width={50}
                            height={50}
                            className="rounded-full"
                        />
                        <div>
                            <h3 className="text-lg font-semibold">Nguyễn Hiếu</h3>
                            <span className="text-sm text-gray-500">Đại sứ Yoga Việt Nam - CEO Zenlife Yoga</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Buttons */}
                <div className="flex flex-col space-y-2">
                    <Button variant="secondary" className="w-[182px] h-[44px] bg-[#0e3521] text-white rounded-lg hover:bg-[#0b291a] text-sm">
                        Đánh dấu khóa học
                    </Button>
                    <Button variant="secondary" className="w-[182px] h-[44px] bg-[#a5a5a5] text-white rounded-lg hover:bg-[#8b8b8b] text-sm">
                        Thêm vào yêu thích
                    </Button>
                    <Button variant="secondary" className="w-[182px] h-[44px] bg-[#f05dab] text-white rounded-lg hover:bg-[#cc498c] text-sm">
                        Mở khóa Premium
                    </Button>
                </div>
            </div>

            {/* Description */}
            <div className="mt-6 w-full max-w-[750px] text-center">
                <p className="text-gray-700 text-base">
                    Cải thiện sức khoẻ tinh thần và thể chất với những bài tập Yoga cơ bản ngay tại nhà của bạn.
                </p>
            </div>

            {/* Conditional Sticky Bottom Bar */}
            {isExpanded ? (
                <div
                    className={`z-10 fixed bottom-0 w-full bg-gradient-to-r from-pink-500 to-orange-500 py-5 px-8 h-[366px] flex flex-col justify-start items-center text-white shadow-md transition-height duration-300 overflow-y-auto`}
                    style={{
                        backgroundImage: "-webkit-linear-gradient(-84.28deg, rgb(236, 52, 150) 0%, rgb(255, 118, 0) 100%)"
                    }}
                >
                    <div>
                        <div className="flex justify-between items-center w-full">
                            {/* Left Arrow Icon */}
                            <button
                                onClick={handleExpandCollapse}
                                className="text-white flex items-center justify-center mr-4"
                            >
                                <ExpandCircleDownIcon
                                    className={`transition-transform ${isExpanded ? "" : "rotate-180"}`}
                                    style={{fontSize: 20}}/>
                            </button>

                            {/* Center Text */}
                            <span className="font-semibold text-sm md:text-base mx-4 whitespace-nowrap">
                                Tập Yoga cơ bản ngay tại nhà với Nguyễn Hiếu
                            </span>

                            {/* Right Side - Next Lesson Button */}
                            <Button
                                variant="secondary"
                                className="w-[182px] h-[44px] bg-[#78c1f6] text-white rounded-lg hover:bg-[#78c1f6] text-sm"
                            >
                                Bài tiếp theo
                            </Button>
                        </div>

                        {/* Content Section */}
                        <div className="mt-4 w-full text-left overflow-y-auto max-h-[250px]">
                            <div className="text-sm md:text-base flex flex-col space-y-4">
                                {sections.map((section) => (
                                    <div key={section.id} className="mb-4">
                                        <h2 className="text-xl font-bold">{section.title}</h2>
                                        {section.lectures.map((lecture) => (
                                            <LectureItem
                                                isChoosen={lecture.id === parseInt(lectureId as string)}
                                                key={lecture.id}
                                                id={lecture.id}
                                                title={lecture.title}
                                                thumbnail={lecture.thumbnail}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className={`fixed bottom-0 w-full bg-gradient-to-r from-pink-500 to-orange-500 py-5 px-8 flex justify-between items-center text-white shadow-md transition-height duration-300`}
                    style={{
                        backgroundImage: "-webkit-linear-gradient(-84.28deg, rgb(236, 52, 150) 0%, rgb(255, 118, 0) 100%)"
                    }}
                >
                    {/* Left Arrow Icon */}
                    <button
                        onClick={handleExpandCollapse}
                        className="text-white flex items-center justify-center mr-4"
                    >
                        <ExpandCircleDownIcon className={`transition-transform ${isExpanded ? "" : "rotate-180"}`}/>
                    </button>

                    {/* Center Text */}
                    <span className="font-semibold text-sm md:text-base mx-4 whitespace-nowrap">
                        Tập Yoga cơ bản ngay tại nhà với Nguyễn Hiếu
                    </span>

                    {/* Right Side - Next Lesson Button */}
                    <Button variant="secondary"
                            onClick={() => router.push(`/course/lession/${parseInt(lectureId as string) + 1}`)}
                            className="w-[182px] h-[44px] bg-[#78c1f6] text-white rounded-lg hover:bg-[#78c1f6] text-sm">
                        Bài tiếp theo
                    </Button>
                </div>
            )}
        </div>
    );
};

export default LessionPage;
