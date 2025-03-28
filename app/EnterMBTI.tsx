import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  Styledcontainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFromArea,
  StyledButton,
  ButtonText,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  WelcomeContainer,
} from "@/components/style/style";
import { auth, updateUserMBTI } from "./(auth)/auth";

const EnterScreen = () => {
  const router = useRouter();

  const [mbti, setMbti] = useState({
    A: "",
    B: "",
    C: "",
    D: "",
  });

  const handleSelect = (dimension: string, value: string) => {
    setMbti((prev) => ({ ...prev, [dimension]: value }));
  };

  const handleFinish = async () => {
    if (Object.values(mbti).some((value) => value === "")) {
      alert("Please select an option for all dimensions before finishing.");
      return;
    }
    const mbtiResult = mbti.A + mbti.B + mbti.C + mbti.D;
    console.log("MBTI:", mbtiResult);
    const user = auth.currentUser;
        if (user) {
            const uid = user.uid;
            try {
                await updateUserMBTI(uid, mbtiResult);
            } catch (error) {
                console.error("Error updating MBTI:", error);
            }
        }
      router.replace("/(root)/(tabs)");

  };

  return (
    <Styledcontainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <WelcomeContainer>
          <PageTitle>Choose your MBTI</PageTitle>
          <SubTitle question={true}>
            If you do this test before
          </SubTitle>
          <SubTitle question={true}> 
            you can enter your test result.
          </SubTitle>

          <View style={styles.optionContainer}>
            <TouchableOpacity onPress={() => handleSelect("A", "I")}>
              <Text
                style={[
                  styles.dimensionText,
                  mbti.A === "I" && styles.selected,
                ]}
              >
                I: Introversion
              </Text>
            </TouchableOpacity>
            <Text style={styles.spacing}></Text>
            <TouchableOpacity onPress={() => handleSelect("A", "E")}>
              <Text
                style={[
                  styles.dimensionText,
                  mbti.A === "E" && styles.selected,
                ]}
              >
                E: Extraversion
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionContainer}>
            <TouchableOpacity onPress={() => handleSelect("B", "S")}>
              <Text
                style={[
                  styles.dimensionText,
                  mbti.B === "S" && styles.selected,
                ]}
              >
                S: Sensing
              </Text>
            </TouchableOpacity>
            <Text style={styles.spacing}></Text>
            <TouchableOpacity onPress={() => handleSelect("B", "N")}>
              <Text
                style={[
                  styles.dimensionText,
                  mbti.B === "N" && styles.selected,
                ]}
              >
                N: Intuition
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionContainer}>
            <TouchableOpacity onPress={() => handleSelect("C", "T")}>
              <Text
                style={[
                  styles.dimensionText,
                  mbti.C === "T" && styles.selected,
                ]}
              >
                T: Thinking
              </Text>
            </TouchableOpacity>
            <Text style={styles.spacing}></Text>
            <TouchableOpacity onPress={() => handleSelect("C", "F")}>
              <Text
                style={[
                  styles.dimensionText,
                  mbti.C === "F" && styles.selected,
                ]}
              >
                F: Feeling
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionContainer}>
            <TouchableOpacity onPress={() => handleSelect("D", "J")}>
              <Text
                style={[
                  styles.dimensionText,
                  mbti.D === "J" && styles.selected,
                ]}
              >
                J: Judging
              </Text>
            </TouchableOpacity>
            <Text style={styles.spacing}></Text>
            <TouchableOpacity onPress={() => handleSelect("D", "P")}>
              <Text
                style={[
                  styles.dimensionText,
                  mbti.D === "P" && styles.selected,
                ]}
              >
                P: Perceiving
              </Text>
            </TouchableOpacity>
          </View>

          <StyledFromArea>
            <StyledButton onPress={handleFinish}>
              <ButtonText>Finish</ButtonText>
            </StyledButton>
          </StyledFromArea>
          <ExtraView>
            <ExtraText> Want to choose a new one? </ExtraText>
            <TextLink onPress={() => router.replace("/Question")}>
              <TextLinkContent>Back to Question</TextLinkContent>
            </TextLink>
          </ExtraView>
        </WelcomeContainer>
      </InnerContainer>
    </Styledcontainer>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  dimensionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  selected: {
    color: "red",
  },
  spacing: {
    marginHorizontal: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  notesContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  noteText: {
    fontSize: 16,
    color: "black",
  },
});

export default EnterScreen;
