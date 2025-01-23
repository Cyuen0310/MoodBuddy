import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import {
  endOfWeek,
  format,
  eachWeekOfInterval,
  eachDayOfInterval,
  subMonths,
  addMonths,
  isSameDay,
} from "date-fns";
import PagerView from "react-native-pager-view";
import icons from "@/constants/icons";
import NewJournal from "@/components/newjournal";

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
  const [isNewJournalModalOpen, setNewJournalModalOpen] = useState(false);

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

        <TouchableOpacity
          className="px-2"
          onPress={() => setNewJournalModalOpen(true)}
        >
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
                  const isToday = isSameDay(day, new Date());

                  return (
                    <TouchableOpacity
                      key={day.toISOString()}
                      onPress={() => setSelectedDate(day)}
                    >
                      <View
                        className={`items-center px-4 py-2 rounded-lg ${
                          isSelected
                            ? "bg-blue-500"
                            : isToday
                            ? "bg-blue-300"
                            : "bg-gray-200"
                        }`}
                      >
                        <Text
                          className={`font-nunito-extra-bold text-sm ${
                            isSelected || isToday ? "text-white" : "text-black"
                          }`}
                        >
                          {DayName}
                        </Text>
                        <Text
                          className={`font-nunito-extra-bold text-xl ${
                            isSelected || isToday ? "text-white" : "text-black"
                          }`}
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

      <Modal
        visible={isNewJournalModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={() => setNewJournalModalOpen(false)}>
              <Image source={icons.close} className="size-6" />
            </TouchableOpacity>

            <View className="flex-col items-center rounded-lg  px-2 py-1">
              <Text className="font-nunito-bold text-xl">
                {format(selectedDate, "d MMMM")}
              </Text>
              <Text className="font-nunito-bold text-sm ">
                {format(new Date(), "HH:mm")}
              </Text>
            </View>

            <View className="w-5" />
          </View>
          <NewJournal />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default WeekSlider;
