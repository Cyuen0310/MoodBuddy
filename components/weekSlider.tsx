import React from "react";
import { View, Text } from "react-native";
import { startOfWeek, format } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";

const weekSlider = () => {
  const date = startOfWeek(new Date()); // Get the start of the current week

  return (
    <SafeAreaView>
      <View>
        <Text>Start of the week: {format(date, "yyyy-MM-dd")}</Text>
      </View>
    </SafeAreaView>
  );
};

export default weekSlider;
