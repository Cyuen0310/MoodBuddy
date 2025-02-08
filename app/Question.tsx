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
  WelcomeContainer,
  WelcomeImage,
  Avater,
  PageTitle,
} from "../components/style/style";

const QuestionScreen = () => {
  const router = useRouter();
  return (
    <Styledcontainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <WelcomeContainer>
          <PageTitle question={true}>MBTI Questionnaire </PageTitle>
          <PageTitle>Hi! Naaame</PageTitle>
          <SubTitle question={true}>We want to know more about you</SubTitle>
          <Line />
          <SubTitle question2={true}>
            Would you like to do a Questionnair?
          </SubTitle>
          <StyledFromArea
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <StyledButton
              onemin={true}
              onPress={() => router.replace("/Q_Onemin")}
            >
              <ButtonText>One Min Test</ButtonText>
            </StyledButton>
            <StyledButton
              tenmin={true}
              onPress={() => router.replace("/Q_Fivemins")}
            >
              <ButtonText>Five Mins Test</ButtonText>
            </StyledButton>
          </StyledFromArea>
          <StyledFromArea>
            <StyledButton
              style={{ backgroundColor: "#228B22", height: 100 }}
              onPress={() => router.replace("/Q_Tenmins")}
            >
              <ButtonText>Ten Mins Test</ButtonText>
            </StyledButton>
          </StyledFromArea>
          <StyledFromArea>
            <StyledButton
              style={{ backgroundColor: "#A9A9A9" }}
              onPress={() => router.replace("/(root)/(tabs)")}
            >
              <ButtonText>No,Thank You</ButtonText>
            </StyledButton>
          </StyledFromArea>
        </WelcomeContainer>
      </InnerContainer>
    </Styledcontainer>
  );
};

export default QuestionScreen;
