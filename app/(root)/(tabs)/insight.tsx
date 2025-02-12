import { View, Text, SafeAreaView, Dimensions, ScrollView } from "react-native";
import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LineChart, BarChart, ContributionGraph } from "react-native-chart-kit";
import { format } from "date-fns";

import { DateNavigator } from "@/components/(insight)/DateNavigator";
import MoodInsights from "@/components/(insight)/moodInsights";
const Tab = createMaterialTopTabNavigator();
const screenWidth = Dimensions.get("window").width;

const Weekly = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  const handleDateChange = (date: Date, start: Date, end: Date) => {
    setSelectedDate(date);
    setDateRange({ start, end });
    console.log(
      "Week range:",
      format(start, "yyyy-MM-dd"),
      "to",
      format(end, "yyyy-MM-dd")
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-4">
          <DateNavigator mode="Week" onDateChange={handleDateChange} />
        </View>
        <View className="px-4 items-center">
          <MoodInsights
            timeframe="week"
            selectedDate={selectedDate}
            dateRange={dateRange}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const Monthly = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  const handleDateChange = (date: Date, start: Date, end: Date) => {
    setSelectedDate(date);
    setDateRange({ start, end });
    console.log(
      "Month range:",
      format(start, "yyyy-MM-dd"),
      "to",
      format(end, "yyyy-MM-dd")
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-4">
          <DateNavigator mode="Month" onDateChange={handleDateChange} />
        </View>
        <View className="px-4 items-center">
          <MoodInsights
            timeframe="month"
            selectedDate={selectedDate}
            dateRange={dateRange}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const Yearly = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  const handleDateChange = (date: Date, start: Date, end: Date) => {
    setSelectedDate(date);
    setDateRange({ start, end });
    console.log(
      "Year range:",
      format(start, "yyyy-MM-dd"),
      "to",
      format(end, "yyyy-MM-dd")
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-4">
          <DateNavigator mode="Year" onDateChange={handleDateChange} />
        </View>
        <View className="px-4 items-center">
          <MoodInsights
            timeframe="year"
            selectedDate={selectedDate}
            dateRange={dateRange}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const insight = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="text-2xl font-nunito-bold text-center mt-5 mb-4">
        Insights
      </Text>

      <View className="flex-1 px-4">
        <Tab.Navigator
          style={{ flex: 1 }}
          screenOptions={{
            tabBarStyle: {
              backgroundColor: "#F3F4F6",
              borderRadius: 25,
              marginHorizontal: 4,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarItemStyle: {
              padding: 2,
              borderRadius: 25,
            },
            tabBarIndicatorStyle: {
              backgroundColor: "#008888",
              height: "100%",
              borderRadius: 25,
              width: "33%",
            },
            tabBarIndicatorContainerStyle: {
              justifyContent: "center",
              marginHorizontal: 3,
            },
            tabBarLabelStyle: {
              textTransform: "none",
              fontFamily: "Nunito-ExtraBold",
              fontSize: 15,
              margin: 10,
            },
            tabBarActiveTintColor: "#FFFFFF",
            tabBarInactiveTintColor: "#9CA3AF",
          }}
        >
          <Tab.Screen name="Weekly" component={Weekly} />
          <Tab.Screen name="Monthly" component={Monthly} />
          <Tab.Screen name="Yearly" component={Yearly} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default insight;
