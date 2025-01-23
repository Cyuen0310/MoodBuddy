import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageSourcePropType,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import icons from "@/constants/icons";

interface MoodOptionsProps {
  icon: ImageSourcePropType;
  mood: string;
}

interface NewJournalProps {
  selectedDate?: Date;
}

const MoodOptions = ({ icon, mood }: MoodOptionsProps) => {
  return (
    <TouchableOpacity>
      <View className="flex-col justify-center items-center p-2">
        <Image source={icon} className="size-10" />
        <Text className="font-nunito-extra-bold text-sm m-2">{mood}</Text>
      </View>
    </TouchableOpacity>
  );
};

const factors = [
  "Family",
  "Friends",
  "Love",
  "Academics",
  "Financial",
  "Weather",
  "Sleep",
];

const NewJournal = () => {
  const [inputHeight, setInputHeight] = useState(100);
  return (
    <View className="p-4">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="mb-6">
          <Text className="font-nunito-extra-bold text-2xl mb-4">
            How are you feeling?
          </Text>
          <View className="flex-row justify-center items-center gap-6">
            <MoodOptions icon={icons.angry} mood="Angry" />
            <MoodOptions icon={icons.sad} mood="Sad" />
            <MoodOptions icon={icons.neutral} mood="Neutral" />
            <MoodOptions icon={icons.happy} mood="Happy" />
            <MoodOptions icon={icons.joyful} mood="Joyful" />
          </View>
        </View>

        <View className="mb-6">
          <Text className="font-nunito-extra-bold text-2xl mb-4">
            What triggered this feeling?
          </Text>
          <View className="flex-row flex-wrap">
            {factors.map((factor) => (
              <TouchableOpacity
                key={factor}
                className="w-[30%] bg-gray-100 rounded-3xl m-1 p-2"
                onPress={() => {}}
              >
                <Text className="font-nunito-bold text-lg text-center">
                  {factor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text className="font-nunito-extra-bold text-2xl mb-4">
            Want to write something? (optional)
          </Text>
          <TextInput
            className="bg-gray-100 rounded-3xl p-4 font-nunito-extra-bold-italic"
            multiline
            placeholder="How was your day?"
            onChangeText={() => {}}
            textAlignVertical="top"
            onContentSizeChange={(event) =>
              setInputHeight(
                Math.max(100, event.nativeEvent.contentSize.height)
              )
            }
          />
        </View>
        <TouchableOpacity
          onPress={() => {}}
          className="bg-blue-500 rounded-full py-3 mt-4 mb-6 flex-row justify-center items-center"
        >
          <Text className="text-white text-center font-nunito-extra-bold-italic text-xl">
            Jot it down!
          </Text>
          {/* <Image source={icons.pencil} className="size-6 mx-1" /> */}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default NewJournal;
