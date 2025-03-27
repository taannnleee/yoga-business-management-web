"use client";
import React, { useEffect, useState } from "react";
import { HeartOutlined, LikeOutlined } from "@ant-design/icons";
import Loading from "@/app/(main)/bmi_resullt/Loading";
import { Breadcrumb, Skeleton, Tabs } from "antd";
import { FaArrowDown, FaGlassWater, FaS } from "react-icons/fa6";
// import { useDietStore } from "@/app/(main)/bmi_resullt/diet";

import BMIWeight from "@/app/(main)/bmi_resullt/bodies";
const BMIResult = () => {
    const [BMI, setBMI] = useState(0);
    const [isLoadingMeals, setIsLoadingMeals] = useState(false);
    const [isLoadingCalories, setIsLoadingCalories] = useState(false);
    // const person = useDietStore((state) => state.person);
    const [person, setPerson] = useState(null);
    const [bmiData, setBmiData] = useState(null);
    const [meals, setMeals] = useState(null);

    const generateMeals = async () => {
        setIsLoadingMeals(true);
        const res = await fetch(
            `${import.meta.env.VITE_PUBLIC_ML_API_URL}/bmi/recommend`,
            {
                method: "POST",
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(person),
            }
        );
        const data = await res.json();
        setIsLoadingMeals(false);
    };
    // const { setHealthInfo } = useDietStore((state) => state);
    const setHealthInfo = useState(null);

    useEffect(() => {
        if (!person) return;
        (async () => {
            setIsLoadingCalories(true);
            const res = await fetch(
                `${import.meta.env.VITE_PUBLIC_ML_API_URL}/bmi/calories`,
                {
                    method: "POST",
                    headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(person),
                }
            );
            const data = await res.json();

            setIsLoadingCalories(false);
            setBmiData(data);
            setBMI(data.bmi);
            setHealthInfo(data);
            generateMeals();
        })();
    }, [person]);
    return (
        //<DefaultLayout>
        <>
            <section className="space-y-6 flex flex-col justify-center pb-7">
                <div>
                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: "Home",
                                href: "/home",
                            },
                            {
                                title: "BMI calculator",
                                href: "/diet",
                            },
                            {
                                title: "BMI result",
                                href: "",
                            },
                        ]}
                    />
                </div>
                <div className="bg-slate-100 p-2 flex justify-center items-center">
                    <p className="flex  flex-col justify-center items-center">
                        Note: CareX only provides estimated values.
                        <a className="text-blue-500" href="/diet">
                            Calculate again
                        </a>
                    </p>
                </div>
                {isLoadingCalories ? (
                    <div>
                        <Skeleton active />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-center">
                            <p className="text-3xl font-bold">
                                Your BMI index is{" "}
                                <span className="text-blue-500 font-bold">
                                    {bmiData?.bmi} kg/m²
                                </span>
                                <br />
                                <p className="text-center text-base ">
                                    Healthy BMI range: 18.5 kg/m² - 25 kg/m².
                                </p>
                            </p>
                        </div>

                        <BMIWeight BMI={BMI} />
                        <div>
                            <div className="flex flex-row w-full h-5 rounded-lg">
                                <div className="w-3/6 bg-blue-500 rounded-l-lg"></div>
                                <div className="w-[140px] bg-green-500"></div>
                                <div className="w-[90px] bg-yellow-500"></div>
                                <div className="w-[190px] bg-orange-500"></div>
                                <div className="w-[210px] bg-red-500 rounded-r-lg"></div>
                            </div>
                            <div className="flex flex-row w-full text-lg font-bold text-slate-500">
                                <div className="w-3/6 ">0</div>
                                <div className="w-[140px]">18.5</div>
                                <div className="w-[90px]">23</div>
                                <div className="w-[190px]">25</div>
                                <div className="w-[210px]">30+</div>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </>
    );
};

export default BMIResult;
