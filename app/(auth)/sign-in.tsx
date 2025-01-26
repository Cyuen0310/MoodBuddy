import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const signIn = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={require("../../assets/images/sign-in.png")}
          className="w-full h-4/6 items-center justify-center"
          resizeMode="contain"
        />
        <View className="px-10">
          <Text className="text-center uppercase font-nunito-extra-bold-italic text-black-200 ">
            {" "}
            Welcome to MoodBuddy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;
