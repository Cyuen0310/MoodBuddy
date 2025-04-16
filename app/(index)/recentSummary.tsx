import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import icons from "@/constants/icons"; // Make sure to import your icons correctly

const RecentSummary: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Image source={icons.backArrow} className="size-6" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Recent Summary</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.contentText}>This is the Recent Summary page.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "f0f4f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f4f8",
    elevation: 2,
  },
  backButton: {
    position: "absolute",
    left: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: {
    fontSize: 16,
    color: "#666",
  },
});

export default RecentSummary;
