import React, { useState, useRef, useEffect } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const VoiceChat = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [statusText, setStatusText] = useState("Idle");
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const recordingRef = useRef(false);
  const [microphoneOn, setMicrophoneOn] = useState<boolean>(true);
  const sound = useRef<Audio.Sound | null>(null);
  const ipAddress = process.env.EXPO_PUBLIC_IP_ADDRESS;
  const ws = useRef<WebSocket | null>(null);
  const wsUrl = `ws://${ipAddress}:5051`;

  const setupConfig = {
    setup: {
      config: {
        response_modalities: ["AUDIO"],
        audio_config: {
          audio_encoding: "LINEAR16",
          sample_rate_hertz: 16000,
        },
      },
    },
  };

  useEffect(() => {
    ws.current = new WebSocket(wsUrl);
    ws.current.onopen = () => {
      try {
        ws.current?.send(JSON.stringify(setupConfig));
        console.log("Setup config sent");
      } catch (error) {
        console.error("Failed to send setup config:", error);
      }
    };
  }, []);

  const sendAudioChunks = async (chunks: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(chunks, {
        encoding: FileSystem.EncodingType.Base64,
      });
      ws.current?.send(
        JSON.stringify({
          type: "audio",
          data: base64,
        })
      );
      console.log("Audio chunk sent");
    } catch (error) {
      console.error("Failed to send audio chunk:", error);
    }
  };

  const record = async () => {
    const recordingOptions: Audio.RecordingOptions = {
      android: {
        extension: ".m4a",
        outputFormat: Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder: Audio.AndroidAudioEncoder.AAC,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
      },
      ios: {
        extension: ".wav",
        audioQuality: Audio.IOSAudioQuality.HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {
        mimeType: "audio/webm",
        bitsPerSecond: 128000,
      },
    };

    recordingRef.current = true;

    while (recordingRef.current) {
      let recording: Audio.Recording | null = null;

      try {
        recording = new Audio.Recording();
        await recording.prepareToRecordAsync(recordingOptions);
        await recording.startAsync();
        console.log("Recording...");

        await new Promise((res) => setTimeout(res, 3000));

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (uri) {
          await sendAudioChunks(uri);
        }
      } catch (error) {
        console.error("Failed to record audio:", error);
        break;
      } finally {
        if (recording) {
          await recording.stopAndUnloadAsync().catch(() => {});
        }
      }
    }
  };

  const startRecording = async () => {
    try {
      const audio_permission = await Audio.requestPermissionsAsync();
      if (audio_permission.status !== "granted") {
        alert("Permission to access microphone is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setMicrophoneOn(true);
      setIsRecording(true);
      record();

      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    recordingRef.current = false;
    setMicrophoneOn(false);
    setIsRecording(false);
    console.log("Recording stopped");
  };

  const playRecording = async () => {
    try {
      if (!recordedUri) return;

      const { sound: playbackObject } = await Audio.Sound.createAsync(
        { uri: recordedUri },
        { shouldPlay: true }
      );
      sound.current = playbackObject;
    } catch (error) {
      console.error("Playback error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
      />
      <Text style={styles.status}>{statusText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
  status: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
});

export default VoiceChat;
