import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import icons from "@/constants/icons";
import { fetchUserData, auth } from "../(auth)/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Ionicons } from "@expo/vector-icons";
import PhotoUpload from "@/components/photoUpload";

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
  icon?: any;
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
  icon,
}) => (
  <View className="mb-10">
    <Text className="text-gray-700 font-nunito-extra-bold mb-1 ml-1 text-lg">
      {label}
    </Text>
    <View className="flex-row items-center bg-gray-50 rounded-2xl h-16 shadow-sm border border-gray-100">
      <View className="items-center justify-center w-14">
        <Image source={icon} className="w-6 h-6 opacity-60" />
      </View>
      <TextInput
        className="flex-1 text-lg h-full font-nunito-extra-bold"
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword && secureTextEntry}
        textContentType={textContentType}
        keyboardType={keyboardType}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={onTogglePasswordVisibility} className="pr-5">
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
    {error && <Text className="text-red-500 mt-2 ml-1 text-base">{error}</Text>}
  </View>
);

interface DateSelectorProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  label,
  value,
  onChange,
}) => {
  const [show, setShow] = useState(false);

  const handleChange = useCallback(
    (event: any, selectedDate?: Date) => {
      setShow(Platform.OS === "ios");
      if (selectedDate) {
        onChange(selectedDate);
      }
    },
    [onChange]
  );

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
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

        if (dbUserData.avatar) {
          setAvatar(dbUserData.avatar);
        }

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
      avatar: avatar || "",
    };

    const user = await AsyncStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      try {
        await setDoc(doc(getFirestore(), "users", userData.uid), updatedUser);

        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            uid: userData.uid,
            username: updatedUser.username,
            email: updatedUser.email,
            fullname: updatedUser.fullname,
            mbti: updatedUser.mbti,
            avatar: updatedUser.avatar,
          })
        );

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
  }, [
    fullName,
    username,
    email,
    dateOfBirth,
    gender,
    mbti,
    avatar,
    onUserUpdate,
    router,
  ]);

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
          setCurrentPasswordError(
            "Current password is wrong. Please enter again."
          );
        } else {
          setCurrentPasswordError(
            "Failed to update password. Please try again."
          );
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
  }, [
    currentPassword,
    newPassword,
    confirmPassword,
    handleChangePassword,
    handleSave,
  ]);

  const handleSelectAvatar = (imageUri: string) => {
    setAvatar(imageUri);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1 px-8"
            contentContainerStyle={{ paddingBottom: 60 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="items-center my-10">
              <Text className="text-4xl font-nunito-extra-bold text-gray-800">
                Mood Buddy
              </Text>
              <Text className="text-xl font-nunito-extra-bold text-gray-500 mt-4">
                Edit Profile
              </Text>
            </View>

            <View className="items-center mb-10">
              <View className="relative">
                <Image
                  source={avatar ? { uri: avatar } : icons.avatar}
                  className="w-32 h-32 rounded-full"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full"
                  onPress={() => setShowPhotoModal(true)}
                >
                  <Image
                    source={icons.camera}
                    className="w-6 h-6"
                    tintColor="white"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="space-y-12">
              <InputField
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                icon={require("@/assets/images/user.png")}
              />

              <InputField
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                icon={require("@/assets/images/user.png")}
              />

              <InputField
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="example@email.com"
                keyboardType="email-address"
                icon={require("@/assets/images/email.png")}
              />

              <View className="mb-10">
                <Text className="text-gray-700 font-nunito-extra-bold mb-1 ml-1 text-lg">
                  Date of Birth
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowDatePicker(true);
                  }}
                  className="flex-row items-center bg-gray-50 rounded-2xl h-16 shadow-sm border border-gray-100"
                >
                  <View className="items-center justify-center w-14">
                    <Image
                      source={require("@/assets/images/cake.png")}
                      className="w-6 h-6 opacity-60"
                    />
                  </View>
                  <Text className="flex-1 text-lg text-gray-700 font-nunito-extra-bold">
                    {dateOfBirth.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setDateOfBirth(selectedDate);
                      }
                    }}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              <View className="mb-10">
                <Text className="text-gray-700 font-nunito-extra-bold mb-1 ml-1 text-lg">
                  Gender
                </Text>
                <View className="flex-row justify-between bg-gray-50 rounded-2xl p-5 shadow-sm border border-gray-100">
                  <TouchableOpacity
                    onPress={() => setGender("male")}
                    className={`items-center justify-center py-4 rounded-xl flex-1 mx-1 ${
                      gender === "male"
                        ? "bg-blue-100 border border-blue-200"
                        : ""
                    }`}
                  >
                    <Ionicons
                      name="male"
                      size={32}
                      color={gender === "male" ? "#3b82f6" : "#9ca3af"}
                    />
                    <Text
                      className={`mt-2 font-medium text-base ${
                        gender === "male" ? "text-blue-500" : "text-gray-500"
                      }`}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setGender("female")}
                    className={`items-center justify-center py-4 rounded-xl flex-1 mx-1 ${
                      gender === "female"
                        ? "bg-pink-100 border border-pink-200"
                        : ""
                    }`}
                  >
                    <Ionicons
                      name="female"
                      size={32}
                      color={gender === "female" ? "#ec4899" : "#9ca3af"}
                    />
                    <Text
                      className={`mt-2 font-medium text-base ${
                        gender === "female" ? "text-pink-500" : "text-gray-500"
                      }`}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setGender("other")}
                    className={`items-center justify-center py-4 rounded-xl flex-1 mx-1 ${
                      gender === "other"
                        ? "bg-purple-100 border border-purple-200"
                        : ""
                    }`}
                  >
                    <Image
                      source={require("@/assets/images/genderless.png")}
                      className="w-8 h-8"
                      style={{
                        tintColor: gender === "other" ? "#8b5cf6" : "#9ca3af",
                      }}
                    />
                    <Text
                      className={`mt-2 font-medium text-base ${
                        gender === "other" ? "text-purple-500" : "text-gray-500"
                      }`}
                    >
                      Other
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mb-10">
                <Text className="text-gray-700 font-nunito-extra-bold mb-5 ml-1 text-lg">
                  Change Password
                </Text>
                <InputField
                  label="Current Password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  secureTextEntry={true}
                  error={currentPasswordError}
                  showPassword={showCurrentPassword}
                  onTogglePasswordVisibility={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  icon={require("@/assets/images/padlock.png")}
                />
                <InputField
                  label="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry={true}
                  error={newPasswordError}
                  showPassword={showNewPassword}
                  onTogglePasswordVisibility={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                  icon={require("@/assets/images/padlock.png")}
                />
                <InputField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry={true}
                  error={confirmPasswordError}
                  showPassword={showConfirmPassword}
                  onTogglePasswordVisibility={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  icon={require("@/assets/images/padlock.png")}
                />
              </View>

              <TouchableOpacity
                className="bg-green-900 py-5 rounded-xl mt-8 shadow-md"
                onPress={handleSubmit}
              >
                <Text className="text-white text-center text-xl font-nunito-extra-bold">
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        <PhotoUpload
          visible={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          onSelectImage={handleSelectAvatar}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserInfo;
