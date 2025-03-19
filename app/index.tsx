import React from "react";
import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";

import Login from "./(auth)/Login";
import SignUp from "./(auth)/SignUp";

import Question from "./Question";
import Q_Onemin from "./Q_Onemin";
import Q_Tenmins from "./Q_Tenmins";
import Q_Fivemins from "./Q_Fivemins";

export default function Index() {
  return <Redirect href="/(root)/(tabs)" />;
}
