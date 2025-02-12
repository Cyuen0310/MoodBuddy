import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  format,
  subMonths,
  addMonths,
  subWeeks,
  addWeeks,
  subYears,
  addYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

interface DateNavigatorProps {
  mode: "Week" | "Month" | "Year";
  onDateChange: (date: Date, startDate: Date, endDate: Date) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  mode,
  onDateChange,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const minDate = subYears(new Date(), 5);

  useEffect(() => {
    // Calculate start and end dates based on mode
    let startDate: Date, endDate: Date;
    switch (mode) {
      case "Week":
        startDate = startOfWeek(currentDate);
        endDate = endOfWeek(currentDate);
        break;
      case "Month":
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
        break;
      case "Year":
        startDate = startOfYear(currentDate);
        endDate = endOfYear(currentDate);
        break;
    }
    onDateChange(currentDate, startDate, endDate);
  }, [currentDate, mode]);

  const formatPeriod = () => {
    switch (mode) {
      case "Week":
        const start = startOfWeek(currentDate);
        const end = endOfWeek(currentDate);
        return `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
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

    switch (mode) {
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
    }
  };

  const isAtCurrentPeriod = () => {
    const now = new Date();
    switch (mode) {
      case "Week":
        const currentWeekStart = startOfWeek(now);
        const selectedWeekStart = startOfWeek(currentDate);
        return selectedWeekStart >= currentWeekStart;
      case "Month":
        return (
          currentDate.getMonth() === now.getMonth() &&
          currentDate.getFullYear() === now.getFullYear()
        );
      case "Year":
        return currentDate.getFullYear() === now.getFullYear();
      default:
        return false;
    }
  };

  const canNavigatePrev = currentDate > minDate;
  const canNavigateNext = !isAtCurrentPeriod();

  return (
    <View className="flex-row justify-center py-2 px-3 mb-2 ">
      <View className=" px-3 py-2 rounded-3xl mb-2 w-72">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => canNavigatePrev && navigate("prev")}
            className="size-6 items-center justify-center"
            disabled={!canNavigatePrev}
          >
            <Text
              className={`text-lg ${
                canNavigatePrev ? "text-black" : "text-gray-300"
              }`}
            >
              ←
            </Text>
          </TouchableOpacity>

          <Text className="text-black text-base font-nunito-bold mx-1">
            {formatPeriod()}
          </Text>

          <TouchableOpacity
            onPress={() => canNavigateNext && navigate("next")}
            className="size-6 items-center justify-center"
            disabled={!canNavigateNext}
          >
            <Text
              className={`text-lg ${
                canNavigateNext ? "text-black" : "text-gray-300"
              }`}
            >
              →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
