import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VoiceChat = () => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState(
    "Tap the microphone to start speaking"
  );
  const recordingRef = useRef(false);
  const playingRef = useRef(false);
  const ipAddress = process.env.EXPO_PUBLIC_IP_ADDRESS;
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const setupWebSocket = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      let userId = null;

      if (userJson) {
        const user = JSON.parse(userJson);
        userId = user.uid;
        console.log("User ID for WebSocket:", userId);
      }

      if (ws.current) {
        ws.current.close();
      }

      ws.current = new WebSocket(`ws://${ipAddress}:5051`);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);

        const setupMessage = {
          setup: {
            config: {
              response_modalities: ["AUDIO"],
              audio_config: {
                audio_encoding: "LINEAR16",
                sample_rate_hertz: 16000,
              },
            },
          },
          userId: userId, 
        };
        console.log("Sending setup message:", setupMessage);
        ws.current?.send(JSON.stringify(setupMessage));
      };

      ws.current.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        if (message.audio_wav && !playingRef.current) {
          playingRef.current = true;
          recordingRef.current = false;
          const uri = FileSystem.documentDirectory + `gemini_response.wav`;
          await FileSystem.writeAsStringAsync(uri, message.audio_wav, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Configure audio to play through speaker
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
          });

          const { sound } = await Audio.Sound.createAsync({ uri });

          sound.setOnPlaybackStatusUpdate(async (status) => {
            if ("didJustFinish" in status && status.didJustFinish) {
              playingRef.current = false;
              sound.unloadAsync();
              console.log("stop playing...");

              await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
              });

              if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                console.log("Playback finished. Restarting recording...");
                recordingRef.current = true;
                setIsRecording(true);
                setStatusText("Listening...");
                record();
              } else {
                console.error(
                  "WebSocket not connected, cannot restart recording"
                );
                setIsConnected(false);

                setupWebSocket();
              }
            }
          });

          await sound.playAsync();
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

  useEffect(() => {
    setupWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendAudioChunks = async (uri: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not connected, attempting to reconnect...");
      await setupWebSocket();
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        console.error("Failed to reconnect WebSocket");
        return;
      }
    }

    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      ws.current.send(
        JSON.stringify({
          type: "audio",
          data: base64,
        })
      );
      console.log("Audio chunk sent successfully");
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  const record = async () => {
    const options: Audio.RecordingOptions = {
      android: {
        extension: ".wav",
        outputFormat: Audio.AndroidOutputFormat.DEFAULT,
        audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 256000,
      },
      ios: {
        extension: ".wav",
        audioQuality: Audio.IOSAudioQuality.HIGH,
        outputFormat: Audio.IOSOutputFormat.LINEARPCM,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {
        mimeType: "audio/wav",
      },
    };

    recordingRef.current = true;

    while (recordingRef.current) {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(options);
      await recording.startAsync();
      await new Promise((res) => setTimeout(res, 500));
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      if (uri) await sendAudioChunks(uri);
    }
  };

  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== "granted") return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    setIsRecording(true);
    setStatusText("Listening...");

    if (!recordingRef.current) {
      recordingRef.current = true;
      record();
    }
  };

  const stopRecording = () => {
    recordingRef.current = false;
    setIsRecording(false);
    setStatusText("Tap the microphone to start speaking");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-16 left-6 z-10 w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
      >
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center px-6">
        {/* Central Mic Button */}
        <View className="items-center">
          <View
            className={`w-64 h-64 rounded-full items-center justify-center ${
              isRecording ? "bg-red-50" : "bg-gray-50"
            } border ${isRecording ? "border-red-200" : "border-gray-200"}`}
          >
            <View
              className={`w-48 h-48 rounded-full items-center justify-center ${
                isRecording ? "bg-red-100" : "bg-gray-100"
              }`}
            >
              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                className={`w-32 h-32 rounded-full items-center justify-center ${
                  isRecording ? "bg-red-500" : "bg-green-900"
                } shadow-md`}
              >
                <Ionicons
                  name={isRecording ? "stop" : "mic"}
                  size={48}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-gray-600 text-lg mt-8 text-center">
            {statusText}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VoiceChat;
