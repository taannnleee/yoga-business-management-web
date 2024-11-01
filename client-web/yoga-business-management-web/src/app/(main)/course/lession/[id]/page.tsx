"use client"
import React from "react";
import CourseCard from "@/components/organisms/CourseCard";
import {useParams, useRouter} from "next/navigation";
import Video from "next-video";
import video101 from '/videos/video101.mp4';
const DisCoverPage: React.FC<any> = () => {
    const router = useRouter();
    const params = useParams();
    const lessionId = params?.id;


    return (
        <div className="w-screen">
            <Video src={video101} className={"max-w-[750px]"}/>
        </div>
    );
};

export default DisCoverPage;
