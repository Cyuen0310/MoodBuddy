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

const Policies = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Image source={icons.backArrow} className="size-6" />
        </TouchableOpacity>
        <Text className="text-xl font-nunito-bold flex-1 text-center mr-8">
          Privacy Policy
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <Text className="text-base font-nunito-medium text-gray-600 mb-4">
          Effective Date: 31 January, 2025
        </Text>

        <Text className="text-base font-nunito-regular mb-6">
          Welcome to MoodBuddy! Your privacy is important to us. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your
          information when you use our mobile application and related services.
        </Text>

        <Text className="text-lg font-nunito-bold mb-3">
          1. Information We Collect
        </Text>
        <Text className="text-base font-nunito-regular mb-2">
          We collect different types of information to provide and improve
          MoodBuddy, including:
        </Text>

        <Text className="text-base font-nunito-semibold mb-2">
          1.1 Personal Information
        </Text>
        <Text className="text-base font-nunito-regular mb-4 pl-4">
          • Name, email address, and third-party login credentials (Google,
          Apple ID) for authentication.{"\n"}• Personality test responses for
          personalizing AI interactions.
        </Text>

        <Text className="text-base font-nunito-semibold mb-2">
          1.2 Automatically Collected Information
        </Text>
        <Text className="text-base font-nunito-regular mb-4 pl-4">
          • Device information (e.g., model, operating system, unique
          identifiers).{"\n"}• Usage data (e.g., app interactions, mood tracking
          inputs, chat history with AI).
        </Text>

        <Text className="text-base font-nunito-semibold mb-2">
          1.3 Optional Information
        </Text>
        <Text className="text-base font-nunito-regular mb-4 pl-4">
          • Mood journal entries and preferences you choose to share with the
          app.{"\n"}• Interaction history with AI chat support.
        </Text>

        <Text className="text-lg font-nunito-bold mb-3 mt-6">
          2. How We Use Your Information
        </Text>
        <Text className="text-base font-nunito-regular mb-4 pl-4">
          • Provide and personalize AI-driven mental health support.{"\n"}•
          Track mood trends and suggest relevant exercises.{"\n"}• Improve app
          performance and user experience.{"\n"}• Ensure security and prevent
          fraud.{"\n"}• Comply with legal obligations.
        </Text>

        <Text className="text-lg font-nunito-bold mb-3 mt-6">
          3. How We Share Your Information
        </Text>
        <Text className="text-base font-nunito-regular mb-2">
          We do not sell or rent your personal data. We may share information in
          the following cases:
        </Text>
        <Text className="text-base font-nunito-regular mb-4 pl-4">
          • With Service Providers: For cloud hosting, analytics, and AI model
          training (e.g., AWS, MongoDB).{"\n"}• For Legal Compliance: If
          required by law or to protect rights and safety.{"\n"}• With Your
          Consent: If you choose to share mood insights with others.
        </Text>


        <Text className="text-lg font-nunito-bold mb-3 mt-6">
          4. Data Security
        </Text>
        <Text className="text-base font-nunito-regular mb-4">
          We implement reasonable security measures to protect your data.
          However, no method of transmission over the Internet is 100% secure.
          Please use MoodBuddy responsibly.
        </Text>


        <Text className="text-lg font-nunito-bold mb-3 mt-6">
          5. Your Rights and Choices
        </Text>
        <Text className="text-base font-nunito-regular mb-4 pl-4">
          • Access & Correction: You can update or delete your data within the
          app settings.{"\n"}• Opt-Out: You can disable certain data collection
          features.{"\n"}• Account Deletion: You may request complete deletion
          of your account and associated data by contacting support.
        </Text>

        <Text className="text-lg font-nunito-bold mb-3 mt-6">
          6. Third-Party Links and Integrations
        </Text>
        <Text className="text-base font-nunito-regular mb-4">
          MoodBuddy may include links to third-party websites or services (e.g.,
          authentication providers). We are not responsible for their privacy
          practices.
        </Text>

        <Text className="text-lg font-nunito-bold mb-3 mt-6">
          7. Children's Privacy
        </Text>
        <Text className="text-base font-nunito-regular mb-4">
          MoodBuddy is not intended for users under the age of 13. We do not
          knowingly collect data from children without parental consent.
        </Text>


        <Text className="text-lg font-nunito-bold mb-3 mt-6">
          8. Changes to This Policy
        </Text>
        <Text className="text-base font-nunito-regular mb-4">
          We may update this Privacy Policy from time to time. Any changes will
          be posted within the app, and continued use constitutes acceptance of
          the updated terms.
        </Text>

        <Text className="text-lg font-nunito-bold mb-3 mt-6">
          9. Contact Us
        </Text>
        <Text className="text-base font-nunito-regular mb-8">
          For any questions about this Privacy Policy, please contact us at
          MoodBuddy@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Policies;
