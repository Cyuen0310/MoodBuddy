import React from "react";
import {View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";

const Meditation: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image source={icons.backArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meditation</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>
          Welcome to your meditation journey. Find a comfortable place, relax, and let's begin.
        </Text>

        <View style={styles.card}>
          <Image source={icons.breathingExercise} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Breathing Exercise</Text>
          <Text style={styles.cardDescription}>
            Start by taking a deep breath in through your nose, hold it for a few seconds, and then slowly exhale through your mouth. Repeat this process for a few minutes to calm your mind.
          </Text>
        </View>

        <View style={styles.card}>
          <Image source={icons.bodyScan} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Body Scan</Text>
          <Text style={styles.cardDescription}>
            Close your eyes and bring your attention to your body. Start from the top of your head and slowly move down to your toes, noticing any tension or discomfort. Take a deep breath and release any tension you find.
          </Text>
        </View>

        <View style={styles.card}>
          <Image source={icons.guidedMeditation} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Guided Meditation</Text>
          <Text style={styles.cardDescription}>
            Listen to a guided meditation audio to help you focus and relax. You can find various guided meditations online or use a meditation app.
          </Text>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleGoBack}>
          <Text style={styles.nextButtonText}>Well Done! Go Back to home Page</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    width: '100%',
    padding: 16,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Meditation;