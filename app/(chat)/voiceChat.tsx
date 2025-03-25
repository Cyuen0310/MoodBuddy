import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import Voice from "@react-native-voice/voice";

const ipAddress = process.env.EXPO_PUBLIC_IP_ADDRESS;
const socket = new WebSocket(`ws://${ipAddress}:5001`);

const VoiceChat = () => {
  const [finalText, setFinalText] = useState("");
  const [listening, setListening] = useState(false);
  const [partialText, setPartialText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Voice.onSpeechStart = () => {
      console.log("[Voice] Started");
      setListening(true);
    };

    Voice.onSpeechPartialResults = (voiceInput) => {
      const partial = voiceInput.value?.[0] ?? "";
      console.log("[Voice] Partial:", partial);
      setPartialText(partial);

      // Reset silence timer
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }

      // Start new silence timer (2s)
      silenceTimer.current = setTimeout(() => {
        console.log("🤫 Silence detected. Stopping...");
        Voice.stop(); // Will trigger onSpeechEnd
      }, 2000);
    };

    Voice.onSpeechResults = (e) => {
      const final = e.value?.[0] ?? "";
      console.log("[Voice] Final:", final);
      setFinalText(final);
      setPartialText("");

      // Optionally send to server
      if (final && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "text", data: { text: final } }));
      }
    };

    Voice.onSpeechEnd = () => {
      console.log("[Voice] Ended");
      setListening(false);

      if (Platform.OS === "ios") {
        setTimeout(() => {
          startListening();
        }, 500);
      }
    };

    Voice.onSpeechError = (e) => {
      console.warn("[Voice] Error:", e.error);
      setError(JSON.stringify(e.error));
      setListening(false);

      setTimeout(() => {
        startListening();
      }, 1000);
    };

    startListening();

    return () => {
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error("[Voice] Start error:", e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-center mb-4">
          🎤 Auto Voice Recognition
        </Text>

        <View className="bg-gray-100 rounded-lg p-4 mb-4">
          <Text className="text-lg mb-2">
            Status:{" "}
            <Text className={listening ? "text-green-500" : "text-gray-500"}>
              {listening ? "✅ Listening" : "⏸️ Paused"}
            </Text>
          </Text>
          <Text className="text-base mb-2">
            Partial:{" "}
            <Text className="text-gray-600 italic">{partialText || "..."}</Text>
          </Text>
          <Text className="text-base mb-2">
            Final:{" "}
            <Text className="text-gray-800 font-medium">
              {finalText || "---"}
            </Text>
          </Text>
          {error && (
            <Text className="text-red-500 text-sm mt-2">Error: {error}</Text>
          )}
        </View>

        <ScrollView className="flex-1">
          {(partialText || finalText) && (
            <View className="bg-blue-50 rounded-lg p-4 mb-2">
              <Text className="text-lg">
                📝 You said:{" "}
                <Text className="text-blue-800 font-medium">
                  "{partialText || finalText}"
                </Text>
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default VoiceChat;
