import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  startOfWeek,
  endOfWeek,
  format,
  eachWeekOfInterval,
  eachDayOfInterval,
  subDays,
  addDays,
  subMonths,
  addMonths,
  isSameDay,
} from "date-fns";
import PagerView from "react-native-pager-view";
import icons from "@/constants/icons";

const WeekSlider = () => {
  const currentDate = new Date();
  const dates = eachWeekOfInterval({
    start: subMonths(currentDate, 1),
    end: addMonths(currentDate, 1),
  }).map((startOfWeek) =>
    eachDayOfInterval({ start: startOfWeek, end: endOfWeek(startOfWeek) })
  );

  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [currentWeek, setCurrentWeek] = useState(
    dates.findIndex((week) =>
      week.some((day) => isSameDay(day, selectedDate))
    ) || 0
  );

  useEffect(() => {
    if (currentWeek >= 0 && currentWeek < dates.length) {
      const date =
        dates[currentWeek].find((day) => isSameDay(day, selectedDate)) ||
        dates[currentWeek][0];
      setSelectedDate(date);
    }
  }, [currentWeek]);

  return (
    <>
      <View className="flex flex-row justify-between items-center my-5 mx-3 pt-5">
        <Text className="font-nunito-extra-bold text-xl">
          {format(selectedDate, "d MMMM E, yyyy")}
        </Text>

        <TouchableOpacity className="px-2">
          <Image source={icons.add} className="size-7" />
        </TouchableOpacity>
      </View>

      <PagerView
        style={styles.pagerView}
        initialPage={currentWeek}
        onPageSelected={(e) => setCurrentWeek(e.nativeEvent.position)}
      >
        {dates.map((week, i) => {
          return (
            <View key={i} className="p-3">
              <View className="flex-row justify-around">
                {week.map((day, j) => {
                  const DayName = format(day, "E");
                  const isSelected = isSameDay(day, selectedDate);
                  return (
                    <TouchableOpacity
                      key={day.toISOString()}
                      onPress={() => setSelectedDate(day)}
                    >
                      <View
                        className={`items-center px-4 py-2 rounded-lg ${
                          isSelected ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      >
                        <Text
                          className={`font-nunito-extra-bold text-sm ${
                            isSelected ? "text-white" : "text-black"
                          }`}
                        >
                          {DayName}
                        </Text>
                        <Text
                          className={`font-nunito-extra-bold text-xl 
                        ${isSelected ? "text-white" : "text-black"}`}
                        >
                          {day.getDate()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </PagerView>
    </>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default WeekSlider;
