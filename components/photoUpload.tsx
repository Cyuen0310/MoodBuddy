import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Modal, TouchableOpacity } from "react-native";
import { Image } from "react-native";

import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import icons from "@/constants/icons";

const photoUpload = () => {
  const [addImageModal, setAddImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 3,
      mediaTypes: "images",
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

  return (
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
  );
};

export default photoUpload;
