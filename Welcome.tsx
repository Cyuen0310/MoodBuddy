import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Button, TextInputProps, Image, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { Ionicons, Octicons } from '@expo/vector-icons';
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
    PageTitle
} from '../components/style'


const WelcomeScreen = () => {
  const router = useRouter();
    return (
    <Styledcontainer>
        <StatusBar style="dark" />
            <InnerContainer>
              <WelcomeImage resizeMode="cover" source={require('./../assets/images/bg.jpeg')}/>
                  <WelcomeContainer>
                      <PageTitle welcome={true}>Welcome !</PageTitle>
                      <SubTitle welcome={true}>Nameeeeee</SubTitle>
                      <SubTitle welcome={true}>abcd@gmail.com</SubTitle>

                    <StyledFromArea>
                    <Avater resizeMode="cover" source={require('./../assets/images/MB_logo.png')} />
                    <Line />
                    <StyledButton onPress={() => router.replace('./Main')}>
                            <ButtonText>Start Your Journey</ButtonText>
                        </StyledButton>
                    <StyledButton onPress={() => router.replace('/Login')}>
                            <ButtonText>Logout</ButtonText>
                        </StyledButton>
                    </StyledFromArea>
                </WelcomeContainer>
            </InnerContainer>
  </Styledcontainer>
);
};

export default WelcomeScreen;