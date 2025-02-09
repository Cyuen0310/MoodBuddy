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
import React, { useState } from "react";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import icons from "@/constants/icons";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  textContentType,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  textContentType?: "none" | "password" | "newPassword";
  keyboardType?: "default" | "email-address" | "numeric";
}) => (
  <View className="mb-6">
    <Text className="font-nunito-medium text-gray-600 mb-2">{label}</Text>
    <View className="shadow-sm">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        textContentType={textContentType}
        keyboardType={keyboardType}
        className="bg-white p-4 rounded-xl font-nunito-regular border border-gray-100"
      />
    </View>
  </View>
);

const GenderSelector = ({
  selectedGender,
  onSelect,
}: {
  selectedGender: string;
  onSelect: (gender: string) => void;
}) => {
  const genders = ["Male", "Female", "Prefer not to say"];

  return (
    <View className="mb-6">
      <Text className="font-nunito-medium text-gray-600 mb-2">Gender</Text>
      <View className="flex-row flex-wrap gap-2">
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender}
            onPress={() => onSelect(gender)}
            className={`py-2 px-4 rounded-full shadow-sm ${
              selectedGender === gender
                ? "bg-[#008888]"
                : "bg-white border border-gray-100"
            }`}
          >
            <Text
              className={`font-nunito-medium ${
                selectedGender === gender ? "text-white" : "text-gray-600"
              }`}
            >
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const DateSelector = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

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

const UserInfo = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("User");
  const [email, setEmail] = useState("user@example.com");
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));
  const [gender, setGender] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    // Validate passwords match

    // Save user info logic here
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Image source={icons.backArrow} className="size-6" />
        </TouchableOpacity>
        <Text className="text-xl font-nunito-bold flex-1 text-center">
          Personal Information
        </Text>
        <TouchableOpacity onPress={handleSave} className="p-2">
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

        <GenderSelector selectedGender={gender} onSelect={setGender} />

        <View className="mt-4 mb-6">
          <Text className="font-nunito-bold text-lg mb-4">Change Password</Text>
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <InputField
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              secureTextEntry={false}
              textContentType="password"
            />
            <InputField
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry={false}
              textContentType="password"
            />

            <InputField
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry={false}
              textContentType="password"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserInfo;
