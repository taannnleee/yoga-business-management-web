"use client";
import React, { useEffect, useState } from "react";
import { HeartOutlined, LikeOutlined } from "@ant-design/icons";
import Loading from "@/app/(main)/bmi_resullt/loading";
import { Breadcrumb, Skeleton, Tabs } from "antd";
import { FaArrowDown, FaGlassWater, FaS } from "react-icons/fa6";
import { useDietStore } from "@/app/(main)/bmi_resullt/diet";
import { API_URL } from "@/config/url";

import BMIWeight from "./bodies";
interface BmiData {
  bmi: number;
  calories: {
    plan: string;
    calories: number;
    weight_loss: string;
  }[];
}
const BMIResult = () => {
  const [BMI, setBMI] = useState(0);
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);
  const [isLoadingCalories, setIsLoadingCalories] = useState(false);
  const person = useDietStore((state: any) => state.person);
  const [bmiData, setBmiData] = useState<BmiData | null>(null);
  const [meals, setMeals] = useState<{
    [key: string]: { id: number; recipes: any };
  } | null>(null);

  const generateMeals = async () => {
    setIsLoadingMeals(true);
    const res = await fetch(`${API_URL}/api/bmi/recommend`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    const data = await res.json();
    setMeals(mealPartition(data.output));
    setIsLoadingMeals(false);
  };
  const { setHealthInfo } = useDietStore((state: any) => state);
  useEffect(() => {
    if (!person) return;
    (async () => {
      setIsLoadingCalories(true);
      const res = await fetch(`${API_URL}/api/bmi/calories`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });
      const data = await res.json();

      setIsLoadingCalories(false);
      console.log("BMI data : ", data);
      console.log("BMI : ", data.bmi);
      setBmiData(data.data); // Lưu lại data con vào state
      setBMI(data.data?.bmi); // Lấy giá trị bmi từ data con
      setHealthInfo(data.data);
      generateMeals();
    })();
  }, [person]);

  const mealPartition = (
    meals: any[]
  ): { [key: string]: { id: number; recipes: any } } => {
    if (!meals) return {};

    let mealArc = [
      "Breakfast",
      "Morning Snack",
      "Lunch",
      "Afternoon Snack",
      "Dinner",
      "Meal",
    ];
    let masks: Record<number, number[]> = {
      1: [5],
      2: [0, 2],
      3: [0, 2, 4],
      4: [0, 1, 2, 4],
      5: [0, 1, 2, 3, 4],
    };

    let currentMask = masks[meals.length];
    let mealArcByMask = currentMask.map((index) => mealArc[index]);

    let dict: { [key: string]: { id: number; recipes: any } } = {};
    mealArcByMask.forEach((item, index) => {
      let recipes = meals[index];
      dict[item] = { id: index, recipes: recipes };
    });

    return dict;
  };

  return (
    //<DefaultLayout>
    <>
      <section className="space-y-6 flex flex-col justify-center">
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
        <div className="bg-slate-100 p-4 rounded-lg shadow-lg flex justify-center items-center">
          <p className="flex flex-col justify-center items-center space-y-2">
            <span className="text-lg font-semibold text-slate-700">
              Note: The yoga only provides estimated values.
            </span>
            <a
              className="text-blue-500 text-xl font-semibold hover:text-blue-600 hover:underline transition-all duration-300"
              href="/bmi"
            >
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
              <div className="text-3xl font-bold text-center">
                Your BMI index is{" "}
                <span className="text-blue-500 font-bold">
                  {bmiData?.bmi} kg/m²
                </span>
                <br />
                <div className="text-center text-base">
                  Healthy BMI range: 18.5 kg/m² - 25 kg/m².
                </div>
              </div>
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

        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "What your BMI tells you",
              children: (
                <>
                  {isLoadingCalories ? (
                    <Loading />
                  ) : (
                    <div className="py-4">
                      <div className="flex flex-row pt-4 gap-4 justify-around rounded-xl border-2 h-32">
                        {bmiData &&
                        bmiData.calories &&
                        Array.isArray(bmiData.calories) ? (
                          bmiData.calories.map((item, key) => {
                            return (
                              <div className="space-y-1" key={key}>
                                <p className="text-base">{item.plan}</p>
                                <h1 className="text-3xl">
                                  <span className="text-blue-500">
                                    {item.calories}
                                  </span>{" "}
                                  Calories/day
                                </h1>
                                <span className="text-green-500 flex-row items-center flex text-base font-bold">
                                  <FaArrowDown />
                                  {item.weight_loss}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <p>No calorie data available.</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ),
              icon: <HeartOutlined />,
            },
          ]}
        />
      </section>
    </>
  );
};

export default BMIResult;
