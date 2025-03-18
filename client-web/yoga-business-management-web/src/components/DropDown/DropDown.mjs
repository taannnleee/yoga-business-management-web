import React, { useState, useRef, useEffect } from "react";

export const poseImages = {
    Tree: "/pose_images/tree.jpg",
    Cobra: "/pose_images/cobra.jpg",
    Dog: "/pose_images/dog.jpg",
    Warrior: "/pose_images/warrior.jpg",
    Chair: "/pose_images/chair.jpg",
    Traingle: "/pose_images/traingle.jpg",
    Shoulderstand: "/pose_images/shoulderstand.jpg",
    Half_Frog: "/pose_images/halffrog.png",
};

export default function DropDown({ poseList, currentPose, setCurrentPose }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="bg-[red] px-4 py-2 text-white font-medium rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {currentPose}
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 transition-all">
                    {poseList.map((pose, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                                setCurrentPose(pose);
                                setIsOpen(false); // Đóng dropdown sau khi chọn
                            }}
                        >
                            <p className="text-gray-800">{pose}</p>
                            <img src={poseImages[pose]} alt={pose} className="w-10 h-10 ml-2 rounded-md" />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
