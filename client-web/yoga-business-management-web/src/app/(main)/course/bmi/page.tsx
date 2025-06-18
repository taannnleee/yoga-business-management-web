"use client";
import React, { useEffect, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import RadioGroup from "@/app/(main)/course/bmi/RadioGroup";
import { DatePicker, Space, Button, Select, Divider, Collapse } from "antd";
import CustomSlider from "./CustomSlider";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useDietStore } from "@/app/(main)/bmi_resullt/diet";

const DietPage = () => {
  const activities = [
    "Little/no exercise",
    "Light exercise",
    "Moderate exercise (3-5 days/wk)",
    "Very active (6-7 days/wk)",
    "Extra active (very active & physical job)",
  ];
  const plans = [
    "Maintain weight",
    "Mild weight loss",
    "Weight loss",
    "Extreme weight loss",
  ];
  const infoHealth = [
    {
      key: "1",
      label: "Chỉ số BMI là gì? - Định nghĩa chỉ số cơ thể BMI",
      children: (
        <p>
          Chỉ số BMI (Body Mass Index) là một chỉ số dùng để đánh giá tình trạng
          cơ thể của một người dựa trên cân nặng và chiều cao. Chỉ số BMI giúp
          phân loại mức độ béo phì, gầy hay cân đối của cơ thể.
        </p>
      ),
    },
    {
      key: "2",
      label: "Giải thích chỉ số BMI",
      children: (
        <p>
          Đối với người lớn từ 20 tuổi trở lên, BMI được tính bằng cách sử dụng
          các phân loại trạng thái cân nặng tiêu chuẩn. Các chuẩn này giống nhau
          với nam giới và phụ nữ ở mọi thể trạng và lứa tuổi. Đối với trẻ em và
          thanh thiếu niên, BMI phân biệt theo tuổi và giới tính và thường được
          gọi là BMI theo tuổi. Ở trẻ em, lượng chất béo trong cơ thể cao có thể
          dẫn đến các bệnh liên quan đến cân nặng và các vấn đề sức khỏe khác.
          Thiếu cân cũng có thể tăng nguy cơ mắc một số tình trạng sức khỏe,
          bệnh lý. Chỉ số BMI cao thường cho thấy cơ thể thừa cân. Chỉ số này
          không trực tiếp đo lượng mỡ trong cơ thể nhưng có tương quan với các
          phép đo trực tiếp xác định lượng mỡ trong cơ thể.
        </p>
      ),
    },
    {
      key: "3",
      label: "Công thức tính BMI là gì?",
      children: (
        <p>
          Bạn có thể kiểm tra chỉ số BMI của mình bằng cách sử dụng chiều cao và
          trọng lượng cơ thể. Để tính chỉ số BMI của một người trưởng thành, hãy
          chia trọng lượng (theo kg) cho bình phương chiều cao (theo m) hay BMI
          = (trọng lượng cơ thể)/ (chiều cao x chiều cao) Đối với người lớn, chỉ
          số BMI từ 18,5-24,9 nằm trong mức cân nặng bình thường hoặc khỏe mạnh.
          Chỉ số BMI từ 25,0 trở lên là thừa cân, trong khi chỉ số BMI dưới 18,5
          là thiếu cân.
        </p>
      ),
    },
    {
      key: "4",
      label: "Tại sao bạn nên biết về chỉ số BMI",
      children: (
        <p>
          Đánh giá tình trạng cơ thể: BMI là một công cụ đơn giản để xác định
          liệu bạn có đang ở trong phạm vi cân nặng khỏe mạnh hay không. Nó giúp
          bạn nhận biết liệu mình có thừa cân, thiếu cân, hay đang ở mức bình
          thường. Ngăn ngừa các bệnh lý liên quan đến cân nặng: BMI có thể giúp
          bạn nhận diện các nguy cơ sức khỏe liên quan đến thừa cân hoặc béo
          phì, chẳng hạn như bệnh tim mạch, tiểu đường, cao huyết áp, và nhiều
          bệnh mãn tính khác. Việc theo dõi chỉ số BMI sẽ giúp bạn chủ động
          phòng ngừa các vấn đề này. Dễ dàng theo dõi sự thay đổi sức khỏe: Khi
          bạn theo dõi chỉ số BMI của mình theo thời gian, bạn có thể dễ dàng
          nhận biết được sự thay đổi trong tình trạng cơ thể, chẳng hạn như sự
          tăng cân hoặc giảm cân, từ đó có thể đưa ra những điều chỉnh cần thiết
          trong chế độ ăn uống và tập luyện.
        </p>
      ),
    },
    {
      key: "5",
      label: "Chỉ số BMI cao có gây nguy hiểm nghiêm trọng đến sức khỏe không?",
      children: (
        <p>
          Chỉ số BMI cao, đặc biệt là khi nằm trong phạm vi thừa cân (25–29.9)
          hoặc béo phì (30 trở lên), có thể gây nguy hiểm nghiêm trọng đến sức
          khỏe nếu không được kiểm soát. Dưới đây là một số lý do tại sao BMI
          cao có thể ảnh hưởng xấu đến sức khỏe
        </p>
      ),
    },
    {
      key: "6",
      label: "Những nguy cơ gây béo phì bạn cần nắm",
      children: (
        <p>
          Béo phì là một tình trạng sức khỏe phức tạp và có thể gây ra nhiều vấn
          đề nghiêm trọng cho cơ thể. Dưới đây là những nguy cơ chính có thể dẫn
          đến béo phì mà bạn cần nắm:
          <br />– Chế độ ăn uống không lành mạnh
          <br />– Lối sống ít vận động
          <br />– Rối loạn nội tiết
          <br />– Căng thẳng và yếu tố tâm lý
          <br />– Tuổi tác
          <br />– Viêm xương khớp
          <br />– Ngưng thở khi ngủ và các vấn đề về hô hấp
          <br />– Tình trạng viêm mãn tính và tăng stress oxy hóa
          <br />– Thuốc và các vấn đề y tế khác
          <br />– Trầm cảm, rối loạn lo âu và các tình trạng sức khỏe tâm thần
          khác
        </p>
      ),
    },
  ];

  const [selectGoal, setSelectGoal] = useState("Maintain weight");
  const [selectActivity, setSelectActivity] = useState<string | null>(null);
  const [currentSex, setCurrentSex] = useState("Male");
  const [currentHeight, setCurrentHeight] = useState<number>(170);
  const [currentWeight, setCurrentWeight] = useState<number>(65);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const router = useRouter();
  const { person, setPerson } = useDietStore((state: any) => state);

  useEffect(() => {
    if (!person) return;
    setCurrentWeight(parseInt(person.weight) || 65);
    setCurrentHeight(parseInt(person.height) || 170);
    setMealsPerDay(parseInt(person.meals_calories_perc || 3));
    setSelectActivity(person.activity);
    setSelectGoal(person.weight_loss);
  }, [person]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Form */}
        <div className="md:w-1/2 w-full px-8 py-10 flex flex-col gap-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-700 mb-2">
              Thông tin cá nhân
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Vui lòng nhập thông tin để nhận được chế độ dinh dưỡng phù hợp
              nhất cho bạn.
            </p>
            <Divider />
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-medium mb-1">Ngày sinh</label>
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                defaultValue={dayjs()}
                className="w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Giới tính</label>
              <RadioGroup
                options={[
                  { label: "Nam", value: "Male" },
                  { label: "Nữ", value: "Female" },
                ]}
                value={currentSex}
                onChange={(val: string) => setCurrentSex(val)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Chiều cao (cm)</label>
              <input
                value={currentHeight}
                onChange={(e) => setCurrentHeight(Number(e.target.value))}
                type="number"
                min={80}
                max={250}
                className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Cân nặng (kg)</label>
              <input
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                type="number"
                min={20}
                max={200}
                className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Mức độ vận động</label>
              <Select
                style={{ width: "100%" }}
                value={selectActivity}
                onChange={(value) => setSelectActivity(value)}
                placeholder="Chọn mức độ vận động"
                options={activities.map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Số bữa ăn/ngày</label>
              <CustomSlider
                min={1}
                max={4}
                onChange={(value: number) => setMealsPerDay(value)}
                inputValue={mealsPerDay}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Mục tiêu</label>
              <Select
                style={{ width: "100%" }}
                value={selectGoal}
                onChange={(value) => setSelectGoal(value)}
                placeholder="Chọn mục tiêu"
                options={plans.map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </div>
          </div>
          <Button
            size="large"
            block
            type="primary"
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
            onClick={() => {
              let data = {
                height: currentHeight,
                weight: currentWeight,
                gender: currentSex,
                activity: selectActivity,
                meals_calories_perc: mealsPerDay,
                weight_loss: selectGoal,
              };
              setPerson(data);
              router.push("/bmi_resullt");
            }}
          >
            Xem kết quả
          </Button>
        </div>
        {/* Right Info */}
        <div className="md:w-1/2 w-full bg-gradient-to-tl from-blue-100 to-white px-8 py-10 flex flex-col justify-center">
          <div className="mb-4 flex items-center gap-2">
            <IoIosInformationCircleOutline
              className="text-blue-500"
              size={28}
            />
            <span className="text-lg font-semibold text-blue-700">
              Thông tin về BMI
            </span>
          </div>
          <Collapse
            defaultActiveKey={["1"]}
            accordion
            ghost
            items={infoHealth}
            className="bg-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default DietPage;
