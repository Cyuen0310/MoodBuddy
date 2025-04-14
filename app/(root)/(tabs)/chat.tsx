import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import icons from "@/constants/icons";
import { router } from "expo-router";

const ipAddress = process.env.EXPO_PUBLIC_IP_ADDRESS;
const wsUrl = `ws://${ipAddress}:5051`;

console.log("WebSocket URL:", wsUrl);

interface Message {
  text: string;
  user: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello!", user: true },
    { text: "Hi, I am MoodBuddy. How can I help you today?", user: false },
  ]);
  const [userInput, setUserInput] = useState<string>("");
  const flatListRef = useRef<FlatList<Message>>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => console.log("Connected to WebSocket server");
    ws.current.onmessage = (event) => {
      try {
        // First try to parse as JSON
        const data = JSON.parse(event.data);
        const botMessage = {
          text: data.response || data.text || data,
          user: false,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        // If parsing fails, use the raw message
        const botMessage = { text: event.data, user: false };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    };
    ws.current.onerror = (error) => console.error("WebSocket error:", error);
    ws.current.onclose = () => console.log("WebSocket disconnected");

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (userInput.trim() && ws.current) {
      const userMessage = { text: userInput, user: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      // Send the raw message text rather than a JSON object
      ws.current.send(userInput);
      setUserInput("");
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 p-5"
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          className="flex-1 mb-2.5"
          renderItem={({ item }) => (
            <View
              className={`p-2.5 my-1 rounded-lg ${
                item.user ? "self-end bg-blue-100" : "self-start bg-gray-100"
              }`}
            >
              <Text className={item.user ? "text-blue-500" : "text-black"}>
                {item.text}
              </Text>
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
        />

        <View className="flex-row items-center mb-[60px]">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg mr-2.5 p-2.5"
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type your message..."
          />
          <TouchableOpacity
            onPress={sendMessage}
            className="px-4 py-2 rounded-lg"
          >
            <Image source={icons.send} className="size-6" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/voicechat")}
            className="px-4 py-2 rounded-lg"
          >
            <Image source={icons.waveform} className="size-6" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
