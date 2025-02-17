import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
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
import NewJournal from "@/components/(journal)/newJournal";
import JournalCard from "@/components/(journal)/journalCard";

const API_URL = process.env.API_URL;

const WeekSlider = () => {
  const currentDate = new Date();
  const userId = "test";
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
  const [journalList, setJournalList] = useState<
    Array<{
      _id: string;
      userId: string;
      date: string;
      entries: Array<{
        mood: string;
        factors: string[];
        text: string;
        images: string[];
        time: string;
      }>;
    }>
  >([]);

  const fetchJournals = async (date: Date) => {
    try {
      // Format date to start of day
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      const formattedDate = queryDate.toISOString();

      const url = `${API_URL}/journal?date=${formattedDate}&userId=${userId}`;
      console.log("Fetching journals:", {
        date: queryDate,
        formattedDate,
        url,
      });

      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const data = await response.json();
      console.log("Received journals:", {
        count: data.length,
        data,
      });
      setJournalList(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const saveJournalToList = async (info: {
    mood: string;
    factors: string[];
    text?: string;
    images?: string[];
  }) => {
    try {
      const date = new Date(selectedDate);
      date.setHours(0, 0, 0, 0);

      const body = {
        userId,
        date: date.toISOString(),
        entries: [
          {
            mood: info.mood,
            factors: info.factors,
            text: info.text || "",
            images: info.images || [],
            time: format(new Date(), "HH:mm"),
          },
        ],
      };

      console.log("Saving journal:", body);

      const response = await fetch(`${API_URL}/journal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

      const data = await response.json();
      console.log("Saved successfully:", data);

      await fetchJournals(selectedDate);
      setNewJournalModalOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching journals for date:", selectedDate);
    fetchJournals(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (currentWeek >= 0 && currentWeek < dates.length) {
      const date =
        dates[currentWeek].find((day) => isSameDay(day, selectedDate)) ||
        dates[currentWeek][0];
      setSelectedDate(date);
    }
  }, [currentWeek]);

  return (
    <View className="flex-1">
      {/* Header */}
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

      {/* Week Slider */}
      <View className="h-24">
        <PagerView
          style={styles.pagerView}
          initialPage={currentWeek}
          onPageSelected={(e) => setCurrentWeek(e.nativeEvent.position)}
        >
          {dates.map((week, i) => {
            return (
              <View key={i} className="p-1">
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
                              ? "bg-[#008888]"
                              : isToday
                              ? "bg-[#008888]/60"
                              : "bg-gray-200"
                          }`}
                        >
                          <Text
                            className={`font-nunito-extra-bold text-sm ${
                              isSelected || isToday
                                ? "text-white"
                                : "text-black"
                            }`}
                          >
                            {DayName}
                          </Text>
                          <Text
                            className={`font-nunito-extra-bold text-xl ${
                              isSelected || isToday
                                ? "text-white"
                                : "text-black"
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
      </View>

      {/* Journal Cards ScrollView */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View className="m-5">
          {journalList && journalList.length > 0 ? (
            journalList.map((journal) =>
              journal.entries.map((entry, index) => (
                <JournalCard key={`${journal._id}-${index}`} info={entry} />
              ))
            )
          ) : (
            <View className="flex-1 items-center justify-center py-10">
              <Text className="font-nunito-bold text-gray-500 text-lg">
                No journal to show yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

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
          <NewJournal selectedDate={selectedDate} onSave={saveJournalToList} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default WeekSlider;
