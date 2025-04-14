import React, { useState, useRef, useEffect } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const VoiceChat = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
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

  // send setup config to gemini when the connection is established
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
    const base64 = await FileSystem.readAsStringAsync(chunks, {
      encoding: FileSystem.EncodingType.Base64,
    });
    ws.current?.send(
      JSON.stringify({
        type: "audio",
        data: base64,
      })
    );
  };

  const startRecording = async () => {
    try {
      const audio_permission = await Audio.requestPermissionsAsync();
      if (audio_permission.status !== "granted") {
        alert("Permission to access microphone is required!");
        return;
      }

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

      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);
      setRecordedUri(uri);
      setRecording(null);
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
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
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {recordedUri && (
        <>
          <Text style={styles.uriText}>Recorded file: {recordedUri}</Text>
          <Button title="Play Recording" onPress={playRecording} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: "center",
    flex: 1,
  },
  uriText: {
    marginVertical: 10,
    fontSize: 14,
  },
});

export default VoiceChat;
