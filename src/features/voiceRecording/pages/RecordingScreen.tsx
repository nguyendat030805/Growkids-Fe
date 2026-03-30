import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Audio } from "expo-av";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";

import { ResultCard } from "../components/ResultCard";
import { useRecording } from "../hooks/useRecording";
import { recordingService } from "../services/RecordingService";
import { AIResultData, SuggestionItem } from "../types/RecordingType";

export default function RecordingScreen() {
  const { isRecording, startRecording, stopRecording } = useRecording();
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<AIResultData | null>(null);

  const playSound = async (base64String?: string) => {
    if (!base64String) return;
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mp3;base64,${base64String}` },
        { shouldPlay: true },
      );

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleSTTProcess = async () => {
    if (isRecording) {
      const uri = await stopRecording();
      if (!uri) return;
      setLoading(true);
      try {
        const response = await recordingService.transcribeAudio(uri);
        if (response && response.success && response.data) {
          setAiData(response.data);
          if (response.data.audioBase64) {
            await playSound(response.data.audioBase64);
          }
        }
      } catch (e) {
        if (axios.isAxiosError(e)) {
          if (e.response?.status === 401) {
            Alert.alert("Session expired", "Please log in again.");
          } else {
            Alert.alert("Connection error", "Please check the server!");
          }
        } else {
          console.error("Unknown error:", e);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setAiData(null);
      await startRecording();
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-100"
      contentContainerStyle={{ padding: 20, paddingTop: 16 }}
    >
      <View className="items-center mb-5">
        <View className="w-full justify-center items-center">
          <Text className="text-3xl font-extrabold text-slate-800">
            Speak & Learn
          </Text>

          <Image
            source={require("../../../../assets/LogoConversation.png")}
            className="w-14 h-14 rounded-full absolute right-0"
            resizeMode="contain"
          />
        </View>
      </View>

      <Text className="text-center text-slate-500 font-medium mb-6">
        Speak Vietnamese and practice English together
      </Text>

      <View className="bg-white p-8 rounded-[30px] items-center mb-6 shadow-sm border border-slate-50">
        <Text className="text-2xl font-bold text-slate-700 mb-6">
          Voice Recording
        </Text>
        <TouchableOpacity
          className={`w-24 h-24 rounded-full justify-center items-center shadow-lg ${isRecording ? "bg-red-500 shadow-red-200" : "bg-amber-400 shadow-amber-200"}`}
          onPress={handleSTTProcess}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={44}
            color="white"
          />
        </TouchableOpacity>
        <Text className="mt-5 text-slate-400 text-center text-sm leading-5 px-4">
          {isRecording ? "Listening..." : "Tap the button to start!"}
        </Text>
      </View>

      {loading && (
        <View className="my-6 items-center">
          <ActivityIndicator size="large" color="#FFB800" />
          <Text className="mt-3 text-amber-500 font-bold">
            AI is preparing your lesson...
          </Text>
        </View>
      )}

      {aiData && (
        <View className="mb-10">
          <ResultCard label="You said:" content={aiData.input_text} />

          <ResultCard
            label="In English:"
            content={aiData.english}
            sub={aiData.phonetic}
            isAI
            onPressSpeak={() => playSound(aiData.audioBase64)}
          />

          {aiData.suggestions &&
            Array.isArray(aiData.suggestions) &&
            aiData.suggestions.length > 0 && (
              <View className="mt-6">
                <Text className="text-xl font-bold mb-4 text-slate-800">
                  Other ways to say it (Tap to listen)
                </Text>

                {aiData.suggestions.map(
                  (item: SuggestionItem, index: number) => (
                    <TouchableOpacity
                      key={`suggest-${index}`}
                      className="bg-white p-5 rounded-3xl mb-4 border border-slate-200 shadow-sm active:opacity-70"
                      onPress={() => playSound(item.audioBase64)}
                    >
                      <View className="flex-row justify-between items-start mb-1">
                        <View className="flex-1">
                          <Text>English</Text>
                          <Text className="text-lg font-bold text-indigo-600">
                            {item.english}
                          </Text>
                          <Text className="text-slate-400 text-sm italic">
                            {item.phonetic}
                          </Text>
                        </View>
                        <View className="bg-amber-100 p-2 rounded-full ml-2">
                          <Ionicons
                            name="volume-high"
                            size={18}
                            color="#FFB800"
                          />
                        </View>
                      </View>

                      <View className="mt-2 pt-2 border-t border-slate-50">
                        <Text>Translation</Text>
                        <Text className="text-slate-600 text-lg font-bold mt-1 ">
                          {item.vietnamese}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            )}
        </View>
      )}
    </ScrollView>
  );
}
