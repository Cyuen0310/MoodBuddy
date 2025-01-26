import React from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";

interface CalendarProps {
  selectedDate: Date;
  entries: {
    [key: string]: {
      mood: string;
      factors: string[];
      text: string;
      images: string[];
    }[];
  };
}

const Calendar = ({ selectedDate, entries }: CalendarProps) => {
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <View className="bg-gray-50 rounded-2xl p-4 mx-4 mt-4">
      {/* Week days header */}
      <View className="flex-row justify-between mb-4">
        {weekDays.map((day) => (
          <Text
            key={day}
            className="text-gray-500 font-nunito-medium w-10 text-center"
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View className="flex-row flex-wrap">
        {daysInMonth.map((day) => {
          const dateString = format(new Date(2024, 0, day), "yyyy-MM-dd");
          const hasEntry = entries[dateString]?.length > 0;
          const isSelected = day === selectedDate.getDate();

          return (
            <View key={day} className="w-10 aspect-square mb-2">
              <View
                className={`
                  w-9 h-9 rounded-full justify-center items-center
                  ${isSelected ? "border-2 border-blue-500" : ""}
                  ${hasEntry ? "bg-blue-100" : ""}
                `}
              >
                <Text
                  className={`
                  font-nunito-bold text-lg
                  ${isSelected ? "text-blue-500" : "text-gray-800"}
                `}
                >
                  {day}
                </Text>
                {hasEntry && (
                  <View className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Calendar;
