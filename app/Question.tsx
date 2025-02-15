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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserData } from '../(auth)/auth';
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
  const [username, setUsername] = useState<string | null>(null
  );
      const [loading, setLoading] = useState(true
  );
  useEffect(() => {
    const getUserData = async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                console.log('Fetched user ID from AsyncStorage:', userData.uid);
                const data = await fetchUserData(userData.uid);
                console.log('Fetched user data from Firestore:', data);
                setUsername(data.username); 
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    getUserData();
}, []);
  return (
    <Styledcontainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <WelcomeContainer>
          <PageTitle question={true}>MBTI Questionnaire </PageTitle>
          <PageTitle>{username ? `Hi! ${username}` : 'Hi! Guest'}</PageTitle>
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
