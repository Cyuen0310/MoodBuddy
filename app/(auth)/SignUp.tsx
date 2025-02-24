import React, { useState } from "react";
import { Platform, ScrollView, TouchableWithoutFeedback } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  Button,
  TextInputProps,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, Octicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { FirebaseError } from "firebase/app";
import { signup } from "./auth";
import {
  Styledcontainer,
  InnerContainer,
  PageLogo,
  SubTitle,
  StyledFromArea,
  LeftIcon,
  RightIcon,
  StyledInputLabel,
  StyledTextInput,
  Colors,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
  PageTitle,
} from "@/components/style/style";
import { KeyboardAvoidingView } from "react-native";
import { Keyboard } from "react-native";
const { darkLight, brand } = Colors;

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

  const [hidePassword, setPassword] = useState(true);
  const [hideCPassword, setCPassword] = useState(true);
  const [gender, setGender] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dob, setDob] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");

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
    <Styledcontainer>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }} 
            keyboardShouldPersistTaps="handled"
          >        
          <InnerContainer>
          <PageTitle>Mood Buddy</PageTitle>
          <SubTitle>Sign Up</SubTitle>
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
              <StyledFromArea>
                <UserTextInput
                  label="User Name *"
                  icon={require("@/assets/images/user.png")}
                  placeholder="User Name"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                />
                {errors.username && touched.username && (
                  <Text style={{ color: "red" }}>{errors.username}</Text>
                )}

                <UserTextInput
                  label="Full Name"
                  icon={require("@/assets/images/user.png")}
                  placeholder="Full Name"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("fullname")}
                  onBlur={handleBlur("fullname")}
                  value={values.fullname}
                />

                <UserTextInput
                  label="Email Address*"
                  icon={require("@/assets/images/email.png")}
                  placeholder="user@example.com"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                />
                {errors.email && touched.email && (
                  <Text style={{ color: "red" }}>{errors.email}</Text>
                )}

                <UserTextInput
                  label="Date of Birth"
                  icon={require("@/assets/images/cake.png")}
                  placeholder="DD - MM - YYYY"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("DOB")}
                  onBlur={handleBlur("DOB")}
                  value={dob.toLocaleDateString()}
                  onFocus={() => {
                    Keyboard.dismiss();
                    setShowDatePicker(true);
                  }}
                  />
                {showDatePicker && (
                  <DateTimePicker
                    value={dob}
                    mode="date"
                    display="default"
                    onChange={onChangeDob}
                    maximumDate={new Date()}
                  />
                )}

                <View>
                  <StyledInputLabel>Gender*</StyledInputLabel>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setGender("male");
                        handleChange("gender")("male");
                      }}
                    >
                      <Ionicons
                        name="male"
                        size={30}
                        color={gender === "male" ? "blue" : "gray"}
                      />
                      <Text>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setGender("female");
                        handleChange("gender")("female");
                      }}
                    >
                      <Ionicons
                        name="female"
                        size={30}
                        color={gender === "female" ? "blue" : "gray"}
                      />
                      <Text>Female</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setGender("other");
                        handleChange("gender")("other");
                      }}
                      style={{ alignItems: "center" }}
                    >
                      <Image
                        source={require("@/assets/images/genderless.png")}
                        style={{
                          width: 30,
                          height: 30,
                          tintColor: gender === "other" ? "blue" : "gray",
                        }}
                      />
                      <Text>Other</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {errors.gender && touched.gender && (
                  <Text style={{ color: "red" }}>{errors.gender}</Text>
                )}

                <UserTextInput
                  label="Password*"
                  icon={require("@/assets/images/padlock.png")}
                  placeholder="* * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setPassword={setPassword}
                />
                {errors.password && touched.password && (
                  <Text style={{ color: "red" }}>{errors.password}</Text>
                )}

                <UserTextInput
                  label="Confirm Password*"
                  icon={require("@/assets/images/padlock.png")}
                  placeholder="* * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("confirmpassword")}
                  onBlur={handleBlur("confirmpassword")}
                  value={values.confirmpassword}
                  secureTextEntry={hideCPassword}
                  isPassword={true}
                  hidePassword={hideCPassword}
                  setPassword={setCPassword}
                />
                {errors.confirmpassword && touched.confirmpassword && (
                  <Text style={{ color: "red" }}>{errors.confirmpassword}</Text>
                )}
                {errorMessage ? (
                  <MsgBox style={{ color: "red" }}>{errorMessage}</MsgBox>
                ) : null}

                <StyledButton onPress={() => handleSubmit()}>
                  <ButtonText>Next</ButtonText>
                </StyledButton>
                <Line />
                <ExtraView>
                  <ExtraText> Have an account already? </ExtraText>
                  <TextLink onPress={() => router.replace("/Login")}>
                    <TextLinkContent>Login</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFromArea>
            )}
          </Formik>
        </InnerContainer>
      </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </Styledcontainer>
  );
};

const UserTextInput = ({
  label,
  icon,
  isPassword = false,
  hidePassword,
  setPassword,
  isPicker = false,
  onValueChange,
  placeholder,
  pickerItems = [],
  ...props
}: {
  label: string;
  icon: ImageSourcePropType;
  isPassword?: boolean;
  hidePassword?: boolean;
  setPassword?: React.Dispatch<React.SetStateAction<boolean>>;
  isPicker?: boolean;
  onValueChange?: (itemValue: string) => void;
  pickerItems?: { label: string; value: string }[];
  selectedValue?: string;
  placeholder?: string;
} & TextInputProps) => {
  return (
    <View>
      <LeftIcon>
        <Image source={icon} style={{ width: 30, height: 30 }} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      {isPicker ? (
        <View style={{ marginLeft: 60 }}>
          <Picker
            selectedValue={props.value}
            onValueChange={onValueChange}
            style={{
              height: 60,
              width: "100%",
              backgroundColor: "#E5E7E8",
            }}
          >
            <Picker.Item label={placeholder} value="" enabled={false} />
            {pickerItems.map((item) => (
              <Picker.Item
                label={item.label}
                value={item.value}
                key={item.value}
              />
            ))}
          </Picker>
        </View>
      ) : (
        <StyledTextInput {...props} />
      )}
      {isPassword && (
        <RightIcon>
          <Ionicons
            name={hidePassword ? "eye-off" : "eye"}
            size={30}
            color={darkLight}
            onPress={() => setPassword?.(!hidePassword)}
          />
        </RightIcon>
      )}
    </View>
  );
};

export default SignUpScreen;

