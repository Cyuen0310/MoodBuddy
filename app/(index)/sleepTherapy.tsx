import React from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";

const SleepTherapy: React.FC = () => {
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
        <Text style={styles.headerTitle}>Sleep Therapy</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>
          Welcome to your sleep therapy journey. Explore various techniques to enhance your sleep quality and promote relaxation.
        </Text>

        <View style={styles.card}>
        <Image source={icons.bed} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Establish a Sleep Routine</Text>
          <Text style={styles.cardDescription}>
            Set a regular bedtime and wake-up time, even on weekends, to regulate your body's internal clock.
          </Text>
        </View>

        <View style={styles.card}>
        <Image source={icons.oil} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Aromatherapy for Sleep</Text>
          <Text style={styles.cardDescription}>
            Use calming essential oils like lavender or chamomile in a diffuser to create a soothing environment.
          </Text>
        </View>

        <View style={styles.card}>
        <Image source={icons.yoga} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Gentle Yoga Stretches</Text>
          <Text style={styles.cardDescription}>
            Practice gentle yoga stretches before bed to release tension and prepare your body for sleep.
          </Text>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleGoBack}>
          <Text style={styles.nextButtonText}>Well Done! Go Back to Home Page</Text>
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

export default SleepTherapy;