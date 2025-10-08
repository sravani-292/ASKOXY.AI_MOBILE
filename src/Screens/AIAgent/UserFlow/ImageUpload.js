import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BASE_URL from "../../../../Config";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector } from "react-redux";

const {width,height} = Dimensions.get("window");

const ImageUpload = ({ assistantId, name = "User", profileImage }) => {
  const navigation = useNavigation();
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const token = useSelector((state) => state.counter.token);
  

  const getMimeType = (filename) => {
    if (!filename) return "image/jpeg";
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      default:
        return "image/jpeg";
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log("Image Picker Result:", result);
    if (!result.canceled) {
      const image = result.assets[0];
      console.log("Selected Image:", image);
      setUploadedImage(image);
      await uploadImage(image);
    } else {
      console.log("Image selection was canceled.");
    }
  };

  const uploadImage = async (image) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: image.uri,
        type: getMimeType(image.fileName),
        name: image.fileName || "image.jpg",
      });

      const response = await axios.post(
        `${BASE_URL}ai-service/agent/${assistantId}/uploadImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      console.log("Upload success:", response.data);
      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      Alert.alert(
        "Upload Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleProfilePicturePress = () => {
    if (uploading) return; 

    Alert.alert(
      "Edit Profile Picture",
      "Do you want to change your profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            // Show options for Camera or Gallery
            Alert.alert(
              "Select Image",
              "Choose how you want to select your profile picture",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Camera",
                  onPress: pickImageFromCamera,
                },
                {
                  text: "Gallery",
                  onPress: pickImage,
                },
              ]
            );
          },
        },
      ]
    );
  };

  const pickImageFromCamera = async () => {
    // Request camera permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log("Camera Result:", result);
    if (!result.canceled) {
      const image = result.assets[0];
      console.log("Captured Image:", image);
      setUploadedImage(image);
      await uploadImage(image);
    } else {
      console.log("Camera was canceled.");
    }
  };

  const initialLetter = name ? name.charAt(0).toUpperCase() : "U";

  return (
      <TouchableOpacity 
        style={styles.avatarContainer}
        onPress={handleProfilePicturePress}
        disabled={uploading}
        activeOpacity={0.7}
      >
        {uploadedImage ? (
          <Image source={{ uri: uploadedImage.uri }} style={styles.avatar} />
        ) : (
          <>
          {profileImage ? (
            <View>
             <Image source={{ uri: profileImage }} style={styles.avatar} />
            </View>
          ) :
          <View style={styles.initialsContainer}>
            <Text style={styles.initialsText}>{initialLetter}</Text>
            <AntDesign name="camera" size={24} color="#ffff" style={styles.cameraIcon} />
          </View>
        }
        </>
        )}
        
        {/* Loading overlay */}
        {uploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
        )}
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: width *0.85,
    height: 100,
  },
  avatar: {
    width: width *0.85,
    height: 100,
    borderRadius: 12,
    borderColor: "#4F46E5",
  },
  initialsText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    textAlign:"center"
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon:{
    position: "absolute",
    bottom: 5,
    right: 15,
    alignSelf:"flex-end"
  },
  initialsContainer: {
    width: width *0.85,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageUpload;