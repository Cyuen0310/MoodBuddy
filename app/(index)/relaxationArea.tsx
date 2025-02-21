import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import icons from '@/constants/icons';

const games = ['RockPaperScissors', 'TicTacToe', 'ConnectFour']; // Add more games as needed

const RelaxationArea: React.FC = () => {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string>('RockPaperScissors');
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');

  const choices = ['Rock', 'Paper', 'Scissors'] as const;

  const playGame = (userSelection: string) => {
    const computerSelection = choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(userSelection);
    setComputerChoice(computerSelection);
    determineWinner(userSelection, computerSelection);
  };

  const determineWinner = (user: string, computer: string) => {
    if (user === computer) {
      setResult("It's a tie!");
    } else if (
      (user === 'Rock' && computer === 'Scissors') ||
      (user === 'Paper' && computer === 'Rock') ||
      (user === 'Scissors' && computer === 'Paper')
    ) {
      setResult('You win!');
    } else {
      setResult('You lose!');
    }
  };

  const handleGoBack = () => {
    router.push('/'); // Navigate back to the home page
  };

  const handleGameSelection = (game: string) => {
    setSelectedGame(game);
    // Reset choices and results when changing games
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Image source={icons.backArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relaxation Area</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.gameSelector}>
        {games.map((game) => (
          <Button
            key={game}
            title={game}
            onPress={() => handleGameSelection(game)}
            color={selectedGame === game ? 'blue' : 'gray'} // Highlight selected game
          />
        ))}
      </View>

      {selectedGame === 'RockPaperScissors' && (
        <View>
          <View style={styles.choices}>
            {choices.map((choice) => (
              <Button key={choice} title={choice} onPress={() => playGame(choice)} />
            ))}
          </View>
          {userChoice && computerChoice && (
            <Text style={styles.result}>
              You chose: {userChoice} {'\n'} Computer chose: {computerChoice} {'\n'} {result}
            </Text>
          )}
        </View>
      )}

      {selectedGame !== 'RockPaperScissors' && (
        <Text style={styles.placeholder}>
          {selectedGame} is not implemented yet. Please select RockPaperScissors to play.
        </Text>
      )}
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
  gameSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  choices: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  placeholder: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
  },
});

export default RelaxationArea;