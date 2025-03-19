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
import axios from "axios";
import icons from "@/constants/icons";
import { Redirect, router } from "expo-router";

interface Message {
  text: string;
  user: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello!", user: true },
    { text: "Hi I am MoodBuddy, how can i help you today?", user: false },
  ]);
  const [userInput, setUserInput] = useState<string>("");
  const flatListRef = useRef<FlatList<Message>>(null);

  const sendMessage = async () => {
    if (userInput.trim()) {
      const userMessage = { text: userInput, user: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput("");

      try {
        const response = await axios.post("http://172.18.88.11:5001/chat", {
          message: userInput,
        });
        const botMessage = { text: response.data.response, user: false };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
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
            onPress={() => router.push("/voiceChat")}
            className=" px-4 py-2 rounded-lg"
          >
            <Image source={icons.waveform} className="size-6" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
