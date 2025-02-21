import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";

const MbtiDetails: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image source={icons.backArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>MBTI Details</Text>
        <View style={styles.backButton} /> 
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={icons.infj} style={styles.infoImage} />
        <Text style={styles.mbtiTypeText}>INFJ - The Advocate</Text>
        <Text style={styles.descriptionText}>
          INFJs are known for their strong sense of integrity and their drive to help others. They are creative, insightful, and principled.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    flex: 1,
    fontSize: 24,
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
  infoImage: {
    width: '100%',
    height: 360,
    borderRadius: 12,
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