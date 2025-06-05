"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/atom/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const globalTrendData = [
  { year: 2002, meditation: 7.6, yoga: 5.1, relaxation: 3.0 },
  { year: 2007, meditation: 9.4, yoga: 6.1, relaxation: 3.2 },
  { year: 2012, meditation: 8.0, yoga: 8.9, relaxation: 2.9 },
  { year: 2017, meditation: 14.2, yoga: 14.3, relaxation: 4.1 },
  { year: 2022, meditation: 18.3, yoga: 16.8, relaxation: 6.7 },
];

const globalPreferenceData = [
  { category: "Time of Day", Morning: 45, Afternoon: 30, Evening: 25 },
  { category: "Group Size", Individual: 40, SmallGroup: 35, LargeGroup: 25 },
  { category: "Location", Outdoors: 55, Studio: 30, Home: 15 },
  { category: "Attire", Comfortable: 50, Athletic: 30, Casual: 20 },
];

const vietnamTrendData = [
  { year: 2010, yoga: 2.1 },
  { year: 2015, yoga: 5.8 },
  { year: 2020, yoga: 12.3 },
  { year: 2024, yoga: 20.5 },
];

const vietnamPreferenceData = [
  {
    category: "Thời gian",
    Morning: 55,
    Afternoon: 30,
    Evening: 15,
  },
  {
    category: "Hình thức",
    Individual: 30,
    SmallGroup: 50,
    LargeGroup: 20,
  },
  {
    category: "Địa điểm",
    Outdoors: 40,
    Studio: 50,
    Home: 10,
  },
  {
    category: "Trang phục",
    Stretchy: 60,
    Comfortable: 30,
    Fashionable: 10,
  },
];

const vietnamLabelMap: Record<string, string> = {
  Morning: "Sáng",
  Afternoon: "Chiều",
  Evening: "Tối",
  Individual: "Cá nhân",
  SmallGroup: "Nhóm nhỏ",
  LargeGroup: "Nhóm lớn",
  Outdoors: "Ngoài trời",
  Studio: "Trung tâm",
  Home: "Tại nhà",
  Stretchy: "Co giãn",
  Comfortable: "Thoải mái",
  Fashionable: "Thời trang",
};

export default function TrendingPage() {
  const [region, setRegion] = useState<"vietnam" | "global">("vietnam");

  const isVN = region === "vietnam";

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-indigo-600">
          Xu hướng Yoga & Sức khỏe
        </h1>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
          value={region}
          onChange={(e) => setRegion(e.target.value as "vietnam" | "global")}
        >
          <option value="vietnam">🇻🇳 Việt Nam</option>
          <option value="global">🌐 Quốc tế</option>
        </select>
      </div>

      {/* Biểu đồ tăng trưởng */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="text-2xl font-semibold text-gray-700">
          Tăng trưởng {isVN ? "tại Việt Nam" : "quốc tế"}
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {isVN ? (
              <LineChart data={vietnamTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="yoga"
                  stroke="#82ca9d"
                  name="Yoga"
                  strokeWidth={2}
                />
              </LineChart>
            ) : (
              <LineChart data={globalTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="meditation"
                  stroke="#8884d8"
                  name="Thiền"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="yoga"
                  stroke="#82ca9d"
                  name="Yoga"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="relaxation"
                  stroke="#ffc658"
                  name="Thư giãn"
                  strokeWidth={2}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Biểu đồ sở thích */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="text-2xl font-semibold text-gray-700">
          Sở thích luyện tập
        </CardHeader>
        <CardContent className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={isVN ? vietnamPreferenceData : globalPreferenceData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(
                (isVN ? vietnamPreferenceData : globalPreferenceData)[0]
              )
                .filter((key) => key !== "category")
                .map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={
                      ["#8884d8", "#82ca9d", "#ffc658", "#a4de6c"][index % 4]
                    }
                    name={key}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Các phát hiện chính */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="text-2xl font-semibold text-gray-700">
          {isVN ? "Điểm nổi bật tại Việt Nam" : "Những phát hiện quốc tế"}
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            {isVN ? (
              <>
                <li>
                  85% người tập yoga cảm thấy sức khỏe và tinh thần được cải
                  thiện.
                </li>
                <li>
                  Trường phái phổ biến: Hatha, Vinyasa, Ashtanga, Yin, Power.
                </li>
                <li>Trung tâm lớn: Vyoga World, Shine Yoga.</li>
                <li>Trang phục co giãn, thoáng khí được ưa chuộng nhất.</li>
                <li>Tập ngoài trời và nhóm nhỏ ngày càng phổ biến.</li>
              </>
            ) : (
              <>
                <li>
                  Thiền dẫn đầu với 18.3% người trưởng thành tại Mỹ tham gia.
                </li>
                <li>Yoga có tốc độ tăng trưởng nhanh nhất kể từ năm 2002.</li>
                <li>
                  Buổi sáng là thời điểm được ưa chuộng nhất để luyện tập.
                </li>
                <li>Ngoài trời là địa điểm luyện tập phổ biến nhất.</li>
                <li>Hình thức nhóm nhỏ được ưa chuộng hơn cả.</li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
