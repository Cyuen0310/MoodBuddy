import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth } from "./auth";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      const emailExists = await checkEmailInDatabase(email.toLowerCase());
      if (!emailExists) {
        setErrorMessage("No account found with this email address.");
        return;
      }
      await sendPasswordResetEmail(auth, email.toLowerCase());
      Alert.alert("Success", "Password reset email sent successfully!");
      router.push("/Login");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/invalid-email") {
        setErrorMessage("The email address is not valid.");
      } else {
        setErrorMessage(
          "Failed to send password reset email. Please try again."
        );
      }
    }
  };

  const checkEmailInDatabase = async (email: string) => {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm items-center">
          <Text className="font-nunito-bold text-3xl text-gray-800 mb-2">
            MoodBuddy
          </Text>
          <Text className="font-nunito text-xl text-gray-600 mb-8">
            Forgot Password
          </Text>

          <View className="w-full space-y-4">
            <TextInput
              className="w-full h-14 border border-gray-300 rounded-xl px-4 font-nunito text-base bg-gray-50"
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />

            {errorMessage ? (
              <Text className="font-nunito text-red-500 text-center">
                {errorMessage}
              </Text>
            ) : null}

            <TouchableOpacity
              className="w-full bg-green-900 py-4 rounded-xl items-center mt-4"
              onPress={handleResetPassword}
            >
              <Text className="font-nunito-medium text-white text-bg">
                Send Reset Email
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-6">
              <Text className="font-nunito text-lg text-gray-600">
                Remember the password?
              </Text>
              <TouchableOpacity onPress={() => router.replace("/Login")}>
                <Text className="font-nunito-bold text-blue-700 text-lg ml-1">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordPage;
