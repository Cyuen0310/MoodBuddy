import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  ImageSourcePropType,
  LayoutChangeEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import icons from "@/constants/icons";
import { auth, fetchUserData } from "@/app/(auth)/auth";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Index: React.FC = () => {
  const [quoteBlockDimensions, setQuoteBlockDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [username, setUsername] = useState<string | null>(null);
  const [mbti, setMbti] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const router = useRouter();

  const getUserData = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUsername(userData.username);
        const userDetails = await fetchUserData(userData.uid);
        setMbti(userDetails.mbti);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchLatestAvatar = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const { uid } = JSON.parse(user);
        const userData = await fetchUserData(uid);
        setAvatar(userData.avatar || null);
        setUsername(userData.username);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
      fetchLatestAvatar();
    }, [])
  );

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const onQuoteBlockLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setQuoteBlockDimensions({ width, height });
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <TouchableOpacity
              onPress={() => router.push("/(settings)/userInfo")}
            >
              <Image
              source={avatar ? { uri: avatar } : (icons.avatar as ImageSourcePropType)}
              style={styles.avatar}
            />
            </TouchableOpacity>
            <View style={styles.userText}>
              <Text style={styles.welcomeText}>Welcome to MoodBuddy!</Text>
              <Text style={styles.userName}>
                {username ? username : "User"}
              </Text>
            </View>
          </View>
          <Image
            source={icons.bell as ImageSourcePropType}
            style={styles.bellIcon}
          />
        </View>

        <TouchableOpacity
          style={styles.mbtiContainer}
          onPress={() => {
            console.log("Navigating with MBTI:", mbti);
            router.push(`/(index)/mbtiDetails?mbti=${mbti}`);
          }}
        >
          <Text style={styles.mbtiText}>Your MBTI: {mbti || "N/A"}</Text>
        </TouchableOpacity>

        <View style={styles.container}>
          <View style={[styles.box, styles.quoteBlockContainer]}>
            <Image
              source={icons.bg as ImageSourcePropType}
              style={[
                styles.quoteBackground,
                {
                  width: quoteBlockDimensions.width,
                  height: quoteBlockDimensions.height,
                },
              ]}
            />
            <View style={styles.quoteBlock} onLayout={onQuoteBlockLayout}>
              <Text style={styles.quoteText}>
                "Sometimes the most productive thing you can do is relax."
              </Text>
              <Text style={styles.authorText}>– Mark Black</Text>
            </View>
          </View>

          <View style={[styles.box, styles.buttonBlockContainer]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}
            >
              <TouchableOpacity
                style={[styles.card, styles.card1]}
                onPress={() => router.push("/(index)/meditation")}
              >
                <Image
                  source={icons.meditation as ImageSourcePropType}
                  style={styles.cardBackground}
                />
                <Text style={[styles.cardText, { color: "black" }]}>
                  Meditation
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.card, styles.card2]}
                onPress={() => router.push("/(index)/relaxationArea")}
              >
                <Image
                  source={icons.relaxation as ImageSourcePropType}
                  style={styles.cardBackground}
                />
                <Text style={[styles.cardText, { color: "black" }]}>
                  Relaxation Area
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.card, styles.card3]}
                onPress={() => router.push("/(index)/sleepTherapy")}
              >
                <Image
                  source={icons.sleep as ImageSourcePropType}
                  style={styles.cardBackground}
                />
                <Text style={[styles.cardText, { color: "black" }]}>
                  Sleep Therapy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.card, styles.card4]}
                onPress={() => router.push("/(index)/recentSummary")}
              >
                <Image
                  source={icons.summary as ImageSourcePropType}
                  style={styles.cardBackground}
                />
                <Text style={[styles.cardText, { color: "black" }]}>
                  Recent Summary
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  facebook: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userText: {
    marginLeft: 8,
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: "Nunito",
    color: "#666876",
  },
  userName: {
    fontSize: 18,
    fontFamily: "Nunito-Bold",
    color: "#000",
  },
  bellIcon: {
    width: 24,
    height: 24,
  },
  mbtiContainer: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  mbtiText: {
    fontSize: 18,
    fontFamily: "Nunito-Bold",
    color: "#333",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 70, // Add padding to account for the bottom tab bar height
  },
  box: {
    flex: 1, // Set flex to 1 to make each box take up an equal portion of the available space
    borderRadius: 10,
    marginVertical: 10 / 2, // Divide by 2 to apply half margin on top and bottom
    justifyContent: "center",
    alignItems: "center",
  },
  quoteBlockContainer: {
    backgroundColor: "#ADD8E6", // Light blue background for quote block
    padding: 10,
    position: "relative", // To position the background image
  },
  quoteBackground: {
    position: "absolute",
    borderRadius: 10,
    opacity: 0.9, // Adjust opacity for better text visibility
  },
  quoteBlock: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background for the quote block
    padding: 20,
    borderRadius: 10,
    width: width - 40, // Ensure the block is slightly smaller than the screen width
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // For Android shadow
    justifyContent: "space-between", // Space out the quote text and author text
  },
  quoteText: {
    fontSize: 20,
    fontFamily: "Nunito-Italic",
    color: "#333",
    textAlign: "center", // Center the text
  },
  authorText: {
    fontSize: 16,
    fontFamily: "Nunito",
    color: "#333",
    textAlign: "right", // Align the author text to the right
    marginTop: 10, // Add some margin to separate from the quote text
  },
  buttonBlockContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  scrollView: {
    alignItems: "center",
  },
  card: {
    width: 150,
    height: 200,
    borderRadius: 8,
    marginRight: 10, // Reduced margin
    justifyContent: "flex-start", // Align text to the top
    padding: 10, // Padding inside the card
    position: "relative", // To position the background image
  },
  cardBackground: {
    position: "absolute",
    borderRadius: 8,
    opacity: 0.9, // Adjust opacity for better text visibility
    width: 150,
    height: 200,
  },
  card1: {
    backgroundColor: "#E5E7EB",
  },
  card2: {
    backgroundColor: "#E5E7EB",
  },
  card3: {
    backgroundColor: "#E5E7EB",
  },
  card4: {
    backgroundColor: "#E5E7EB",
  },
  cardText: {
    textAlign: "left", // Align text to the left
    fontSize: 16, // Adjust font size if needed
    zIndex: 1, // Ensure text is above the background image
  },
  bottomButtonContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  socialButton: {
    padding: 10,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  navigateButton: {
    backgroundColor: "#008888",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  navigateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Index;
