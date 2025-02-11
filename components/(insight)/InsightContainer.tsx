import React, { useState } from "react";
import { View, Text } from "react-native";
import { DateNavigator } from "./DateNavigator";
import { TimeRangeNavigator } from "./TimeRangeNavigator";

interface StatBoxProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, icon }) => (
  <View className="flex-1 bg-[#2C2C2E] rounded-xl p-4 mx-1">
    <View className="flex-row items-center justify-between">
      <Text className="text-gray-400 font-nunito-medium">{label}</Text>
      {icon}
    </View>
    <Text className="text-white text-2xl font-nunito-bold mt-2">{value}</Text>
  </View>
);

interface FocusBarProps {
  label: string;
  percentage: number;
  duration: string;
  color: string;
}

const FocusBar: React.FC<FocusBarProps> = ({
  label,
  percentage,
  duration,
  color,
}) => (
  <View className="mb-3">
    <View className="flex-row items-center justify-between mb-1">
      <View className="flex-row items-center">
        <View
          style={{ width: `${percentage}%` }}
          className={`h-8 rounded-lg ${color}`}
        />
      </View>
      <View className="flex-row items-center">
        <Text className="text-white font-nunito-bold mr-2">{label}</Text>
        <Text className="text-gray-400">{duration}</Text>
      </View>
    </View>
    <Text className="text-white font-nunito-medium">{percentage}%</Text>
  </View>
);

export const InsightContainer = () => {
  const [selectedRange, setSelectedRange] = useState<
    "Day" | "Week" | "Month" | "Year"
  >("Week");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Example data - in real app, this would come from your database
  const stats = {
    totalTomatoes: 382,
    totalDays: 164,
    totalFocus: "447h 22m",
    focusBreakdown: [
      { label: "FYP", percentage: 45, duration: "10h", color: "bg-orange-500" },
      {
        label: "BC_L",
        percentage: 24,
        duration: "5h37m",
        color: "bg-pink-500",
      },
      {
        label: "ML_T",
        percentage: 17,
        duration: "3h55m",
        color: "bg-teal-500",
      },
      {
        label: "ML_L",
        percentage: 14,
        duration: "3h20m",
        color: "bg-teal-400",
      },
    ],
  };

  return (
    <View className="flex-1 bg-black">
      <TimeRangeNavigator
        onRangeChange={setSelectedRange}
        onDateChange={setCurrentDate}
      />

      {/* Stats Grid */}
      <View className="flex-row mt-4">
        <StatBox
          label="Total Tomatoes"
          value={stats.totalTomatoes}
          icon={<Text className="text-orange-500">🍅</Text>}
        />
        <StatBox label="Total Days" value={stats.totalDays} />
      </View>

      {/* Focus Stats */}
      <View className="bg-[#1C1C1E] mt-4 p-4 rounded-2xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-400 font-nunito-medium">
            {selectedRange}'s Focus
          </Text>
          <Text className="text-white text-xl font-nunito-bold">
            {stats.totalFocus}
          </Text>
        </View>

        {/* Focus Breakdown */}
        <View>
          {stats.focusBreakdown.map((item, index) => (
            <FocusBar
              key={index}
              label={item.label}
              percentage={item.percentage}
              duration={item.duration}
              color={item.color}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
