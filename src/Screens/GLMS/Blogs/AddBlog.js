import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BASE_URL from "../../../Config"
import axios from "axios";

export default function AddBlog() {
  const [blogName, setBlogName] = useState("");
  const [blogName_error, setBlogName_error] = useState(false);
  const [description, setDescription] = useState("");
  const [description_error, setDescription_error] = useState(false);
  const [caption, setCaption] = useState("");
  const [caption_error, setCaption_error] = useState(false);
  const [addedBy, setAddedBy] = useState("");
  const [addedBy_error, setAddedBy_error] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0); // Track current upload
  const [totalUploads, setTotalUploads] = useState(0); // Track total files to upload

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "video/*"],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      
      console.log("Selected files:", result.assets);

      // Handle multiple files
      const selectedFiles = result.assets || [result];
      await uploadFilesOneByOne(selectedFiles);
    } catch (error) {
      console.log("File pick error:", error);
      Alert.alert("Error", "Failed to pick files");
    }
  };

  // NEW: Upload files one by one (sequentially)
const uploadFilesOneByOne = async (files) => {
  if (files.length === 0) return;

  setUploading(true);
  setTotalUploads(files.length);
  setCurrentUploadIndex(0);

  const successfulUploads = [];
  const failedUploads = [];

  try {
    for (let i = 0; i < files.length; i++) {
      setCurrentUploadIndex(i + 1);

      try {
        console.log(`Uploading file ${i + 1} of ${files.length}:`, files[i].name);

        // ✅ Size check
        const fileSizeInMB = files[i].size / (1024 * 1024);
        if (fileSizeInMB > 20) {
          throw new Error(`File size (${fileSizeInMB.toFixed(2)}MB) exceeds 20MB limit`);
        }

        const uploadResponse = await uploadSingleFile(files[i]);

        const uploadedFileObj = {
          localFile: files[i],
          uploadResponse: uploadResponse,
          uploadedAt: new Date().toISOString(),
        };

        successfulUploads.push(uploadedFileObj);

        // ✅ Update only successful files in state
        setUploadedFiles(prev => [...prev, uploadedFileObj]);

        console.log(`✅ File ${i + 1} uploaded successfully:`, uploadResponse);

      } catch (error) {
        console.log(`❌ File ${i + 1} upload failed:`, error);
        failedUploads.push({
          file: files[i],
          error: error.message,
        });
      }
    }

    let alertMessage = `✅ ${successfulUploads.length} file(s) uploaded successfully`;
    if (failedUploads.length > 0) {
      alertMessage += `\n❌ ${failedUploads.length} file(s) failed:\n`;
      failedUploads.forEach(failedFile => {
        alertMessage += `\n• ${failedFile.file.name} - ${failedFile.error}`;
      });
    }

    Alert.alert("Upload Complete", alertMessage);

  } catch (error) {
    console.error("Upload process error:", error);
    Alert.alert("Error", "Upload process failed");
  } finally {
    setUploading(false);
    setCurrentUploadIndex(0);
    setTotalUploads(0);
  }
};

  // Single file upload function (same as before)
  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    
    formData.append("file", {
      uri: file.uri,
      type: file.mimeType || "application/octet-stream",
      name: file.name,
    });

    const response = await fetch(
      `${BASE_URL}upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Authorization":`Barear eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNDk5NmU5My00NmM5LTQ2Y2ItYTVmYi04MDUwYjhhZjE3YWIiLCJpYXQiOjE3NTg1MjAxNjEsImV4cCI6MTc1OTM4NDE2MX0.L7faWpceCr5olu88lb1f-e5WR2QeOni_pSwVAcouRznp0F_-Jd9yTacaP43sDHayXx8hA7J-Zm6SIFHtFTKprg`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("upload response",response)

    if (!response.ok) {
      throw new Error(`Upload failed for ${file.name}. Status: ${response.status}`);
    }

    return await response.json();
  };

  const removeFile = (index) => {
    Alert.alert(
      "Remove File",
      "Are you sure you want to remove this file?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const newFiles = uploadedFiles.filter((_, i) => i !== index);
            setUploadedFiles(newFiles);
          },
        },
      ]
    );
  };

const handleSubmit = async () => {
  console.log("sreeja")
  if (!blogName.trim()) {
    setBlogName_error(true);
    return;
  }
  if (!description.trim()) {
    setDescription_error(true);
    return;
  }
  if (caption.trim().length < 25) {
    setCaption_error(true);
    return;
  }
  if (!addedBy.trim()) {
    setAddedBy_error(true);
    return;
  }

  setLoading(true);


  console.log("Uploaded files:", uploadedFiles);

  // ✅ Prepare images ONLY from successful uploads
  const images = uploadedFiles
    .filter(fileData => fileData.uploadResponse?.uploadStatus === "UPLOADED") // only success
    .map(fileData => ({
      imageUrl: fileData.uploadResponse.documentPath, // ✅ use documentPath from response
      status: true,
    }));

  console.log("Prepared images:", images);

  const blogData = {
    askOxyCampaignDto: [
      {
        campaignDescription: description,
        campaignType: blogName,
        socialMediaCaption: caption,
        campaignTypeAddBy: addedBy,
        images: images, // ✅ only successful ones
        campainInputType: "BLOG",
      },
    ],
  };

  console.log("Final payload to send:", JSON.stringify(blogData, null, 2));

   // 🔥 Uncomment when API is ready
   axios({
      url:`${BASE_URL}marketing-service/campgin/addCampaignTypes`,
      method: "patch",
      // headers: { "Content-Type": "application/json" },
      data: blogData,
   })
   .then((response)=>{
  setLoading(false)
    console.log("addCampaignTypes API Response:", response.data);
    Alert.alert("🎉 Success!", "Your blog has been published successfully!");
    resetForm();
   })
   .catch((error)=>{
    console.log("addCampaignTypes Error",error.response.data.error)
    setLoading(false)
    Alert.alert("Error",error.response)
   })
  



};


// Add this helper function to reset the form
const resetForm = () => {
  setBlogName("");
  setDescription("");
  setCaption("");
  setAddedBy("");
  setUploadedFiles([]);
  setBlogName_error(false);
  setDescription_error(false);
  setCaption_error(false);
  setAddedBy_error(false);
};

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith("image/")) return "image";
    if (mimeType?.startsWith("video/")) return "videocam";
    return "document";
  };


  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="pencil" size={18} color="#667eea" />
              <Text style={styles.label}>Blog Name</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Give your blog an awesome name..."
              placeholderTextColor="#999"
              value={blogName}
              onChangeText={(text) => {
                setBlogName(text);
                setBlogName_error(false);
              }}
            />
            {blogName_error ? (
              <Text style={{ color: "red", marginLeft: 10 }}>Field is mandatory</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="document-text" size={18} color="#667eea" />
              <Text style={styles.label}>Blog Description</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What's your blog about? Tell us more..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setDescription_error(false);
              }}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.charCount}>{description.length}/10,000 characters</Text>
            {description_error ? (
              <Text style={{ color: "red", marginLeft: 10 }}>Field is mandatory</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="chatbubbles" size={18} color="#667eea" />
              <Text style={styles.label}>Social Media Caption</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Please enter a social media caption (min 25 characters)..."
              placeholderTextColor="#999"
              value={caption}
              onChangeText={(text) => {
                setCaption(text);
                setCaption_error(false);
              }}
              multiline
              numberOfLines={3}
            />
            <Text style={styles.charCount}>{caption.length}/25 characters</Text>
            {caption_error ? (
              <Text style={{ color: "red", marginLeft: 10 }}>Field is mandatory</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="images" size={18} color="#667eea" />
              <Text style={styles.label}>Upload Images & Videos</Text>
            </View>
            <TouchableOpacity
              style={styles.fileButton}
              onPress={()=>pickFiles()}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                  <Text style={styles.fileButtonText}>Upload Images & Videos</Text>
                </>
              )}
            </TouchableOpacity>

            {uploadedFiles.length > 0 && (
              <View style={styles.filesContainer}>
                {uploadedFiles.map((fileData, index) => (
                  <View key={index} style={styles.fileChip}>
                    {fileData.localFile.mimeType?.startsWith("image/") && (
                      <Image
                        source={{ uri: fileData.localFile.uri }}
                        style={styles.thumbnail}
                      />
                    )}
                    <Ionicons
                      name={getFileIcon(fileData.localFile.mimeType)}
                      size={20}
                      color="#667eea"
                    />
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {fileData.localFile.name || `File ${index + 1}`}
                      </Text>
                      <Text style={styles.fileSize}>
                        {(fileData.localFile.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => removeFile(index)}>
                      <Ionicons name="close-circle" size={22} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            <Text style={{ padding: 10 }}>
              Upload images (JPG, PNG) and videos (MP4, AVI, MOV, WMV, FLV, WEBM). Each
              file should be below 20MB.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="person" size={18} color="#667eea" />
              <Text style={styles.label}>Blog added by</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#999"
              value={addedBy}
              onChangeText={(text) => {
                setAddedBy(text);
                setAddedBy_error(false);
              }}
            />
            {addedBy_error ? (
              <Text style={{ color: "red", marginLeft: 10 }}>Field is mandatory</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={()=>handleSubmit()}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={loading ? ["#95a5a6", "#7f8c8d"] : ["#667eea", "#764ba2"]}
            style={styles.submitGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="rocket" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Publish Blog</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#fff",
    opacity: 0.9,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e6ed",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 5,
    textAlign: "right",
  },
  fileButton: {
    backgroundColor: "#667eea",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fileButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  filesContainer: {
    marginTop: 12,
    gap: 8,
  },
  fileChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: 10,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    color: "#2c3e50",
    fontWeight: "500",
  },
  fileSize: {
    fontSize: 11,
    color: "#95a5a6",
    marginTop: 2,
  },
  submitButton: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    padding: 18,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#95a5a6",
    fontStyle: "italic",
  },
});