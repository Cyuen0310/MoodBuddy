import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";

const Meditation = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with back button */}
      <View className="flex-row items-center px-4 py-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Image source={icons.backArrow} className="size-6" />
        </TouchableOpacity>
        <Text className="text-xl font-nunito-bold flex-1 text-center mr-8">
          Meditation
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <Text className="text-base font-nunito-medium text-gray-600 mb-4">
          Welcome to your meditation journey. Find a comfortable place, relax, and let's begin.
        </Text>

        {/* Section 1 */}
        <Text className="text-lg font-nunito-bold mb-3">
          1. Breathing Exercise
        </Text>
        <Text className="text-base font-nunito-regular mb-4">
          Start by taking a deep breath in through your nose, hold it for a few seconds, and then slowly exhale through your mouth. Repeat this process for a few minutes to calm your mind.
        </Text>

        {/* Section 2 */}
        <Text className="text-lg font-nunito-bold mb-3">
          2. Body Scan
        </Text>
        <Text className="text-base font-nunito-regular mb-4">
          Close your eyes and bring your attention to your body. Start from the top of your head and slowly move down to your toes, noticing any tension or discomfort. Take a deep breath and release any tension you find.
        </Text>

        {/* Section 3 */}
        <Text className="text-lg font-nunito-bold mb-3">
          3. Guided Meditation
        </Text>
        <Text className="text-base font-nunito-regular mb-4">
          Listen to a guided meditation audio to help you focus and relax. You can find various guided meditations online or use a meditation app.
        </Text>

        {/* Section 4 */}
        <Text className="text-lg font-nunito-bold mb-3">
          4. Mindfulness Practice
        </Text>
        <Text className="text-base font-nunito-regular mb-4">
          Spend a few minutes being mindful of your surroundings. Notice the sounds, smells, and sensations around you without judgment. Just observe and be present in the moment.
        </Text>

        {/* Section 5 */}
        <Text className="text-lg font-nunito-bold mb-3">
          5. Reflection
        </Text>
        <Text className="text-base font-nunito-regular mb-4">
          After your meditation, take a moment to reflect on how you feel. Write down any thoughts or feelings that came up during your practice.
        </Text>

        {/* Contact Us Section */}
        <Text className="text-lg font-nunito-bold mb-3 mt-6">
          Contact Us
        </Text>
        <Text className="text-base font-nunito-regular mb-8">
          For any questions or feedback about this meditation guide, please contact us at MeditationSupport@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Meditation;