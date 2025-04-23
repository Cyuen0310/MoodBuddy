import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";
import { useSearchParams } from "expo-router/build/hooks";

const MbtiDetails: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mbti = searchParams.get('mbti');
  console.log('MBTI from params:', mbti)

  const getMbtiDetails = (mbtiType: string | null) => {
    switch (mbtiType) {
      case 'INFJ':
        return {
          image: icons.infj,
          title: "Advocate",
          description: "INFJs are known for their strong sense of integrity and their drive to help others. You are creative, insightful, and principled.",
          isValid: true
        };
      case 'INTJ':
        return {
          image: icons.intj,
          title: "Architect",
          description: "INTJs are independent thinkers who value knowledge and competence. You are strategic, determined, and often have a clear vision for the future.",
          isValid: true
        };
      case 'INFP':
        return {
          image: icons.infp,
          title: "Mediator",
          description: "INFPs are idealistic and driven by your values, often looking for meaning in life. You are empathetic, introspective, and deeply caring.",
          isValid: true
        };
      case 'INTP':
        return {
          image: icons.intp,
          title: "Logician",
          description: "INTPs are analytical thinkers who enjoy exploring concepts and theories. You are curious, inventive, and thrive on intellectual challenges.",
          isValid: true
        };
      case 'ENFJ':
        return {
          image: icons.enfj,
          title: "Protagonist",
          description: "ENFJs are charismatic and driven, often inspiring others. You are an empathetic leader who values harmony and connection in relationships.",
          isValid: true
        };
      case 'ENTJ':
        return {
          image: icons.entj,
          title: "Commander",
          description: "ENTJs are natural leaders who are decisive and strategic in your approach. You are confident, efficient, and thrive in challenging environments.",
          isValid: true
        };
      case 'ENFP':
        return {
          image: icons.enfp,
          title: "Campaigner",
          description: "ENFPs are enthusiastic and creative, often seeking new experiences. You are spontaneous, energetic, and deeply value personal relationships.",
          isValid: true
        };
      case 'ENTP':
        return {
          image: icons.entp,
          title: "Debater",
          description: "ENTPs are curious and flexible thinkers who cannot resist an intellectual challenge. You are quick-witted, innovative, and enjoy debating ideas.",
          isValid: true
        };
      case 'ISFJ':
        return {
          image: icons.isfj,
          title: "Defender",
          description: "ISFJs are nurturing and responsible, often putting others before yourself. You are detail-oriented, loyal, and value tradition.",
          isValid: true
        };
      case 'ISTJ':
        return {
          image: icons.istj,
          title: "Logistician",
          description: "ISTJs are dependable and diligent, often valuing tradition and order. You are practical, organized, and excel in following through on tasks.",
          isValid: true
        };
      case 'ISFP':
        return {
          image: icons.isfp,
          title: "Adventurer",
          description: "ISFPs are artistic and sensitive, often valuing personal expression. You are spontaneous, compassionate, and appreciate beauty in the world.",
          isValid: true
        };
      case 'ISTP':
        return {
          image: icons.istp,
          title: "Virtuoso",
          description: "ISTPs are hands-on problem solvers who enjoy working with your hands. You are adventurous, adaptable, and thrive in dynamic environments.",
          isValid: true
        };
      case 'ESFJ':
        return {
          image: icons.esfj,
          title: "Consul",
          description: "ESFJs are outgoing, friendly, and often take on the role of caretaker. You value harmony, community, and are deeply attuned to the needs of others.",
          isValid: true
        };
      case 'ESTJ':
        return {
          image: icons.estj,
          title: "Executive",
          description: "ESTJs are organized, practical, and often take charge of situations. You are decisive, responsible, and thrive in structured environments.",
          isValid: true
        };
      case 'ESFP':
        return {
          image: icons.esfp,
          title: "Entertainer",
          description: "ESFPs are lively and spontaneous, enjoying being the center of attention. You are energetic, enthusiastic, and appreciate living in the moment.",
          isValid: true
        };
      case 'ESTP':
        return {
          image: icons.estp,
          title: "Entrepreneur",
          description: "ESTPs are energetic and love to take risks and live in the moment. You are action-oriented, resourceful, and enjoy exploring new experiences.",
          isValid: true
        };
      default:
        return {
          image: icons.bewhat,
          title: "",
          //description: "No specific details available for this type.",
          isValid: false
        };
    }
  };

  const { image, title, description, isValid } = getMbtiDetails(mbti);
  const mbtiUrl = `https://www.16personalities.com/${mbti?.toLowerCase()}-personality`;

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
        <Image source={image} style={styles.infoImage} />
        <Text style={styles.titleText}>{title}</Text>
        {isValid && <Text style={styles.mbtiTypeText}>{mbti}</Text>}
        <Text style={styles.descriptionText}>{description}</Text>
        <Text style={styles.emphasisText}>You Can Be Anything You Want To Be!</Text>
        
        {isValid ? (
          <View style={styles.container}>
            <TouchableOpacity onPress={() => Linking.openURL(mbtiUrl)}>
              <Text style={styles.learnMoreText}>Want to know more?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/Question")} >
              <Text style={styles.learnMoreText}>Retake the Test</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => router.push("/Question")}>
            <Text style={styles.learnMoreText}>Take the Test Now</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoImage: {
    width: '100%',
    height: 360,
    borderRadius: 12,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  mbtiTypeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  emphasisText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 10,
  },
  learnMoreText: {
    fontSize: 16,
    color: "#007BFF",
    textAlign: "center",
    marginTop: 10,
  },
});

export default MbtiDetails;
