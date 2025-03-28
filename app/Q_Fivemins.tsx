import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth, updateUserMBTI } from "./(auth)/auth";
import {
  Styledcontainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFromArea,
  StyledButton,
  ButtonText,
  Line,
  WelcomeContainer,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
} from "@/components/style/style";

interface Option {
  label: string;
  value: string;
}

interface QuestionProps {
  questionText: string;
  options: Option[];
  selectedAnswer: string;
  setSelectedAnswer: (answer: string) => void;
}

const questionsData: { questionText: string; options: Option[] }[] = [
  {
    questionText: "Question 1: In which situation do you feel more energized?",
    options: [
      {
        label:
          "A. Spending time alone, watching TV shows, or playing video games",
        value: "I",
      },
      { label: "B. Socializing with friends and being in a group", value: "E" },
    ],
  },
  {
    questionText:
      "Question 2: When learning new concepts, what approach do you prefer?",
    options: [
      { label: "A. Using imagination and thinking openly", value: "N" },
      {
        label: "B. Relying on personal experience and needing clear guidance",
        value: "S",
      },
    ],
  },
  {
    questionText: "Question 3: When communicating, what do you focus on?",
    options: [
      { label: "A. Ensuring the matter is logical and fair", value: "T" },
      {
        label: "B. Prioritizing others feelings and seeking harmony",
        value: "F",
      },
    ],
  },
  {
    questionText:
      "Question 4: Before traveling abroad, what do you typically do?",
    options: [
      {
        label: "A. Create a detailed itinerary and stick to the plan",
        value: "J",
      },
      {
        label: "B. Decide the itinerary based on my mood on the day",
        value: "P",
      },
    ],
  },
  {
    questionText: "Question 5: In making decisions, do you rely more on?",
    options: [
      { label: "A. Logic and data", value: "T" },
      { label: "B. Personal values and feelings", value: "F" },
    ],
  },
  {
    questionText: "Question 6: When facing a problem, do you prefer to?",
    options: [
      { label: "A. Analyze the situation logically", value: "T" },
      { label: "B. Consider how others feel about it", value: "F" },
    ],
  },
  {
    questionText: "Question 7: In your free time, do you prefer?",
    options: [
      { label: "A. Going out with friends", value: "E" },
      { label: "B. Staying home and relaxing", value: "I" },
    ],
  },
  {
    questionText: "Question 8: When working on a project, do you like to?",
    options: [
      { label: "A. Plan everything in advance", value: "J" },
      { label: "B. See how things go and adapt", value: "P" },
    ],
  },
  {
    questionText: "Question 9: Do you prefer to learn by?",
    options: [
      { label: "A. Exploring theories and concepts", value: "N" },
      { label: "B. Focusing on practical applications", value: "S" },
    ],
  },
  {
    questionText: "Question 10: In a group discussion, do you tend to?",
    options: [
      { label: "A. Speak your mind immediately", value: "E" },
      { label: "B. Think about your response carefully", value: "I" },
    ],
  },
  {
    questionText: "Question 11: When faced with a challenge, do you?",
    options: [
      { label: "A. Approach it step by step", value: "J" },
      { label: "B. See how you feel and react", value: "P" },
    ],
  },
  {
    questionText: "Question 12: Do you prefer a routine or spontaneity?",
    options: [
      { label: "A. Having a set routine", value: "J" },
      { label: "B. Being spontaneous", value: "P" },
    ],
  },
  {
    questionText: "Question 13: Do you tend to be more",
    options: [
      { label: "A. Analytical and logical", value: "T" },
      { label: "B. Emotional and empathetic", value: "F" },
    ],
  },
  {
    questionText: "Question 14: In your social life, do you prefer to?",
    options: [
      { label: "A. Hang out with a few close friends", value: "I" },
      { label: "B. Meet new people and socialize", value: "E" },
    ],
  },
  {
    questionText: "Question 15: When making a choice, do you rely more on?",
    options: [
      { label: "A. Facts and data", value: "S" },
      { label: "B. Your intuition", value: "N" },
    ],
  },
  {
    questionText: "Question 16: In discussions, do you focus more on?",
    options: [
      { label: "A. The logical structure", value: "T" },
      { label: "B. The emotional impact", value: "F" },
    ],
  },
  {
    questionText: "Question 17: Do you feel more comfortable when?",
    options: [
      { label: "A. You have a clear plan", value: "J" },
      { label: "B. You can go with the flow", value: "P" },
    ],
  },
  {
    questionText:
      "Question 18: When trying to understand something new, do you prefer?",
    options: [
      { label: "A. Theoretical explanations", value: "N" },
      { label: "B. Practical demonstrations", value: "S" },
    ],
  },
  {
    questionText: "Question 19: Do you tend to be more?",
    options: [
      { label: "A. Reserved and thoughtful", value: "I" },
      { label: "B. Outgoing and expressive", value: "E" },
    ],
  },
  {
    questionText: "Question 20: When meeting someone new, do you usually?",
    options: [
      { label: "A. Wait for others to approach you", value: "I" },
      { label: "B. Take the initiative to introduce yourself", value: "E" },
    ],
  },
  {
    questionText: "Question 21: When making decisions, do you prefer to?",
    options: [
      { label: "A. Consider the logical outcomes", value: "T" },
      { label: "B. Think about how it affects everyone involved", value: "F" },
    ],
  },
  {
    questionText: "Question 22: In your work, do you prefer tasks that are?",
    options: [
      { label: "A. Structured and organized", value: "J" },
      { label: "B. Flexible and adaptable", value: "P" },
    ],
  },
  {
    questionText: "Question 23: Do you prefer to communicate your thoughts?",
    options: [
      { label: "A. Clearly and directly", value: "T" },
      { label: "B. Gently and considerately", value: "F" },
    ],
  },
  {
    questionText: "Question 24: Do you feel more fulfilled when?",
    options: [
      { label: "A. You achieve your goals", value: "J" },
      { label: "B. You experience new things", value: "P" },
    ],
  },
  {
    questionText: "Question 25: Do you prefer to spend your vacation?",
    options: [
      { label: "A. Following a planned itinerary", value: "J" },
      { label: "B. Exploring spontaneously", value: "P" },
    ],
  },
  {
    questionText: "Question 26: When solving problems, do you prefer?",
    options: [
      { label: "A. Following established methods", value: "S" },
      { label: "B. Trying out new ideas", value: "N" },
    ],
  },
  {
    questionText:
      "Question 27: When you think about the future, do you tend to focus on?",
    options: [
      { label: "A. Practical outcomes", value: "S" },
      { label: "B. Possibilities and potential", value: "N" },
    ],
  },
  {
    questionText: "Question 28: In discussions, do you usually?",
    options: [
      { label: "A. Stay quiet and listen", value: "I" },
      { label: "B. Jump in and share your thoughts", value: "E" },
    ],
  },
  {
    questionText: "Question 29: Do you find it easier to make decisions when?",
    options: [
      { label: "A. You have clear guidelines", value: "J" },
      { label: "B. You can weigh various options", value: "P" },
    ],
  },
  {
    questionText:
      "Question 30: When reflecting on your experiences, do you prefer to focus on?",
    options: [
      { label: "A. The facts and what happened", value: "S" },
      { label: "B. The feelings and meanings behind them", value: "N" },
    ],
  },
];

interface Results {
  I: number;
  E: number;
  N: number;
  S: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

const Q_FiveminsScreen = () => {
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    Array(questionsData.length).fill("")
  );
  const [results, setResults] = useState<Results>({
    I: 0,
    E: 0,
    N: 0,
    S: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  });

  const handleNext = async () => {
    if (selectedAnswers[currentQuestionIndex] === "") {
      alert("Please answer the question before proceeding.");
      return;
    }

    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const mbtiResult = calculateMBTI();
      console.log("MBTI Result:", mbtiResult);
      const user = auth.currentUser;
        if (user) {
            const uid = user.uid;
            try {
                await updateUserMBTI(uid, mbtiResult);
            } catch (error) {
                console.error("Error updating MBTI:", error);
            }
        }
      router.replace("/(root)/(tabs)");
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateMBTI = () => {
    const finalResult = [
      results.I > results.E ? "I" : "E",
      results.N > results.S ? "N" : "S",
      results.T > results.F ? "T" : "F",
      results.J > results.P ? "J" : "P",
    ].join("");

    return finalResult;
  };

  const handleSelectAnswer = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);

    // Update the results based on the answer
    updateResults(answer);
  };

  const updateResults = (answer: string) => {
    const newResults: Results = { ...results };

    switch (answer) {
      case "I":
        newResults.I += 1;
        break;
      case "E":
        newResults.E += 1;
        break;
      case "N":
        newResults.N += 1;
        break;
      case "S":
        newResults.S += 1;
        break;
      case "T":
        newResults.T += 1;
        break;
      case "F":
        newResults.F += 1;
        break;
      case "J":
        newResults.J += 1;
        break;
      case "P":
        newResults.P += 1;
        break;
      default:
        break;
    }

    setResults(newResults);
  };

  const Question: React.FC<QuestionProps> = ({
    questionText,
    options,
    selectedAnswer,
    setSelectedAnswer,
  }) => {
    return (
      <View>
        <Text style={{ fontWeight: "bold" }}>{questionText}</Text>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setSelectedAnswer(option.value)}
          >
            <Text
              style={{
                margin: 14,
                color: selectedAnswer === option.value ? "red" : "black",
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const progress = ((currentQuestionIndex + 1) / questionsData.length) * 100;

  return (
    <Styledcontainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <WelcomeContainer>
          <PageTitle onemin={true}>MBTI Questionnaire</PageTitle>
          <SubTitle question={true}>
            If both options are true, please choose the one you prefer more.
          </SubTitle>
          <Line />

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Question
            questionText={questionsData[currentQuestionIndex].questionText}
            options={questionsData[currentQuestionIndex].options}
            selectedAnswer={selectedAnswers[currentQuestionIndex]}
            setSelectedAnswer={handleSelectAnswer}
          />

          <StyledFromArea>
            <StyledButton onPress={handleNext}>
              <ButtonText>
                {currentQuestionIndex < questionsData.length - 1
                  ? "Next"
                  : "Finish"}
              </ButtonText>
            </StyledButton>
            {currentQuestionIndex > 0 && (
              <StyledButton onPress={handleBack}>
                <ButtonText>Back</ButtonText>
              </StyledButton>
            )}
          </StyledFromArea>
          <ExtraView>
            <ExtraText> Want to choose a new one? </ExtraText>
            <TextLink onPress={() => router.replace("/Question")}>
              <TextLinkContent>Back to Question</TextLinkContent>
            </TextLink>
          </ExtraView>
        </WelcomeContainer>
      </InnerContainer>
    </Styledcontainer>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 15,
    width: "100%",
    backgroundColor: "#e0e0df",
    borderRadius: 5,
    marginVertical: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b5998",
    borderRadius: 5,
  },
});

export default Q_FiveminsScreen;
