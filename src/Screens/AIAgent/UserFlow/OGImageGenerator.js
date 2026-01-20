import React, { useState,useEffect, use } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import { useSelector } from "react-redux";
// import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get("window");

export default function OGImageGenerator() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [OGResponse, setOGResponse] = useState(null);
  const [generateImageUrl, setGenerateImageUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const user = useSelector((state) => state.counter);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need camera roll permissions to select images."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log({ result });
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      console.log("Pick Image:", result.assets[0].uri);
      UploadImage(result.assets[0].uri, result.assets[0].fileName);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need camera permissions to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log("Results", result);
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      console.log("Image:", result.assets[0].uri);
      UploadImage(result.assets[0].uri, result.assets[0].fileName);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert("Select Image", "Choose how you want to select an image", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const UploadImage = async (imageUri, fileName) => {
    setIsUploading(true);
    console.log("Upload Image:", imageUri, fileName);
    
    try {
      const name = imageUri.split("/").pop();
      const fileType = fileName ? fileName.split(".").pop() : "jpg";

      let fileUri = imageUri;

      if (Platform.OS === "android" && imageUri[0] === "/") {
        fileUri = `file://${imageUri}`;
        fileUri = fileUri.replace(/%/g, "%25");
      }

      const fileToUpload = {
        name: name,
        uri: fileUri,
        type: `image/${fileType}`,
      };

      const fd = new FormData();
      fd.append("multiPart", fileToUpload);
      
      axios
        .post(
          `https://meta.oxyloans.com/api/product-service/uploadComboImages?fileType=image`,
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`
              
            },
          }
        )
        .then((response) => {
          console.log("response", response.data);
          Alert.alert("Success!", "Image uploaded successfully!");
          setIsUploading(false);
          setUploadedImageUrl(response.data);
        })
        .catch((error) => {
          console.log("Error", error.response);
            Alert.alert("Error", "Failed to upload image");
          setIsUploading(false);
        });
    } catch (error) {
      console.error("Upload error:", error.response);
      Alert.alert("Error", "Failed to upload image");
    }
  };

  const generateImage = async (imageUrl) => {
    console.log({imageUrl})
    if (!selectedImage) {
      Alert.alert(
        "No Image Selected",
        "Please upload a reference image first."
      );
      return;
    }
    if(imageUrl==null){
        Alert.alert("Error","No Image is Provided for Generation");
        return;
    }
    if (!selectedGender) {
      Alert.alert("Gender Not Selected", "Please select a gender first.");
      return;
    }

    setIsGenerating(true);
    console.log({ selectedGender });

    const UsePrompt = selectedGender === "male" 
      ? "A 4K ultra-realistic cinematic poster of a man leaning stylishly against the side of a 1973 Chevrolet Chevelle Malibu in glossy black, shown in the exact same angle and direction as the reference image. The man is posed confidently, leaning on the car door, with one hand in his pocket and the other holding a small transparent Indian cutting chai glass (without handle), gripped naturally between his fingers only. The chai glass is filled with steaming hot tea, with visible vapor rising upwards. The man is dressed in a black leather jacket over a dark maroon/burgundy shirt with the top buttons open, paired with large flared black bell-bottom pants and polished black shoes. His face is clearly visible (no sunglasses), with a calm, charismatic expression. Text styling on the car door: The phrase appears in two lines on the car door: Line 1 (top): 'THE FAN OF' in bold white uppercase. Line 2 (below): 'OG' in much larger distressed bold red letters. Placement is carefully adjusted so the text is clearly visible and not overlapped by the character’s body, blending naturally with the glossy black surface. The background is a cinematic bluish-grey overcast sky, slightly brightened for clarity. Several black birds are scattered across the sky in different positions and directions, creating natural depth and motion (not aligned in a straight line). The ground is dark asphalt with faint red reflections, adding intensity. Soft cinematic lighting highlights the folds of the jacket, the deep tone of the maroon shirt, the wide flare of the bell-bottom pants, the chai glass held delicately between the fingers, the steam rising above it, the polished reflections of the Chevelle Malibu, and the bold impactful text on the car door."
      : "A 4K ultra-realistic cinematic poster of a woman leaning stylishly against the side of a 1973 Chevrolet Chevelle Malibu in glossy black, shown in the exact same angle and direction as the reference image. The woman is posed confidently, leaning on the car door, with one hand in her pocket and the other holding a small transparent Indian cutting chai glass (without handle), gripped naturally between her fingers. The chai glass is filled with steaming hot tea, with visible vapor rising upwards.The woman is dressed in a sleek black leather jacket layered over a fitted dark maroon/burgundy round-neck t-shirt, paired with large flared black bell-bottom pants and polished black shoes. Her face is clearly visible (no sunglasses), with a calm, charismatic expression, giving a strong cinematic aura.Text styling on the car door: Line 1 (top): 'THE FAN OF' in bold white uppercase. Line 2 (below): 'OG' in much larger distressed bold red letters. Placement is carefully adjusted so the text is clearly visible and not overlapped by the character’s body, blending naturally with the glossy black surface.The background is a cinematic bluish-grey overcast sky, slightly brightened for clarity. Several black birds are scattered across the sky in different positions and directions, creating natural depth and motion (not aligned in a straight line). The ground is dark asphalt with faint red reflections, adding intensity. Soft cinematic lighting highlights the folds of the leather jacket, the deep tone of the maroon round-neck t-shirt, the flare of the bell-bottom pants, the steam from the chai glass, the polished reflections of the Chevelle Malibu, and the bold impactful text on the car door.";

    console.log("UsePrompt", UsePrompt);
    axios
      .post(`https://meta.oxyloans.com/api/ai-service/agent/editGeminiImage`, {
        imageUrl: imageUrl,
        prompt: UsePrompt,
        userId: user.userId,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      .then((response) => {
        console.log("OG Response", response.data);
        setIsGenerating(false);
        setOGResponse(response.data);
        setGenerateImageUrl(response.data);
        Alert.alert(
          "Success!",
          "Your AI image has been generated successfully!"
        );
      })
      .catch((error) => {
        console.log("OG Error", error.response);
        setIsGenerating(false);
        Alert.alert("Error", "Failed to generate image");
      });
  };

const downloadImage = async () => {
  if (!OGResponse) {
    Alert.alert("No Image", "Please generate an image first.");
    return;
  }

  try {
    Linking.openURL(OGResponse); // Opens the image in browser
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert("Error", "Failed to open image");
  }
};

  const removeImage = () => {
    setSelectedImage(null);
    setIsGenerating(false);
    setUploadedImageUrl(null);
    setSelectedGender(null);
    setOGResponse(null);
    setGenerateImageUrl(null);
  };


  const imageShow = (image) => {
    if (image) {
        console.log({image},"show image called in fuction");
        
      return <Image source={{ uri: image }} 
                  style={styles.generatedImage}
                  resizeMode="contain" />;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      <LinearGradient
        colors={["#6366f1", "#8b5cf6", "#a855f7"]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="color-palette" size={24} color="#fff" />
            </View>
            <Text style={styles.title}>AI Image Generator</Text>
          </View>
          <Text style={styles.subtitle}>
            Transform your images with Gemini AI - Upload → Generate → Download
          </Text>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Upload Section */}
          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>Upload Reference Image</Text>

            {/* Gender Selection */}
            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Select Gender:</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    selectedGender === "male" && styles.genderButtonSelected,
                  ]}
                  onPress={() => setSelectedGender("male")}
                >
                  <Ionicons
                    name="male"
                    size={20}
                    color={selectedGender === "male" ? "#fff" : "#6366f1"}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      selectedGender === "male" &&
                        styles.genderButtonTextSelected,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    selectedGender === "female" && styles.genderButtonSelected,
                  ]}
                  onPress={() => setSelectedGender("female")}
                >
                  <Ionicons
                    name="female"
                    size={20}
                    color={selectedGender === "female" ? "#fff" : "#ec4899"}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      selectedGender === "female" &&
                        styles.genderButtonTextSelected,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.uploadContainer}
              onPress={selectedImage ? null : showImagePickerOptions}
              activeOpacity={0.7}
              disabled={isUploading}
            >
              {isUploading ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="large" color="#6366f1" />
                  <Text style={styles.uploadingText}>Uploading Image...</Text>
                </View>
              ) : selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={removeImage}
                  >
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={styles.changeButton}
                    onPress={showImagePickerOptions}
                  >
                    <Ionicons name="camera" size={16} color="#6366f1" />
                    <Text style={styles.changeButtonText}>Change</Text>
                  </TouchableOpacity> */}
                </View>
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={48}
                    color="#a1a1aa"
                  />
                  <Text style={styles.uploadText}>
                    Click to upload reference image
                  </Text>
                  <Text style={styles.supportText}>
                    Supports JPG, PNG, GIF (max 20MB)
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Generate Button */}
            <TouchableOpacity
              style={[
                styles.generateButton,
                (!selectedImage ||
                  isGenerating ||
                  isUploading ||
                  !selectedGender) &&
                  styles.generateButtonDisabled,
              ]}
              onPress={() => generateImage(uploadedImageUrl)}
              disabled={
                !selectedImage || isGenerating || isUploading || !selectedGender
              }
              activeOpacity={0.8}
            >
              {isGenerating ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.generateButtonText}>Generating...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="sparkles" size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>
                    Generate AI Image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Generated Image Section */}
            {OGResponse && (
              <View style={styles.generatedImageContainer}>
                <Text style={styles.sectionTitle}>Generated Image</Text>
                {/* <Image
                  source={{ uri: OGResponse }}
                  style={styles.generatedImage}
                  resizeMode="contain"
                /> */}
                {imageShow(OGResponse)}
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={downloadImage}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="download" size={20} color="#fff" />
                  )}
                  <Text style={styles.downloadButtonText}>
                    {isDownloading ? "Downloading..." : "Download Image"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Footer Info */}
        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark" size={16} color="#c4b5fd" />
            <Text style={styles.infoText}>Secure & Private</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="flash" size={16} color="#c4b5fd" />
            <Text style={styles.infoText}>Fast Processing</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="diamond" size={16} color="#c4b5fd" />
            <Text style={styles.infoText}>High Quality</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6366f1",
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e7ff",
    textAlign: "center",
    lineHeight: 22,
  },
  uploadSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 20,
  },
  genderContainer: {
    marginBottom: 20,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 10,
  },
  genderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  genderButtonSelected: {
    backgroundColor: "#6366f1",
  },
  genderButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#6366f1",
  },
  genderButtonTextSelected: {
    color: "#fff",
  },
  uploadContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderStyle: "dashed",
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    minHeight: 200,
  },
  uploadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#fff",
  },
  imagePreviewContainer: {
    width: "100%",
    alignItems: "center",
  },
  previewImage: {
    width: width - 120,
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  changeButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#6366f1",
  },
  uploadText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    marginTop: 12,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: "#c4b5fd",
  },
  generateButton: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  generateButtonDisabled: {
    backgroundColor: "#6b7280",
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  generatedImageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  generatedImage: {
    width: width - 100,
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: "#c4b5fd",
    marginLeft: 4,
  },
});