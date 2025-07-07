import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Button,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth, sendMail } from '../contexts/AuthContexts'

const categories = ["Plumbing", "Electrical", "Furniture", "Cleaning", "Other"];
const priorities = ["Low", "Medium", "High", "Urgent"];

const ReportForm = ({ visible, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState(priorities[0]);
  const [imageUri, setImageUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, sendMail } = useAuth();

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!title || !description || !location) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_id', user?.id);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('category', category);
      formData.append('priority', priority);
      if (imageUri) {
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          let fileType = 'image/jpeg';
          let fileName = 'photo.jpg';
          if (imageUri.includes('.')) {
            const extension = imageUri.split('.').pop().toLowerCase();
            if (["jpg", "jpeg"].includes(extension)) {
              fileType = 'image/jpeg';
              fileName = `photo.${extension}`;
            } else if (["png"].includes(extension)) {
              fileType = 'image/png';
              fileName = `photo.${extension}`;
            } else if (["webp"].includes(extension)) {
              fileType = 'image/webp';
              fileName = `photo.${extension}`;
            }
          }
          formData.append('image', blob, fileName);
        } catch (imageError) {
          // Continue without image if there's an error
        }
      }
      await onSubmit(formData, true);
      sendMail({
        location: location,
        priority: priority,
        category: category,

      });
      setTitle("");
      setDescription("");
      setLocation("");
      setCategory(categories[0]);
      setPriority(priorities[0]);
      setImageUri("");
      onClose();
    } catch (e) {
      setError("Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/30 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-11/12 max-h-[90%] shadow-xl border border-gray-200">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-2xl font-bold mb-4 text-blue-700 text-center">Submit a New Report</Text>
            {error ? <Text className="text-red-500 mb-2 text-center">{error}</Text> : null}
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-base bg-gray-50"
              placeholder="Title*"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-base bg-gray-50 min-h-[80px]"
              placeholder="Description*"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-base bg-gray-50"
              placeholder="Location*"
              value={location}
              onChangeText={setLocation}
            />
            <Text className="font-medium mb-1 text-gray-700">Category</Text>
            <View className="flex-row flex-wrap mb-3">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  className={`px-4 py-2 rounded-full border mr-2 mb-2 ${category === cat ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
                  onPress={() => setCategory(cat)}
                >
                  <Text className={`${category === cat ? 'text-white font-bold' : 'text-gray-700'}`}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text className="font-medium mb-1 text-gray-700">Priority</Text>
            <View className="flex-row flex-wrap mb-3">
              {priorities.map((pri) => (
                <TouchableOpacity
                  key={pri}
                  className={`px-4 py-2 rounded-full border mr-2 mb-2 ${priority === pri ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
                  onPress={() => setPriority(pri)}
                >
                  <Text className={`${priority === pri ? 'text-white font-bold' : 'text-gray-700'}`}>{pri}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row justify-between mb-3 space-x-2">
              <TouchableOpacity
                className="flex-1 bg-blue-50 border border-blue-200 rounded-lg py-3 items-center mr-2"
                onPress={handlePickImage}
              >
                <Text className="text-blue-700 font-semibold">Pick Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-50 border border-blue-200 rounded-lg py-3 items-center"
                onPress={handleTakePhoto}
              >
                <Text className="text-blue-700 font-semibold">Take Photo</Text>
              </TouchableOpacity>
            </View>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                className="w-full h-44 rounded-lg mb-3"
                resizeMode="cover"
              />
            ) : null}
            <View className="flex-row justify-between mt-4 space-x-2">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center mr-2"
                onPress={onClose}
                disabled={loading}
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 rounded-lg py-3 items-center ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text className="text-white font-semibold">{loading ? "Submitting..." : "Submit"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ReportForm;
