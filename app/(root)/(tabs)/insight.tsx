import { View, Text, SafeAreaView, Dimensions } from "react-native";
import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LineChart, BarChart, ContributionGraph } from "react-native-chart-kit";
import HexStat from "@/components/(insight)/hexStat";
import { DateNavigator } from "@/components/(insight)/DateNavigator";

const Tab = createMaterialTopTabNavigator();
const screenWidth = Dimensions.get("window").width;

const Weekly = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <DateNavigator mode="Week" onDateChange={setSelectedDate} />
      <View className="flex-1 items-center justify-center">
        <HexStat />
      </View>
    </View>
  );
};

const Monthly = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        data: [20, 45, 28, 35],
      },
    ],
  };

  return (
    <View className="flex-1 bg-white p-4">
      <DateNavigator mode="Month" onDateChange={setSelectedDate} />
      <Text className="font-nunito-bold text-lg mb-4 text-gray-800">
        Monthly Activity Summary
      </Text>
    </View>
  );
};

const Yearly = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const commitsData = [
    { date: "2024-01-02", count: 4 },
    { date: "2024-01-03", count: 2 },
    { date: "2024-01-04", count: 5 },
    { date: "2024-01-05", count: 3 },
    // Add more dates as needed
  ];

  return (
    <View className="flex-1 bg-white p-4">
      <DateNavigator mode="Year" onDateChange={setSelectedDate} />
      <Text className="font-nunito-bold text-lg mb-4 text-gray-800">
        Yearly Mood Patterns
      </Text>
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
              height: "93%",
              borderRadius: 20,
              marginVertical: 3,
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
