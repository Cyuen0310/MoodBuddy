import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth } from "./auth";
import {
  Styledcontainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
  MsgBox,
} from "@/components/style/style";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      const emailExists = await checkEmailInDatabase(email.toLowerCase());
      if (!emailExists) {
        setErrorMessage("No account found with this email address.");
        return;
      }
      await sendPasswordResetEmail(auth, email.toLowerCase());
      Alert.alert("Success", "Password reset email sent successfully!");
      router.push("/Login");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/invalid-email") {
        setErrorMessage("The email address is not valid.");
      } else {
        setErrorMessage(
          "Failed to send password reset email. Please try again."
        );
      }
    }
  };
  const checkEmailInDatabase = async (email: string) => {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  return (
    <Styledcontainer>
      <StatusBar style="dark" />
      <InnerContainer style={styles.innerContainer}>
        <PageTitle>Mood Buddy</PageTitle>
        <SubTitle>Forget Password</SubTitle>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errorMessage ? (
          <MsgBox style={{ color: "red" }}>{errorMessage}</MsgBox>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Send Reset Email</Text>
        </TouchableOpacity>

        <ExtraView>
          <ExtraText> Remember the password? </ExtraText>
          <TextLink onPress={() => router.replace("/Login")}>
            <TextLinkContent>Login</TextLinkContent>
          </TextLink>
        </ExtraView>
      </InnerContainer>
    </Styledcontainer>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 60,
    width: 245,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    marginBottom: 25,
    fontSize: 17,
  },
  button: {
    backgroundColor: "#3b5998",
    width: 245,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
  },
});

export default ResetPasswordPage;
