import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { BarChart, ContributionGraph, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

const Statistical = () => {
  const [selectedTab, setSelectedTab] = useState(0); // Manage selected tab
  const [date, setDate] = useState(new Date()); // Manage selected date
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control visibility of DateTimePicker

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate); // Update date in the state
    setShowDatePicker(false); // Hide the picker after selection
  };

  const dataBar = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const data = [
    {
      name: "Đơn thành công",
      population: 12,
      color: "rgba(131, 167, 234, 1)",
    },
    { name: "Đơn huỷ", population: 11, color: "#F00" },
    { name: "Đơn đang xử lý", population: 13, color: "blue" },
    { name: "Đơn đang giao", population: 15, color: "#ffffff" },
  ];
  const data2 = [
    {
      name: "Thảm",
      population: 12,
      color: "rgba(131, 167, 234, 1)",
    },
    { name: "Giày", population: 11, color: "#F00" },
    { name: "Quần áo", population: 13, color: "blue" },
    { name: "Gối", population: 15, color: "#ffffff" },
  ];

  const commitsData = [
    { date: "2017-01-02", count: 1 },
    { date: "2017-01-03", count: 2 },
    { date: "2017-01-04", count: 3 },
    { date: "2017-01-05", count: 4 },
    { date: "2017-01-06", count: 5 },
    { date: "2017-01-30", count: 2 },
    { date: "2017-01-31", count: 3 },
    { date: "2017-02-01", count: 2 },
    { date: "2017-03-02", count: 4 },
    { date: "2017-04-05", count: 2 },
    { date: "2017-05-12", count: 4 },
    { date: "2017-06-12", count: 4 },
    { date: "2017-07-12", count: 4 },
    { date: "2017-08-12", count: 4 },
    { date: "2017-09-12", count: 4 },
    { date: "2017-10-12", count: 4 },
    { date: "2017-11-12", count: 4 },
    { date: "2017-12-12", count: 4 },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }} className={"bg-gray-500"}>
      <SafeAreaView style={{ flex: 1, padding: 16, marginBottom: 16 }}>
        {/* Tab buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          {["Theo ngày", "Theo tháng", "Theo năm"].map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleTabChange(index)}
              style={{
                padding: 8,
                borderBottomWidth: selectedTab === index ? 2 : 0,
                borderBottomColor: "blue",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date picker button */}
        <View style={{ marginBottom: 16 }}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={{ fontSize: 16, color: "blue" }}>
              Chọn ngày: {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DateTimePicker */}
        {showDatePicker && (
          <RNDateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Swiper for charts */}
        <Swiper loop={true} showsPagination={false}>
          {/* First group of charts */}
          <View style={{ flex: 1 }}>
            <>
              <Text className={"flex text-center text-xl"}>
                Biểu đồ tần suất mua hàng
              </Text>
              <ContributionGraph
                values={commitsData}
                endDate={new Date("2017-12-31")}
                numDays={105}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
              />
              <PieChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                absolute
              />
              <Text className={"flex text-center text-xl mt-8 text-amber-400"}>
                Vuốt trái hoặc phải để xem thêm
              </Text>
            </>
          </View>

          {/* Second group of charts */}
          <View style={{ flex: 1 }}>
            <>
              <Text className={"flex text-center text-xl"}>
                Biểu đồ dòng tiền mua hàng
              </Text>
              <BarChart
                data={dataBar}
                width={screenWidth}
                height={220}
                yAxisLabel="$"
                chartConfig={chartConfig}
                verticalLabelRotation={30}
              />
              <PieChart
                data={data2}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                absolute
              />
              <Text className={"flex text-center text-xl mt-8 text-amber-400"}>
                Vuốt trái hoặc phải để xem thêm
              </Text>
            </>
          </View>
        </Swiper>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Statistical;
