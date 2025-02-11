import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  format,
  subYears,
  addYears,
  subMonths,
  addMonths,
  subWeeks,
  addWeeks,
} from "date-fns";

type TimeRange = "Day" | "Week" | "Month" | "Year";

interface TimeRangeNavigatorProps {
  onRangeChange: (range: TimeRange) => void;
  onDateChange: (date: Date) => void;
}

export const TimeRangeNavigator: React.FC<TimeRangeNavigatorProps> = ({
  onRangeChange,
  onDateChange,
}) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("Week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const minDate = subYears(new Date(), 5);

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    onRangeChange(range);
  };

  const formatPeriod = () => {
    switch (selectedRange) {
      case "Day":
        return format(currentDate, "MMM d, yyyy");
      case "Week":
        return `${format(currentDate, "MMM d")} - ${format(
          addWeeks(currentDate, 1),
          "MMM d"
        )}`;
      case "Month":
        return format(currentDate, "MMMM yyyy");
      case "Year":
        return format(currentDate, "yyyy");
      default:
        return "";
    }
  };

  const navigate = (direction: "prev" | "next") => {
    let newDate = currentDate;

    switch (selectedRange) {
      case "Day":
        newDate =
          direction === "prev"
            ? subMonths(currentDate, 1)
            : addMonths(currentDate, 1);
        break;
      case "Week":
        newDate =
          direction === "prev"
            ? subWeeks(currentDate, 1)
            : addWeeks(currentDate, 1);
        break;
      case "Month":
        newDate =
          direction === "prev"
            ? subMonths(currentDate, 1)
            : addMonths(currentDate, 1);
        break;
      case "Year":
        newDate =
          direction === "prev"
            ? subYears(currentDate, 1)
            : addYears(currentDate, 1);
        break;
    }

    // Check if new date is within allowed range
    if (newDate >= minDate && newDate <= new Date()) {
      setCurrentDate(newDate);
      onDateChange(newDate);
    }
  };

  return (
    <View className="bg-[#1C1C1E] p-4 rounded-2xl">
      {/* Time Range Selector */}
      <View className="flex-row justify-between bg-[#2C2C2E] rounded-xl p-1 mb-4">
        {(["Day", "Week", "Month", "Year"] as TimeRange[]).map((range) => (
          <TouchableOpacity
            key={range}
            onPress={() => handleRangeChange(range)}
            className={`flex-1 py-2 px-4 rounded-lg ${
              selectedRange === range ? "bg-white" : ""
            }`}
          >
            <Text
              className={`text-center font-nunito-bold ${
                selectedRange === range ? "text-black" : "text-gray-400"
              }`}
            >
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Period Navigator */}
      <View className="flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigate("prev")} className="p-2">
          <Text className="text-white text-xl">←</Text>
        </TouchableOpacity>

        <Text className="text-white text-lg font-nunito-bold">
          {formatPeriod()}
        </Text>

        <TouchableOpacity onPress={() => navigate("next")} className="p-2">
          <Text className="text-white text-xl">→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
