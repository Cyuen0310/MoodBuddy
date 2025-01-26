import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import icons from "@/constants/icons";

const Icon = ({
  iscurrent,
  icon,
  title,
}: {
  iscurrent: boolean;
  icon: any;
  title: string;
}) => {
  return (
    <View className="flex-1 mt-3 flex flex-col ustify-center items-center">
      <Image
        source={icon}
        tintColor={iscurrent ? "#0015FF" : "#000000"}
        resizeMode="contain"
        className="size-7"
      />
      <Text
        className={`${
          iscurrent
            ? "text-blue-600 font-nunito-medium"
            : "text-black-200 font-nunito"
        } text-xs w-full text-center mt-1`}
      >
        {title}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          minHeight: 70,
          borderTopWidth: 1,
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon iscurrent={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "journal",
          tabBarIcon: ({ focused }) => (
            <Icon iscurrent={focused} icon={icons.journal} title="Journal" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "chat",
          tabBarIcon: ({ focused }) => (
            <Icon iscurrent={focused} icon={icons.chat} title="Chat" />
          ),
        }}
      />

      <Tabs.Screen
        name="insight"
        options={{
          title: "insight",
          tabBarIcon: ({ focused }) => (
            <Icon iscurrent={focused} icon={icons.insight} title="Insight" />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "settings",
          tabBarIcon: ({ focused }) => (
            <Icon iscurrent={focused} icon={icons.settings} title="Settings" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
