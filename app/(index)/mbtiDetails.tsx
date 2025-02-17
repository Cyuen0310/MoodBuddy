import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import icons from "@/constants/icons"; // Make sure to import your icons correctly

const MbtiDetails: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Image source={icons.backArrow} className="size-6" />
        </TouchableOpacity>
        <Text style={styles.headerText}>MBTI Details</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.contentText}>This is the MBTI Details page.</Text>
        <Text style={styles.mbtiTypeText}>INFJ - The Advocate</Text>
        <Text style={styles.descriptionText}>
          INFJs are known for their strong sense of integrity and their drive to help others. They are creative, insightful, and principled.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    backgroundColor: '#ADD8E6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  mbtiTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MbtiDetails;