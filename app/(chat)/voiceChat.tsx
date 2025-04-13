import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import Voice from "@react-native-voice/voice";

const ipAddress = process.env.EXPO_PUBLIC_IP_ADDRESS;
const socket = new WebSocket(`ws://localhost:5051`);

const VoiceChat = () => {
  const [finalText, setFinalText] = useState("");
  const [listening, setListening] = useState(false);
  const [partialText, setPartialText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [serverResponse, setServerResponse] = useState<string | null>(null);

  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    socket.onopen = () => {
      console.log("[Socket] Connected");
      sendInit();
    };

    socket.onclose = () => {
      console.log("[Socket] Disconnected");
    };

    socket.onerror = (error) => {
      console.error("[Socket] Error:", error);
      setError("Connection error. Please check if the server is running.");
    };

    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        console.log("[Socket] Received:", response);

        if (response.type === "response") {
          setServerResponse(response.data);
        } else if (response.type === "error") {
          setError(response.message);
        }
      } catch (e) {
        console.error("[Socket] Parse error:", e);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendInit = () => {
    const setupConfig = {
      setup: { generation_config: { response_modelities: ["audio"] } },
    };
    try {
      socket.send(JSON.stringify(setupConfig));
      console.log("[Socket] Sent setup config");
    } catch (err) {
      console.error("[Socket] Send error:", err);
      setError("Failed to initialize connection");
    }
  };

  useEffect(() => {
    const initVoice = async () => {
      try {
        // Check if voice is available
        const isAvailable = await Voice.isAvailable();
        if (!isAvailable) {
          console.error("Voice recognition is not available");
          setError("Voice recognition is not available on this device");
          return;
        }

        // Initialize voice recognition
        await Voice.start("en-US");
        console.log("[Voice] Initialized");
      } catch (e) {
        console.error("[Voice] Init error:", e);
        setError(`Voice initialization error: ${e}`);
        Alert.alert(
          "Voice Error",
          "Failed to initialize voice recognition. Please try again."
        );
      }
    };

    Voice.onSpeechStart = () => {
      console.log("[Voice] Started");
      setListening(true);
      setError(null);
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

      // Send to server
      if (final && socket.readyState === WebSocket.OPEN) {
        try {
          sendInit();
          socket.send(JSON.stringify({ text: final }));
        } catch (err) {
          console.error("[Socket] Send error:", err);
          setError(`Failed to send message: ${err}`);
        }
      }
    };

    Voice.onSpeechEnd = () => {
      console.log("[Voice] Ended");
      setListening(false);

      if (Platform.OS === "ios") {
        // Add a delay before restarting
        setTimeout(() => {
          startListening();
        }, 1000);
      }
    };

    Voice.onSpeechError = (e) => {
      console.warn("[Voice] Error:", e.error);
      setError(`Speech recognition error: ${JSON.stringify(e.error)}`);
      setListening(false);

      // Attempt to restart after error
      setTimeout(() => {
        startListening();
      }, 2000);
    };

    initVoice();

    return () => {
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setError(null);
      await Voice.start("en-US");
    } catch (e) {
      console.error("[Voice] Start error:", e);
      setError(`Failed to start voice recognition: ${e}`);
      Alert.alert(
        "Voice Error",
        "Failed to start voice recognition. Please try again."
      );
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
          {serverResponse && (
            <Text className="text-base mb-2">
              Response: <Text className="text-blue-600">{serverResponse}</Text>
            </Text>
          )}
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
