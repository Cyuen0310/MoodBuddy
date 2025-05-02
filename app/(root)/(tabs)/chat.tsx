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
import AsyncStorage from '@react-native-async-storage/async-storage';

const ipAddress = process.env.EXPO_PUBLIC_IP_ADDRESS;
const wsUrl = `ws://${ipAddress}:5051`;

console.log("WebSocket URL:", wsUrl);

interface Message {
  text: string;
  user: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi, I am MoodBuddy. How can I help you today?", user: false },
  ]);
  const [userInput, setUserInput] = useState<string>("");
  const flatListRef = useRef<FlatList<Message>>(null);
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        let userId = null;
        
        if (userJson) {
          const user = JSON.parse(userJson);
          userId = user.uid;
          console.log('User ID for WebSocket:', userId);
        }
        

        if (ws.current) {
          ws.current.close();
        }
        
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
          
          const setupMessage = {
            setup: {
              config: {
                response_modalities: ["TEXT"],
              },
            },
            userId: userId  
          };
          console.log('Sending setup message:', setupMessage);
          ws.current?.send(JSON.stringify(setupMessage));
        };
        
        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const botMessage = {
              text: data.response || data.text || data,
              user: false,
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
          } catch (error) {
            const botMessage = { text: event.data, user: false };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
          }
        };
        
        ws.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
        };
        
        ws.current.onclose = () => {
          console.log("WebSocket disconnected");
          setIsConnected(false);
        };
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
        setIsConnected(false);
      }
    };
    
    setupWebSocket();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (userInput.trim() && ws.current && isConnected) {
      const userMessage = { text: userInput, user: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        ws.current.send(JSON.stringify({ type: "text", data: userInput }));
        setUserInput("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else if (!isConnected) {
      console.log("Cannot send message: WebSocket not connected");
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
            className="flex-1 border border-gray-300 rounded-lg mr-2.5 p-2.5 text-black font-nunito-extra-bold"
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
