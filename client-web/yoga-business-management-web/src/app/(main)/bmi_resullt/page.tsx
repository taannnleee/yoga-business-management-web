"use client";
import React, { useEffect, useState } from "react";
import { HeartOutlined } from "@ant-design/icons";
import Loading from "./Loading";
import { Breadcrumb, Skeleton, Tabs } from "antd";
import { FaArrowDown } from "react-icons/fa6";
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
      setBmiData(data.data);
      setBMI(data.data?.bmi);
      setHealthInfo(data.data);
      generateMeals();
    })();
    // eslint-disable-next-line
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
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="max-w-3xl mx-auto bg-white/95 rounded-2xl shadow-2xl px-8 py-8 md:px-12 md:py-10">
        <Breadcrumb
          separator=">"
          items={[
            { title: "Home", href: "/home" },
            { title: "BMI calculator", href: "/diet" },
            { title: "BMI result", href: "" },
          ]}
          className="mb-6"
        />

        <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <span className="text-lg font-semibold text-blue-700">
              Lưu ý: Kết quả chỉ mang tính chất tham khảo.
            </span>
            <div className="text-gray-500 text-sm mt-1">
              The yoga only provides estimated values.
            </div>
          </div>
          <a
            className="mt-3 md:mt-0 text-blue-600 text-base font-semibold hover:text-blue-800 hover:underline transition-all duration-300"
            href="/bmi"
          >
            Tính lại chỉ số
          </a>
        </div>

        {isLoadingCalories ? (
          <Skeleton active className="mb-8" />
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="text-3xl font-bold text-center mb-2">
                Chỉ số BMI của bạn là{" "}
                <span className="text-blue-600 font-extrabold">
                  {bmiData?.bmi} kg/m²
                </span>
              </div>
              <div className="text-center text-base text-gray-600">
                Healthy BMI range:{" "}
                <span className="font-semibold">18.5 - 25 kg/m²</span>
              </div>
            </div>

            <div className="flex flex-col items-center w-full mb-8">
              <div className="relative w-full max-w-[440px] mx-auto">
                {/* Hình người BMI */}
                <div className="flex justify-center mb-2">
                  <BMIWeight BMI={BMI} />
                </div>
                {/* Thanh đo BMI */}
                <div className="flex w-full h-5 rounded-lg overflow-hidden">
                  <div className="flex-1 bg-blue-400"></div>
                  <div className="flex-1 bg-green-400"></div>
                  <div className="flex-1 bg-yellow-400"></div>
                  <div className="flex-1 bg-orange-400"></div>
                  <div className="flex-1 bg-red-400"></div>
                </div>
                {/* Nhãn chỉ số */}
                <div className="flex w-full text-xs font-bold text-slate-500 mt-1 justify-between">
                  <span>0</span>
                  <span>18.5</span>
                  <span>23</span>
                  <span>25</span>
                  <span>30+</span>
                </div>
              </div>
            </div>
          </>
        )}

        <Tabs
          defaultActiveKey="1"
          className="mt-8"
          items={[
            {
              key: "1",
              label: (
                <span>
                  <HeartOutlined className="mr-1 text-pink-500" />Ý nghĩa chỉ số
                  BMI
                </span>
              ),
              children: (
                <>
                  {isLoadingCalories ? (
                    <Loading />
                  ) : (
                    <div className="py-4">
                      <div className="flex flex-col md:flex-row gap-6 justify-around rounded-xl border-2 border-blue-100 bg-blue-50 p-6">
                        {bmiData &&
                          bmiData.calories &&
                          Array.isArray(bmiData.calories) ? (
                          bmiData.calories.map((item, key) => (
                            <div
                              className="space-y-2 flex-1 bg-white rounded-lg shadow p-4 flex flex-col items-center"
                              key={key}
                            >
                              <p className="text-base font-semibold text-blue-700">
                                {item.plan}
                              </p>
                              <h1 className="text-2xl font-bold">
                                <span className="text-blue-500">
                                  {item.calories}
                                </span>{" "}
                                <span className="text-gray-500 text-base font-normal">
                                  Calories/ngày
                                </span>
                              </h1>
                              <span className="text-green-600 flex items-center gap-1 text-base font-bold">
                                <FaArrowDown />
                                {item.weight_loss}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">
                            No calorie data available.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
};

export default BMIResult;
