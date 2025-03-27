"use client"
import React, { useEffect, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import RadioGroup from '@/app/(main)/bmi/RadioGroup';
import { DatePicker, Space, Button, Select, Divider, Collapse } from "antd";
import CustomSlider from "./CustomSlider";
import dayjs from "dayjs";
const DietPage = () => {
  let activities = [
    "Little/no exercise",
    "Light exercise",
    "Moderate exercise (3-5 days/wk)",
    "Very active (6-7 days/wk)",
    "Extra active (very active & physical job)",
  ];
  let plans = [
    "Maintain weight",
    "Mild weight loss",
    "Weight loss",
    "Extreme weight loss",
  ];
  const infoHealth = [
    {
      label: "Chỉ số BMI là gì? - Định nghĩa chỉ số cơ thể BMI",
      children: (
        <p>
          Chỉ số BMI (Body Mass Index) là một chỉ số dùng để đánh giá tình trạng cơ thể của một người dựa trên cân nặng và chiều cao. Chỉ số BMI giúp phân loại mức độ béo phì, gầy hay cân đối của cơ thể.
        </p>
      ),
    },
    {
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
      label: "Tại sao bạn nên biết về chỉ số BMI",
      children: (
        <p>
          Đánh giá tình trạng cơ thể: BMI là một công cụ đơn giản để xác định liệu bạn có đang ở trong phạm vi cân nặng khỏe mạnh hay không. Nó giúp bạn nhận biết liệu mình có thừa cân, thiếu cân, hay đang ở mức bình thường.

          Ngăn ngừa các bệnh lý liên quan đến cân nặng: BMI có thể giúp bạn nhận diện các nguy cơ sức khỏe liên quan đến thừa cân hoặc béo phì, chẳng hạn như bệnh tim mạch, tiểu đường, cao huyết áp, và nhiều bệnh mãn tính khác. Việc theo dõi chỉ số BMI sẽ giúp bạn chủ động phòng ngừa các vấn đề này.

          Dễ dàng theo dõi sự thay đổi sức khỏe: Khi bạn theo dõi chỉ số BMI của mình theo thời gian, bạn có thể dễ dàng nhận biết được sự thay đổi trong tình trạng cơ thể, chẳng hạn như sự tăng cân hoặc giảm cân, từ đó có thể đưa ra những điều chỉnh cần thiết trong chế độ ăn uống và tập luyện.
        </p>
      ),
    },
    {
      label: "Chỉ số BMI cao có gây nguy hiểm nghiêm trọng đến sức khỏe không?",
      children: (
        <p>
          Chỉ số BMI cao, đặc biệt là khi nằm trong phạm vi thừa cân (25–29.9) hoặc béo phì (30 trở lên), có thể gây nguy hiểm nghiêm trọng đến sức khỏe nếu không được kiểm soát. Dưới đây là một số lý do tại sao BMI cao có thể ảnh hưởng xấu đến sức khỏe
        </p>
      ),
    },
    {
      label: "Những nguy cơ gây béo phì bạn cần nắm",
      children: (
        <p>
          Béo phì là một tình trạng sức khỏe phức tạp và có thể gây ra nhiều vấn đề nghiêm trọng cho cơ thể. Dưới đây là những nguy cơ chính có thể dẫn đến béo phì mà bạn cần nắm:
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
    }
  ];

  const [selectGoal, setSelectGoal] = useState("Maintain weight");
  const [selectActivity, setSelectActivity] = useState(null);

  const [currentSex, setCurrentSex] = useState("Male");
  const [currentHeight, setCurrentHeight] = useState<number>(170);
  const [currentWeight, setCurrentWeight] = useState<number>(65);
  const [mealsPerDay, setMealsPerDay] = useState(3);

  return (
    <>
      <section>
        <h1 className="text-xl font-bold w-full">Nhập vào thông tin của bạn</h1>
        <div className="flex flex-row gap-3">
          <div className="left-side pt-8 text-sm font-semilbold space-y-6 w-3/6  ml-10">
            <div className="flex flex-col gap-2 ">
              <div className="flex gap-2 items-center">
                <p>Birthdate</p>
              </div>

              <div className="w-full flex justify-center items-center">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <DatePicker

                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    defaultValue={dayjs()}
                  />
                </Space>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-start gap-4 items-center">
                <p>Sex</p>
                <RadioGroup
                  options={[
                    {
                      label: "Male",
                      value: "Male",
                    },
                    {
                      label: "Female",
                      value: "Female",
                    },
                  ]}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Your height (cm)</p>
              <input
                defaultValue={150}
                value={currentHeight}
                onChange={
                  (e) => setCurrentHeight(Number(e.target.value))
                }
                type="number"
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>Weight (kg)</p>
              <input
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                type="number"
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p>Activity level</p>
              <div className="flex  flex-row">
                <Select
                  style={{
                    width: "100%",
                  }}
                  value={selectActivity}
                  onChange={(value) => {
                    setSelectActivity(value);
                  }}
                  placeholder="Give CareX your activity level"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider
                        style={{
                          margin: "8px 0",
                        }}
                      />
                      <Space
                        style={{
                          padding: "0 8px 4px",
                        }}
                      ></Space>
                    </>
                  )}
                  options={activities.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Meals per day</p>
              <div className="flex  flex-row">
                <CustomSlider
                  min={1}
                  max={4}
                  onChange={(value: number) => {
                    setMealsPerDay(value);
                  }}
                  inputValue={mealsPerDay}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Your goal</p>
              <div className="flex  flex-row">
                <Select
                  style={{
                    width: "100%",
                  }}
                  value={selectGoal}
                  onChange={(value) => {
                    setSelectGoal(value);
                  }}
                  placeholder="What's your goal"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider
                        style={{
                          margin: "8px 0",
                        }}
                      />
                      <Space
                        style={{
                          padding: "0 8px 4px",
                        }}
                      ></Space>
                    </>
                  )}
                  options={plans.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
              </div>
            </div>
            <Button
              value="large"
              block
              type="primary"
              onClick={() => {
                // Collect all information
                let data = {
                  // age: AgeCalculate(stringToDate(currentDate)),
                  height: currentHeight,
                  weight: currentWeight,
                  gender: currentSex,
                  activity: selectActivity,
                  meals_calories_perc: mealsPerDay,
                  weight_loss: selectGoal,
                };

                // Save to store
                //Tạo ra đối tượng persion để set 
                // setPerson(data);

                // chuyên trang
                // navigate("/bmiresult");
              }}
            >
              Submit
            </Button>
          </div>
          <div className="right-side pl-10 w-3/6 pt-8">
            <div>
              <p className="flex flex-row justify-start items-center text-base font-semibold text-blue-500">
                <IoIosInformationCircleOutline
                  style={{ width: "40px", height: "20px" }}
                />
                Thông tin
              </p>
              <div>
                <Collapse
                  defaultActiveKey={["1"]}
                  accordion
                  ghost
                  items={infoHealth}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DietPage;