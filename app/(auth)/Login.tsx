import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { login } from "./auth";

interface FormValues {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const router = useRouter();
  const [hidePassword, setPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (values: FormValues) => {
    try {
      const user = await login(values.email, values.password);
      console.log("User login", user);
      router.push("/(root)/(tabs)");
    } catch (error) {
      setErrorMessage("Please enter the correct email and password");
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-8 justify-center">
          <View className="items-center">
            <Image
              source={require("@/assets/images/MB_logo.png")}
              className="w-56 h-48 right-4"
              resizeMode="contain"
            />
          </View>

          <Text className="text-3xl font-nunito-bold mb-7 text-center">
            Login
          </Text>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <View className="mb-8">
                  <View className="flex-row items-center bg-gray-50 rounded-2xl h-16">
                    <Image
                      source={require("@/assets/images/email.png")}
                      className="w-7 h-7 mx-5"
                    />
                    <TextInput
                      className="flex-1 text-lg h-16 font-nunito-extra-bold"
                      placeholder="Email"
                      placeholderTextColor="#666"
                      onChangeText={(text) => {
                        handleChange("email")(text);
                        setErrorMessage("");
                      }}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.email && touched.email && (
                    <Text className="text-red-500 mt-2">{errors.email}</Text>
                  )}
                </View>

                <View className="mb-12">
                  <View className="flex-row items-center bg-gray-50 rounded-2xl h-16">
                    <Image
                      source={require("@/assets/images/padlock.png")}
                      className="w-7 h-7 mx-5"
                    />
                    <TextInput
                      className="flex-1 text-lg h-16 font-nunito-extra-bold"
                      placeholder="Password"
                      placeholderTextColor="#666"
                      onChangeText={(text) => {
                        handleChange("password")(text);
                        setErrorMessage("");
                      }}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      secureTextEntry={hidePassword}
                    />
                    <TouchableOpacity
                      onPress={() => setPassword(!hidePassword)}
                      className="h-16 px-5 flex items-center justify-center"
                    >
                      <Ionicons
                        name={hidePassword ? "eye-off" : "eye"}
                        size={28}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password && (
                    <Text className="text-red-500 mt-2">{errors.password}</Text>
                  )}
                </View>

                {errorMessage ? (
                  <Text className="text-red-500 text-center  mb-4 leading-5">
                    {errorMessage}
                  </Text>
                ) : null}

                <TouchableOpacity
                  className="bg-green-900 py-5 rounded-2xl mb-8"
                  onPress={() => handleSubmit()}
                >
                  <Text className="text-white text-center text-xl font-nunito-extra-bold ">
                    Login
                  </Text>
                </TouchableOpacity>

                <View className="items-center space-y-6">
                  <View className="flex-row">
                    <Text className="text-gray-500 text-lg leading-6 font-nunito-extra-bold">
                      Don't have an account?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => router.replace("/SignUp")}>
                      <Text className="text-blue-500 font-nunito-extra-bold text-lg leading-6">
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => router.replace("/Forget")}
                    className="py-5"
                  >
                    <Text className="text-blue-500 text-lg font-nunito-extra-bold leading-6">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
