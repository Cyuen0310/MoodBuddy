import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import icons from "@/constants/icons";
import { router } from "expo-router";

const voiceChat = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity className="flex-1 m-3" onPress={() => router.back()}>
        <Image source={icons.close} className="size-10" />
      </TouchableOpacity>

      {/* display soundwave while speaking */}

      <TouchableOpacity
        className="flex-1 m-3 items-center justify-center"
        onPress={() => {}}
      >
        <Image
          source={icons.microphone}
          className="size-20 bg-gray-300 rounded-full p-4"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default voiceChat;
