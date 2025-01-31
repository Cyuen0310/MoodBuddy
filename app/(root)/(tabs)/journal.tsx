import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import WeekSlider from "@/components/(journal)/weekSlider";

const journal = () => {
  return (
    <SafeAreaView className="flex-1">
      <WeekSlider />
    </SafeAreaView>
  );
};

export default journal;
