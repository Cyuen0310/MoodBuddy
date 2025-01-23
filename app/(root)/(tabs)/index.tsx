import { Link } from "expo-router";
import React from "react";
import { Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import icons from "@/constants/icons";

export default function Index() {
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-5">
        <View className="flex flex-row item-center justify-between mt-5">
          <View className="flex flex-row ">
            <Image source={icons.avatar} className="size-12 rounded-full" />

            <View className="flex flex-col item-start ml-2 justify-center ">
              <Text className="text-md font-nunito text-black-100">
                Welcome to MoodBuddy!
              </Text>
              <Text className="text-lg font-nunito-bold text-black">User</Text>
            </View>
          </View>

          <Image source={icons.bell} className="size-6" tintColor={"#666876"} />
        </View>
      </View>
    </SafeAreaView>
  );
}
