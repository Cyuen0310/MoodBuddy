import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "./global.css";
import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

// load fonts
export default function RootLayout() {
  const [loadedfont] = useFonts({
    "Nunito-Black": require("../assets/fonts/Nunito-Black.ttf"),
    "Nunito-BlackItalic": require("../assets/fonts/Nunito-BlackItalic.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-BoldItalic": require("../assets/fonts/Nunito-BoldItalic.ttf"),
    "Nunito-ExtraBold": require("../assets/fonts/Nunito-ExtraBold.ttf"),
    "Nunito-ExtraBoldItalic": require("../assets/fonts/Nunito-ExtraBoldItalic.ttf"),
    "Nunito-ExtraLight": require("../assets/fonts/Nunito-ExtraLight.ttf"),
    "Nunito-ExtraLightItalic": require("../assets/fonts/Nunito-ExtraLightItalic.ttf"),
    "Nunito-Italic": require("../assets/fonts/Nunito-Italic.ttf"),
    "Nunito-Light": require("../assets/fonts/Nunito-Light.ttf"),
    "Nunito-LightItalic": require("../assets/fonts/Nunito-LightItalic.ttf"),
    "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
    "Nunito-MediumItalic": require("../assets/fonts/Nunito-MediumItalic.ttf"),
    "Nunito-Regular": require("../assets/fonts/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-SemiBoldItalic": require("../assets/fonts/Nunito-SemiBoldItalic.ttf"),
  });

  useEffect(() => {
    if (loadedfont) {
      SplashScreen.hideAsync();
    }
  }, [loadedfont]);

  if (!loadedfont) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}


$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
