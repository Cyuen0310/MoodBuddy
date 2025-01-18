import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Button } from "react-native";

interface Message {
  text: string;
  user: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello!", user: true },
    { text: "Hi there!", user: false },
  ]);
  const [userInput, setUserInput] = useState<string>("");
  const flatListRef = useRef<FlatList<Message>>(null); // Create a ref for FlatList

  const sendMessage = () => {
    if (userInput.trim()) {
      const userMessage = { text: userInput, user: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput(""); // Clear input after sending
    }
  };

  // Effect to scroll to the bottom when messages change
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef} // Assign the ref to FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.user ? styles.userMessage : styles.otherMessage]}>
            <Text style={{ color: item.user ? 'blue' : 'black' }}>
              {item.text}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  messageList: {
    flex: 1, // Allow FlatList to take available space
    marginBottom: 10, // Add space below the FlatList
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  userMessage: {
    alignSelf: 'flex-end', // Align user messages to the right
    backgroundColor: '#e1f5fe', // Light blue background for user messages
  },
  otherMessage: {
    alignSelf: 'flex-start', // Align other messages to the left
    backgroundColor: '#f0f0f0', // Light gray background for others
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60, // Adjust this value to position higher
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
    padding: 10, // Added padding for better appearance
  },
});

export default Chat;
