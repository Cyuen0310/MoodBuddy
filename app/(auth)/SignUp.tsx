import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { FirebaseError } from "firebase/app";
import { signup } from "./auth";

interface FormValues {
  username: string;
  fullname: string;
  email: string;
  dob: string;
  gender: string;
  password: string;
  confirmpassword: string;
}

const SignUpScreen = () => {
  const router = useRouter();
  const [hidePassword, setPassword] = useState(true);
  const [hideCPassword, setCPassword] = useState(true);
  const [gender, setGender] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dob, setDob] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values: FormValues) => {
    setErrorMessage("");
    try {
      const userCredential = await signup(values);
      console.log("Registering user:", values);
      console.log("User added!", userCredential);
      router.push("/Question");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/email-already-in-use") {
        setErrorMessage("This email is already registered.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setErrorMessage("The email address is not valid.");
      } else {
        setErrorMessage(
          "An error occurred while registering. Please try again."
        );
      }
    }
  };

  const onChangeDob = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set") {
      const currentDate = selectedDate || dob;
      setDob(currentDate);
      setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
    }
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    birth: Yup.date().nullable(),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password") || null], "Passwords must match")
      .required("Confirm Password is required"),
    gender: Yup.string().required("Gender is required"),
    fullname: Yup.string().nullable(),
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
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
                Create Account
              </Text>
            </View>

            <Formik
              initialValues={{
                username: "",
                fullname: "",
                email: "",
                dob: dob.toLocaleDateString(),
                password: "",
                gender: "",
                confirmpassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                errors,
                values,
                touched,
              }) => (
                <View className="space-y-12">
                  <View className="mb-10">
                    <Text className="text-black font-nunito-extra-bold mb-1 ml-1 text-lg">
                      Username *
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-2xl h-16 shadow-sm border border-gray-100">
                      <View className="items-center justify-center w-14">
                        <Image
                          source={require("@/assets/images/user.png")}
                          className="w-6 h-6 opacity-60"
                        />
                      </View>
                      <TextInput
                        className="flex-1 text-lg h-full font-nunito-extra-bold"
                        placeholder="Enter username"
                        placeholderTextColor="#999"
                        onChangeText={handleChange("username")}
                        onBlur={handleBlur("username")}
                        value={values.username}
                      />
                    </View>
                    {errors.username && touched.username && (
                      <Text className="text-red-500 mt-2 ml-1 text-base">
                        {errors.username}
                      </Text>
                    )}
                  </View>

                  <View className="mb-10">
                    <Text className="text-gray-700 font-nunito-extra-bold mb-1 ml-1 text-lg">
                      Full Name
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-2xl h-16 shadow-sm border border-gray-100">
                      <View className="items-center justify-center w-14">
                        <Image
                          source={require("@/assets/images/user.png")}
                          className="w-6 h-6 opacity-60"
                        />
                      </View>
                      <TextInput
                        className="flex-1 text-lg h-full font-nunito-extra-bold"
                        placeholder="Enter your full name"
                        placeholderTextColor="#999"
                        onChangeText={handleChange("fullname")}
                        onBlur={handleBlur("fullname")}
                        value={values.fullname}
                      />
                    </View>
                  </View>

                  <View className="mb-10">
                    <Text className="text-gray-700 font-nunito-extra-bold mb-1 ml-1 text-lg">
                      Email Address *
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-2xl h-16 shadow-sm border border-gray-100">
                      <View className="items-center justify-center w-14">
                        <Image
                          source={require("@/assets/images/email.png")}
                          className="w-6 h-6 opacity-60"
                        />
                      </View>
                      <TextInput
                        className="flex-1 text-lg h-full font-nunito-extra-bold"
                        placeholder="example@email.com"
                        placeholderTextColor="#999"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                    {errors.email && touched.email && (
                      <Text className="text-red-500 mt-2 ml-1 text-base">
                        {errors.email}
                      </Text>
                    )}
                  </View>

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
                        {dob.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={dob}
                        mode="date"
                        display="default"
                        onChange={onChangeDob}
                        maximumDate={new Date()}
                      />
                    )}
                  </View>

                  <View className="mb-10">
                    <Text className="text-gray-700 font-nunito-extra-bold mb-1 ml-1 text-lg">
                      Gender *
                    </Text>
                    <View className="flex-row justify-between bg-gray-50 rounded-2xl p-5 shadow-sm border border-gray-100">
                      <TouchableOpacity
                        onPress={() => {
                          setGender("male");
                          handleChange("gender")("male");
                        }}
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
                            gender === "male"
                              ? "text-blue-500"
                              : "text-gray-500"
                          }`}
                        >
                          Male
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setGender("female");
                          handleChange("gender")("female");
                        }}
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
                            gender === "female"
                              ? "text-pink-500"
                              : "text-gray-500"
                          }`}
                        >
                          Female
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setGender("other");
                          handleChange("gender")("other");
                        }}
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
                            tintColor:
                              gender === "other" ? "#8b5cf6" : "#9ca3af",
                          }}
                        />
                        <Text
                          className={`mt-2 font-medium text-base ${
                            gender === "other"
                              ? "text-purple-500"
                              : "text-gray-500"
                          }`}
                        >
                          Other
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {errors.gender && touched.gender && (
                      <Text className="text-red-500 mt-2 ml-1 text-base">
                        {errors.gender}
                      </Text>
                    )}
                  </View>

                  <View className="mb-10">
                    <Text className="text-gray-700 font-nunito-extra-bold mb-1 ml-1 text-lg">
                      Password *
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-2xl h-16 shadow-sm border border-gray-100">
                      <View className="items-center justify-center w-14">
                        <Image
                          source={require("@/assets/images/padlock.png")}
                          className="w-6 h-6 opacity-60"
                        />
                      </View>
                      <TextInput
                        className="flex-1 text-lg h-full"
                        placeholder="Create password"
                        placeholderTextColor="#999"
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        secureTextEntry={hidePassword}
                      />
                      <TouchableOpacity
                        onPress={() => setPassword(!hidePassword)}
                        className="pr-5"
                      >
                        <Ionicons
                          name={hidePassword ? "eye-off" : "eye"}
                          size={24}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.password && touched.password && (
                      <Text className="text-red-500 mt-2 ml-1 text-base">
                        {errors.password}
                      </Text>
                    )}
                  </View>

                  <View className="mb-10">
                    <Text className="text-gray-700 font-nunito-extra-bold mb-1 ml-1 text-lg">
                      Confirm Password *
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-2xl h-16 shadow-sm border border-gray-100">
                      <View className="items-center justify-center w-14">
                        <Image
                          source={require("@/assets/images/padlock.png")}
                          className="w-6 h-6 opacity-60"
                        />
                      </View>
                      <TextInput
                        className="flex-1 text-lg h-full font-nunito-extra-bold"
                        placeholder="Confirm password"
                        placeholderTextColor="#999"
                        onChangeText={handleChange("confirmpassword")}
                        onBlur={handleBlur("confirmpassword")}
                        value={values.confirmpassword}
                        secureTextEntry={hideCPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setCPassword(!hideCPassword)}
                        className="pr-5"
                      >
                        <Ionicons
                          name={hideCPassword ? "eye-off" : "eye"}
                          size={24}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.confirmpassword && touched.confirmpassword && (
                      <Text className="text-red-500 mt-2 ml-1 text-base">
                        {errors.confirmpassword}
                      </Text>
                    )}
                  </View>

                  {errorMessage ? (
                    <Text className="text-red-500 text-center text-base">
                      {errorMessage}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    className="bg-green-900 py-5 rounded-xl mt-8 shadow-md"
                    onPress={() => handleSubmit()}
                  >
                    <Text className="text-white text-center text-xl font-nunito-extra-bold">
                      Create Account
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row justify-center mt-8">
                    <Text className="text-gray-500 text-lg">
                      Have an account already?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => router.replace("/Login")}>
                      <Text className="text-blue-500 font-nunito-extra-bold text-lg">
                        Sign In
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
