import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
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
} from '../components/style';

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

const questionsData = [
    {
        questionText: "Question 1: In which situation do you feel more energized?",
        options: [
            { label: 'A. Spending time alone, watching TV shows, or playing video games', value: 'I' },
            { label: 'B. Socializing with friends and being in a group', value: 'E' },
        ],
    },
    {
        questionText: "Question 2: When learning new concepts, what approach do you prefer?",
        options: [
            { label: 'A: Using imagination and thinking openly', value: 'N' },
            { label: 'B: Relying on personal experience and needing clear guidance', value: 'S' },
        ],
    },
    {
        questionText: "Question 3: When communicating, what do you focus on?",
        options: [
            { label: 'A: Ensuring the matter is logical and fair', value: 'T' },
            { label: 'B: Prioritizing others feelings and seeking harmony', value: 'F' },
        ],
    },
    {
        questionText: "Question 4: Before traveling abroad, what do you typically do?",
        options: [
            { label: 'A: Create a detailed itinerary and stick to the plan', value: 'J' },
            { label: 'B: Decide the itinerary based on my mood on the day', value: 'P' },
        ],
    },
];

const Q_OneminScreen = () => {
    const router = useRouter();
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(questionsData.length).fill(''));

    const handleNext = () => {
        if (selectedAnswers[currentQuestionIndex] === '') {
            alert('Please answer the question before proceeding.');
            return;
        }

        if (currentQuestionIndex < questionsData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            const answersString = JSON.stringify(selectedAnswers);
            console.log('MBTI:', answersString);
            router.replace(`/Main?answers=${encodeURIComponent(answersString)}`);
        }
    };

    const handleSelectAnswer = (answer: string) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setSelectedAnswers(newAnswers);
    };

    const Question: React.FC<QuestionProps> = ({ questionText, options, selectedAnswer, setSelectedAnswer }) => {
        return (
            <View>
                <Text style={{ fontWeight: 'bold' }}>{questionText}</Text>
                {options.map((option) => (
                    <TouchableOpacity key={option.value} onPress={() => setSelectedAnswer(option.value)}>
                        <Text style={{ margin: 14, color: selectedAnswer === option.value ? 'red' : 'black' }}>
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
                    <SubTitle question={true}>If both options are true, please choose the one you prefer more.</SubTitle>
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
                            <ButtonText>{currentQuestionIndex < questionsData.length - 1 ? 'Next' : 'Finish'}</ButtonText>
                        </StyledButton>
                    </StyledFromArea>
                </WelcomeContainer>
            </InnerContainer>
        </Styledcontainer>
    );
};

const styles = StyleSheet.create({
    progressBarContainer: {
        height: 15,
        width: '100%',
        backgroundColor: '#e0e0df',
        borderRadius: 5,
        marginVertical: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#3b5998',
        borderRadius: 5,
    },
});

export default Q_OneminScreen;