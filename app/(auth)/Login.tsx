import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  Button,
  TextInputProps,
  Image,
  ImageSourcePropType,
} from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { Ionicons, Octicons } from "@expo/vector-icons";
import * as Yup from "yup";
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
} from "@/components/style/style";
const { darkLight, brand } = Colors;

const LoginScreen = () => {
  const router = useRouter();

  const handleLogin = () => {
    // user 驗證
    router.push("/Question");
  };

  const [hidePassword, setPassword] = useState(true);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  return (
    <Styledcontainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageLogo
          resizeMode="cover"
          source={require("@/assets/images/MB_logo.png")}
        />
        <SubTitle>Login</SubTitle>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
            handleLogin(); // use login
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <StyledFromArea>
              <UserTextInput
                label="Email Address"
                icon={require("@/assets/images/email.png")}
                placeholder="ABCD@gmail.com"
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
                label="Password"
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
              <MsgBox> ... </MsgBox>
              <StyledButton onPress={() => handleSubmit()}>
                <ButtonText>Login</ButtonText>
              </StyledButton>
              <Line />
              <ExtraView>
                <ExtraText> Don't have an account already? </ExtraText>
                <TextLink onPress={() => router.replace("/SignUp")}>
                  <TextLinkContent>SignUp</TextLinkContent>
                </TextLink>
              </ExtraView>
              <ExtraView>
                <ExtraText> Forget the password? </ExtraText>
                <TextLink>
                  <TextLinkContent>Forget</TextLinkContent>
                </TextLink>
              </ExtraView>
            </StyledFromArea>
          )}
        </Formik>
      </InnerContainer>
    </Styledcontainer>
  );
};

const UserTextInput = ({
  label,
  icon,
  isPassword = false,
  hidePassword,
  setPassword,
  ...props
}: {
  label: string;
  icon: ImageSourcePropType;
  isPassword?: boolean;
  hidePassword?: boolean;
  setPassword?: React.Dispatch<React.SetStateAction<boolean>>;
} & TextInputProps) => {
  return (
    <View>
      <LeftIcon>
        <Image source={icon} style={{ width: 30, height: 30 }} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
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

export default LoginScreen;
