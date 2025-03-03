import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from "@/constants/icons";
import { fetchUserData, auth } from '../(auth)/auth'; 
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from "react-native";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  textContentType?: "none" | "password" | "newPassword";
  keyboardType?: "default" | "email-address" | "numeric";
  error?: string;
  showPassword?: boolean;
  onTogglePasswordVisibility?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  textContentType,
  keyboardType,
  error,
  showPassword,
  onTogglePasswordVisibility,
}) => (
  <View className="mb-6">
    <Text className="font-nunito-medium text-gray-600 mb-2">{label}</Text>
    <View className="shadow-sm flex-row items-center bg-white p-4 rounded-xl border border-gray-100">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={!showPassword && secureTextEntry}
        textContentType={textContentType}
        keyboardType={keyboardType}
        className="flex-1 font-nunito-regular"
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={onTogglePasswordVisibility}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#6b7280"
          />
        </TouchableOpacity>
      )}
    </View>
    {error && <Text className="text-red-500 mt-2">{error}</Text>}
  </View>
);

interface DateSelectorProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);

  const handleChange = useCallback((event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      onChange(selectedDate);
    }
  }, [onChange]);

  return (
    <View className="mb-6">
      <Text className="font-nunito-medium text-gray-600 mb-2">{label}</Text>
      <View className="shadow-sm">
        <TouchableOpacity
          onPress={() => setShow(true)}
          className="bg-white p-4 rounded-xl border border-gray-100"
        >
          <Text className="font-nunito-regular text-gray-800">
            {value.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

interface UserInfoProps {
  onUserUpdate: (updatedUser: any) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ onUserUpdate }) => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState("");
  const [mbti, setMbti] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserDataFromFirestore = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        const dbUserData = await fetchUserData(userData.uid);
        setFullName(dbUserData.fullname || "");
        setUsername(dbUserData.username || "");
        setEmail(dbUserData.email || "");
        setMbti(dbUserData.mbti || "");

        const dobString = dbUserData.dob;
        const dobParts = dobString.split("/");
        const dob = new Date(dobParts[2], dobParts[0] - 1, dobParts[1]);
        setDateOfBirth(isNaN(dob.getTime()) ? new Date() : dob);

        const fetchedGender = dbUserData.gender || "";
        setGender(fetchedGender === "other" ? "other" : fetchedGender);
      }
    };

    fetchUserDataFromFirestore();
  }, []);

  const handleSave = useCallback(async (): Promise<boolean> => {
    const updatedUser = {
      fullname: fullName,
      username,
      email,
      dob: dateOfBirth.toLocaleDateString(),
      gender,
      mbti,
    };

    const user = await AsyncStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      try {
        await setDoc(doc(getFirestore(), 'users', userData.uid), updatedUser);

        await AsyncStorage.setItem('user', JSON.stringify({ 
          uid: userData.uid, 
          username: updatedUser.username, 
          email: updatedUser.email,
          fullname: updatedUser.fullname, 
          mbti: updatedUser.mbti,
        }));

        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }

        router.back();
        return true;
      } catch (error) {
        console.error("Error updating user data:", error);
        setCurrentPasswordError("Failed to update user data.");
        return false;
      }
    }
    return false;
  }, [fullName, username, email, dateOfBirth, gender, mbti, onUserUpdate, router]);

  const handleChangePassword = useCallback(async (): Promise<boolean> => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setCurrentPasswordError("User not authenticated.");
      return false;
    }

    const email = currentUser.email;
    if (!email) {
      setCurrentPasswordError("User email is not available.");
      return false;
    }

    if (!currentPassword) {
      setCurrentPasswordError("Current password is required.");
      return false;
    } else {
      setCurrentPasswordError("");
    }

    if (!newPassword || !confirmPassword) {
      setNewPasswordError("Please fill in both new password fields.");
      return false;
    } else {
      setNewPasswordError("");
    }

    if (newPassword.length < 6) {
      setNewPasswordError("New password must be at least 6 characters.");
      return false;
    } else {
      setNewPasswordError("");
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("New passwords do not match.");
      return false;
    } else {
      setConfirmPasswordError("");
    }

    try {
      const credential = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-credential") {
          setCurrentPasswordError("Current password is wrong. Please enter again.");
        } else {
          setCurrentPasswordError("Failed to update password. Please try again.");
        }
      } else {
        setCurrentPasswordError("An unexpected error occurred.");
      }
      return false;
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const handleSubmit = useCallback(async () => {
    if (currentPassword || newPassword || confirmPassword) {
      const passwordChanged = await handleChangePassword();
      if (!passwordChanged) {
        return;
      }
    }

    await handleSave();
  }, [currentPassword, newPassword, confirmPassword, handleChangePassword, handleSave]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Image source={icons.backArrow} className="size-6" />
          </TouchableOpacity>
          <Text className="text-xl font-nunito-bold flex-1 text-center">
            Personal Information
          </Text>
          <TouchableOpacity onPress={handleSubmit} className="p-2">
            <Text className="text-blue-500 font-nunito-bold">Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6">
          <View className="items-center my-8">
            <View className="relative">
              <Image source={icons.avatar} className="size-24 rounded-full" />
              <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full">
                <Image
                  source={icons.camera}
                  className="size-5"
                  tintColor="white"
                />
              </TouchableOpacity>
            </View>
          </View>

          <InputField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
          />

          <InputField
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
          />

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            textContentType="none"
          />

          <DateSelector
            label="Date of Birth"
            value={dateOfBirth}
            onChange={setDateOfBirth}
          />

          <View>
            <Text className="font-nunito-medium text-gray-600 mb-2">Gender*</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              {["male", "female", "other"].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setGender(option);
                  }}
                  style={{ alignItems: "center" }}
                >
                  {option === "other" ? (
                    <Image
                      source={require("@/assets/images/genderless.png")}
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: gender === "other" ? "blue" : "gray",
                      }}
                    />
                  ) : (
                    <Ionicons
                      name={option === "male" ? "male" : "female"}
                      size={30}
                      color={gender === option ? "blue" : "gray"}
                    />
                  )}
                  <Text>
                    {option === "other" ? "Other" : option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mt-4 mb-6">
            <Text className="font-nunito-bold text-lg mb-4">Change Password (Optional)</Text>
            <InputField
              label="Current Password"
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                setCurrentPasswordError("");
              }}
              placeholder="Enter current password"
              secureTextEntry={true}
              error={currentPasswordError}
              showPassword={showCurrentPassword}
              onTogglePasswordVisibility={() => setShowCurrentPassword(!showCurrentPassword)}
            />
            <InputField
              label="New Password"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setNewPasswordError("");
              }}
              placeholder="Enter new password"
              secureTextEntry={true}
              error={newPasswordError}
              showPassword={showNewPassword}
              onTogglePasswordVisibility={() => setShowNewPassword(!showNewPassword)}
            />
            <InputField
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError("");
              }}
              placeholder="Confirm new password"
              secureTextEntry={true}
              error={confirmPasswordError}
              showPassword={showConfirmPassword}
              onTogglePasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserInfo;
