import { View, Text, SafeAreaView, Dimensions } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LineChart, BarChart, ContributionGraph } from "react-native-chart-kit";

const Tab = createMaterialTopTabNavigator();
const screenWidth = Dimensions.get("window").width;

const Weekly = () => {
  const hasData = false; // Toggle this based on your data availability

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: hasData ? [3, 4, 2, 5, 3, 4, 5] : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="font-nunito-bold text-lg mb-4">
        Mood Trends This Week
      </Text>
      {hasData ? (
        <LineChart
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#3B82F6",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="font-nunito-medium text-gray-500 text-lg">
            No data available for this week
          </Text>
        </View>
      )}
    </View>
  );
};

const Monthly = () => {
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
      <Text className="font-nunito-bold text-lg mb-4">
        Monthly Activity Summary
      </Text>
    </View>
  );
};

const Yearly = () => {
  const commitsData = [
    { date: "2024-01-02", count: 4 },
    { date: "2024-01-03", count: 2 },
    { date: "2024-01-04", count: 5 },
    { date: "2024-01-05", count: 3 },
    // Add more dates as needed
  ];

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="font-nunito-bold text-lg mb-4">
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
              backgroundColor: "#3B82F6",
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
