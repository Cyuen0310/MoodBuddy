import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const Weekly = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <Text>Weekly Report</Text>
    </View>
  );
};

const Monthly = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <Text>Monthly Report</Text>
    </View>
  );
};

const Yearly = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <Text>Yearly Report</Text>
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
              height: "90%",
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
