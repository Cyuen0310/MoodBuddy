import React, { useState, useRef, useEffect } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const VoiceChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState("Idle");
  const recordingRef = useRef(false);
  const playingRef = useRef(false);
  const ipAddress = process.env.EXPO_PUBLIC_IP_ADDRESS;
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://${ipAddress}:5051`);
    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          setup: {
            config: {
              response_modalities: ["AUDIO"],
              audio_config: {
                audio_encoding: "LINEAR16",
                sample_rate_hertz: 16000,
              },
            },
          },
        })
      );
    };

    ws.current.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.audio_wav && !playingRef.current) {
        const uri = FileSystem.documentDirectory + `gemini_response.wav`;
        await FileSystem.writeAsStringAsync(uri, message.audio_wav, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const { sound } = await Audio.Sound.createAsync({ uri });

        sound.setOnPlaybackStatusUpdate((status) => {
          if ("didJustFinish" in status && status.didJustFinish) {
            playingRef.current = false;
            sound.unloadAsync();
          }
        });

        await sound.playAsync();
      }
    };
  }, []);

  const sendAudioChunks = async (uri: string) => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    ws.current?.send(
      JSON.stringify({
        type: "audio",
        data: base64,
      })
    );
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
    record();
  };

  const stopRecording = () => {
    recordingRef.current = false;
    setIsRecording(false);
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
