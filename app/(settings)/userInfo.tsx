import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from "@/constants/icons";
import { fetchUserData, auth } from '../(auth)/auth'; 
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from "react-native";

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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        setGender(fetchedGender === "other" ? "Prefer not to say" : fetchedGender);
      }
    };

    fetchUserDataFromFirestore();
  }, []);

  const handleSave = async () => {
    const updatedUser = {
      fullname: fullName,
      username,
      email,
      dob: dateOfBirth.toLocaleDateString(),
      gender: gender === "Prefer not to say" ? "other" : gender,
      mbti,
    };

    const user = await AsyncStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      try {
        await setDoc(doc(getFirestore(), 'users', userData.uid), updatedUser);
        Alert.alert("Success", "User information updated successfully.");

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
      } catch (error) {
        console.error("Error updating user data:", error);
        Alert.alert("Error", "Failed to update user data.");
      }
    }
  };

  const handleChangePassword = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    const email = currentUser.email;
    if (!email) {
      Alert.alert("Error", "User email is not available.");
      return;
    }
  
    const currentPassword = await promptCurrentPassword();
    if (!currentPassword) {
      Alert.alert("Error", "Current password is required.");
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, currentPassword);
  
      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "New passwords do not match.");
        return;
      }
  
      await updatePassword(currentUser, newPassword);
      Alert.alert("Success", "Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "Failed to update password."); 
    }
  };

  const promptCurrentPassword = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      Alert.prompt(
        "Current Password",
        "Please enter your current password:",
        [
          {
            text: "Cancel",
            onPress: () => resolve(null),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: (text) => resolve(text || ""),
          },
        ],
      );
    });
  };

  const handleSubmit = async () => {
    await handleSave();

    if (newPassword || confirmPassword) {
      await handleChangePassword();
    }
  };

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
            {["male", "female", "Prefer not to say"].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setGender(option === "Prefer not to say" ? "Prefer not to say" : option);
                }}
                style={{ alignItems: "center" }}
              >
                {option === "Prefer not to say" ? (
                  <Image
                    source={require("@/assets/images/genderless.png")}
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: gender === "Prefer not to say" ? "blue" : "gray",
                    }}
                  />
                ) : (
                  <Ionicons
                    name={option === "male" ? "male" : "female"}
                    size={30}
                    color={gender === option ? "blue" : "gray"}
                  />
                )}
                <Text>{option === "Prefer not to say" ? "Prefer not to say" : option.charAt(0).toUpperCase() + option.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-4 mb-6">
          <Text className="font-nunito-bold text-lg mb-4">Change Password (Optional)</Text>
          <InputField
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry={true}
          />
          <InputField
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry={true}
          />
          {(newPassword || confirmPassword) && (
            <Text className="text-red-500 mb-2">Please ensure passwords match.</Text>
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserInfo;
