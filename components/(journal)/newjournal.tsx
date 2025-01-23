import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageSourcePropType,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import icons from "@/constants/icons";
import * as ImagePicker from "expo-image-picker";

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
      <View className="flex-wrap  justify-center items-center p-2">
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
  const [addImageModal, setAddImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 3,
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets.map((asset) => asset.uri);
      setSelectedImages([...selectedImages, ...newImage]);
    }
    setAddImageModal(false);
  };

  const takePhotoFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required to take photos");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      selectionLimit: 3,
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets.map((asset) => asset.uri);
      setSelectedImages([...selectedImages, ...newImage]);
    }
    setAddImageModal(false);
  };

  const removeImage = (imageIndex: number) => {
    setSelectedImages(
      selectedImages.filter((_, index) => index !== imageIndex)
    );
  };

  return (
    <>
      <View className="p-4">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="mb-6">
            <Text className="font-nunito-extra-bold text-2xl mb-4">
              How are you feeling?
            </Text>
            <View className="flex-row justify-center items-center gap-3">
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

          <View className="mb-6">
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

          <View className="mb-6">
            <Text className="font-nunito-extra-bold text-2xl mb-4">
              Images that capture your day! (optional)
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {selectedImages.map((uri, index) => (
                <View key={index} className="w-[20%] aspect-square mb-2">
                  <Image
                    source={{ uri }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    className="absolute right-safe-offset-0 bg-slate-300 rounded-full p-1"
                    onPress={() => removeImage(index)}
                  >
                    <Image source={icons.close} className="size-5" />
                  </TouchableOpacity>
                </View>
              ))}
              {selectedImages.length < 3 && (
                <TouchableOpacity
                  className="border border-gray-300 rounded-3xl p-2"
                  onPress={() => {
                    setAddImageModal(true);
                  }}
                >
                  <Image source={icons.addImage} className="size-8 mb-2" />
                  <Text className="font-nunito-bold text-xs text-center">
                    Add Image {"\n"} {3 - selectedImages.length} remaining
                  </Text>
                </TouchableOpacity>
              )}
            </View>
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

      <Modal
        visible={addImageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setAddImageModal(false);
        }}
      >
        <TouchableOpacity className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl">
            <View className="p-4 gap-4">
              <TouchableOpacity
                className="flex-row items-center p-3 bg-gray-100 rounded-xl"
                onPress={takePhotoFromCamera}
              >
                <Image source={icons.camera} className="size-6 mr-3" />
                <Text className="font-nunito-bold text-lg">Take a photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center p-3 bg-gray-100 rounded-xl"
                onPress={pickImageFromGallery}
              >
                <Image source={icons.gallery} className="size-6 mr-3" />
                <Text className="font-nunito-bold text-lg">
                  Choose from Gallery
                </Text>
              </TouchableOpacity>

              <View className="justify-center items-center">
                <TouchableOpacity
                  className="p-3"
                  onPress={() => setAddImageModal(false)}
                >
                  <Text className="font-nunito-bold text-lg text-red-500">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default NewJournal;
