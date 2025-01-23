import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
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
} from "date-fns";
import PagerView from "react-native-pager-view";
import WeekSlider from "@/components/(journal)/weekSlider";
import NewJournal from "@/components/(journal)/newjournal";
const journal = () => {
  return (
    <SafeAreaView className="flex-1">
      <WeekSlider />
    </SafeAreaView>
  );
};

export default journal;
