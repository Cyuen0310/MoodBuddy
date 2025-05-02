import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";

const games = ["RockPaperScissors", "TicTacToe", "NumberGuessing"];

const RelaxationArea: React.FC = () => {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string>("RockPaperScissors");
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");

  const choices = ["Rock", "Paper", "Scissors"] as const;

  // Tic Tac Toe State
  const [ticTacToeBoard, setTicTacToeBoard] = useState<string[]>(
    Array(9).fill(null)
  );
  const [ticTacToeXIsNext, setTicTacToeXIsNext] = useState<boolean>(true);
  const [ticTacToeWinner, setTicTacToeWinner] = useState<string | null>(null);

  // Number Guessing Game State
  const [numberToGuess, setNumberToGuess] = useState<number | null>(null);
  const [userGuess, setUserGuess] = useState<string>("");
  const [guessResult, setGuessResult] = useState<string>("");

  const playGame = (userSelection: string) => {
    const computerSelection =
      choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(userSelection);
    setComputerChoice(computerSelection);
    determineWinner(userSelection, computerSelection);
  };

  const determineWinner = (user: string, computer: string) => {
    if (user === computer) {
      setResult("It's a tie!");
    } else if (
      (user === "Rock" && computer === "Scissors") ||
      (user === "Paper" && computer === "Rock") ||
      (user === "Scissors" && computer === "Paper")
    ) {
      setResult("You win!");
    } else {
      setResult("You lose!");
    }
  };

  const handleGoBack = () => {
    router.push("/"); 
  };

  const handleGameSelection = (game: string) => {
    setSelectedGame(game);
    setUserChoice(null);
    setComputerChoice(null);
    setResult("");
    resetTicTacToe();
    resetNumberGuessing();
  };

  const resetTicTacToe = () => {
    setTicTacToeBoard(Array(9).fill(null));
    setTicTacToeXIsNext(true);
    setTicTacToeWinner(null);
  };

  const handleTicTacToeClick = (index: number) => {
    if (ticTacToeBoard[index] || ticTacToeWinner) return;

    const newBoard = [...ticTacToeBoard];
    newBoard[index] = ticTacToeXIsNext ? "X" : "O";
    setTicTacToeBoard(newBoard);
    setTicTacToeXIsNext(!ticTacToeXIsNext);
    checkTicTacToeWinner(newBoard);
  };

  const checkTicTacToeWinner = (board: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setTicTacToeWinner(board[a]);
        return;
      }
    }
  };

  // Number Guessing Game Functions
  const resetNumberGuessing = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
    setNumberToGuess(randomNum);
    setUserGuess("");
    setGuessResult("");
  };

  const handleGuess = () => {
    const guess = parseInt(userGuess);
    if (isNaN(guess)) {
      setGuessResult("Please enter a valid number.");
      return;
    }
    if (guess < numberToGuess!) {
      setGuessResult("Too low! Try again.");
    } else if (guess > numberToGuess!) {
      setGuessResult("Too high! Try again.");
    } else {
      setGuessResult("Congratulations! You guessed it!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Image source={icons.backArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relaxation Area</Text>
        <View style={styles.backButton} />
      </View>

      <Image source={icons.room} style={styles.relaxationImage} />

      <View style={styles.gameSelector}>
        {games.map((game) => (
          <Button
            key={game}
            title={game}
            onPress={() => handleGameSelection(game)}
            color={selectedGame === game ? "blue" : "gray"}
          />
        ))}
      </View>

      {selectedGame === "RockPaperScissors" && (
        <View>
          <View style={styles.choices}>
            {choices.map((choice) => (
              <Button
                key={choice}
                title={choice}
                onPress={() => playGame(choice)}
              />
            ))}
          </View>
          {userChoice && computerChoice && (
            <Text style={styles.result}>
              You chose: {userChoice} {"\n"} Computer chose: {computerChoice}{" "}
              {"\n"} {result}
            </Text>
          )}
        </View>
      )}

      {selectedGame === "TicTacToe" && (
        <View>
          <View style={styles.ticTacToeBoard}>
            {ticTacToeBoard.map((value, index) => (
              <TouchableOpacity
                key={index}
                style={styles.ticTacToeCell}
                onPress={() => handleTicTacToeClick(index)}
              >
                <Text style={styles.ticTacToeText}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {ticTacToeWinner && (
            <Text style={styles.result}>Winner: {ticTacToeWinner}</Text>
          )}
          <Button title="Reset Tic Tac Toe" onPress={resetTicTacToe} />
        </View>
      )}

      {selectedGame === "NumberGuessing" && (
        <View>
          <Text style={styles.instruction}>
            Guess a number between 1 and 100:
          </Text>
          <TextInput
            style={styles.input}
            value={userGuess}
            onChangeText={setUserGuess}
            keyboardType="numeric"
            placeholder="Enter your guess"
          />
          <Button title="Submit Guess" onPress={handleGuess} />
          {guessResult && <Text style={styles.result}>{guessResult}</Text>}
          <Button title="Reset Number Guessing" onPress={resetNumberGuessing} />
        </View>
      )}

      {selectedGame !== "RockPaperScissors" &&
        selectedGame !== "TicTacToe" &&
        selectedGame !== "NumberGuessing" && (
          <Text style={styles.placeholder}>
            {selectedGame} is not implemented yet. Please select
            RockPaperScissors to play.
          </Text>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f4f8",
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
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  relaxationImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
  },
  gameSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  choices: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  placeholder: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
    color: "gray",
  },
  // Tic Tac Toe Styles
  ticTacToeBoard: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "60%",
    alignSelf: "center",
  },
  ticTacToeCell: {
    width: "33.33%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  ticTacToeText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  // Number Guessing Styles
  instruction: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    textAlign: "center",
  },
});

export default RelaxationArea;
