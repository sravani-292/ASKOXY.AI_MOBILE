import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ToastAndroid,
  Platform,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import BASE_URL, { userStage } from "../../../../Config";
import * as DocumentPicker from "expo-document-picker";
// import { FormData } from "formdata-node";
import { COLORS } from "../../../../Redux/constants/theme";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("window");

const WriteToUs = ({ navigation, route }) => {
  console.log("datainparams", route.params);

  const accessToken = useSelector((state) => state.counter);
  const fd = new FormData();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    query: "",
    query_error: false,
    fileName: "",
    documentId: "",
    uploadStatus: "",
    uploadLoader: false,
    loading: false,
    order_id: "",
  });

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    isVerified: false,
  });

  useFocusEffect(
    useCallback(() => {
      getProfileDetails();
    }, [])
  );

  function getProfileDetails() {
    setFormData(prev => ({ ...prev, loading: true }));
    
    axios
      .get(
        BASE_URL +
          `user-service/customerProfileDetails?customerId=${accessToken.userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.accessToken}`,
          },
        }
      )
      .then(function (response) {
        console.log("customer data1", response.data);
        
        if (
          response.data.whatsappVerified == true ||
          response.data.mobileVerified == true
        ) {
          const profileData = {
            name: `${response.data?.firstName} ${response.data?.lastName}`,
            email: response.data?.email,
            mobile: response.data?.whatsappNumber || response.data?.mobileNumber,
            isVerified: true,
          };
          
          setUserProfile(profileData);
          setFormData(prev => ({
            ...prev,
            name: profileData.name,
            email: profileData.email,
            mobileNumber: profileData.mobile,
            loading: false,
          }));
        } else {
          setFormData(prev => ({ ...prev, loading: false }));
          Alert.alert(
            "Incomplete Profile",
            "Please complete your profile verification to submit queries.",
            [
              {
                text: "Complete Profile",
                onPress: () => navigation.navigate("Profile"),
                style: "default",
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ]
          );
        }
      })
      .catch(function (error) {
        console.log(error.response);
        setFormData(prev => ({ ...prev, loading: false }));
        Alert.alert("Error", "Failed to load profile details. Please try again.");
      });
  }

  const handleSubmit = () => {
    const { name, email, mobileNumber, query } = formData;

    // Validation
    if (!query.trim()) {
      setFormData({ ...formData, query_error: true });
      return;
    }

    // if (!/^\S+@\S+\.\S+$/.test(email)) {
    //   Alert.alert("Error", "Invalid email format!");
    //   return;
    // }

    // Construct final query
    let finalQuery;
    if (route.params?.orderId) {
      finalQuery = `Regarding ${route.params.orderId}: ${query}`;
    } else {
      finalQuery = query;
    }

    // Prepare data object
    let data = {
      adminDocumentId: "",
      askOxyOfers: "FREESAMPLE",
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      projectType: "ASKOXY",
      query: finalQuery,
      queryStatus: "PENDING",
      resolvedBy: "",
      resolvedOn: "",
      status: "",
      userDocumentId: formData.documentId || "",
      userId: accessToken.userId,
    };

    // Handle different scenarios
    if (route.params?.ticketId) {
      data = {
        ...data,
        id: route.params.ticketId,
        comments: finalQuery,
        query: query,
        resolvedBy: "customer",
      };
    } else if (route.params?.orderId) {
      data = {
        ...data,
        resolvedBy: "customer",
      };
    } else {
      data = {
        ...data,
        comments: "",
        id: "",
      };
    }

    console.log({ data });

    setFormData({ ...formData, loading: true });

    axios
      .post(BASE_URL + "user-service/write/saveData", data, {
        headers: {
          Authorization: `Bearer ${accessToken.accessToken}`,
        },
      })
      .then(function (response) {
        console.log(response.data);
        setFormData({
          ...formData,
          loading: false,
          fileName: "",
          query: "",
          documentId: "",
        });
        
        Alert.alert(
          "Success",
          "Your query has been submitted successfully!",
          [
            {
              text: "View Tickets",
              onPress: () => navigation.navigate("Ticket History"),
            },
            {
              text: "OK",
              style: "cancel",
            },
          ]
        );
      })
      .catch(function (error) {
        console.log(error.response);
        Alert.alert(
          "Failed",
          error.response?.data?.message || "Something went wrong. Please try again."
        );
        setFormData({ ...formData, loading: false });
      });
  };

  const handleFileChange = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        allowsEditing: false,
        aspect: [4, 4],
      });

      if (!result.canceled) {
        let { name, size, uri } = result.assets[0];

        // Android URI handling
        if (Platform.OS === "android") {
          uri = `file://${uri}`;
          uri = uri.replace(/%/g, "%25");
        }

        let nameParts = name.split(".");
        let fileType = nameParts[nameParts.length - 1];
        
        var fileToUpload = {
          name: name,
          size: size,
          uri: uri,
          type: "application/" + fileType,
        };

        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("fileType", "kyc");
        formData.append("projectType", "ASKOXY");

        setFormData(prev => ({ ...prev, uploadLoader: true }));

        axios({
          method: "post",
          url: BASE_URL + `user-service/write/uploadQueryScreenShot?userId=${accessToken.userId}`,
          data: formData,
          headers: {
            Authorization: `Bearer ${accessToken.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })
          .then(function (response) {
            console.log("uploadQueryScreenShot", response.data);
            Alert.alert("Success", "File uploaded successfully");
            setFormData(prev => ({
              ...prev,
              fileName: fileToUpload.name,
              documentId: response.data.id,
              uploadLoader: false,
            }));
          })
          .catch(function (error) {
            console.log(error.response?.data);
            Alert.alert("Error", error.response?.data?.error || "File upload failed");
            setFormData(prev => ({ ...prev, uploadLoader: false }));
          });
      }
    } catch (error) {
      console.log("Document picker error:", error);
      Alert.alert("Error", "Failed to select file");
    }
  };

  const removeFile = () => {
    Alert.alert(
      "Remove File",
      "Are you sure you want to remove the attached file?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () => setFormData(prev => ({ 
            ...prev, 
            fileName: "", 
            documentId: "" 
          })),
          style: "destructive",
        },
      ]
    );
  };

  if (formData.loading && !userProfile.isVerified) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.services} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}></Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Ticket History")}
          style={styles.historyBtn}
        >
          <Icon name="time-outline" size={18} color="white" />
          <Text style={styles.historyBtnText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={styles.userInfoCard}>
          <View style={styles.userInfoHeader}>
            <Icon name="person-circle-outline" size={24} color={COLORS.services} />
            <Text style={styles.userInfoTitle}>Submitting as:</Text>
          </View>
          <Text style={styles.userInfoText}>{userProfile.name}</Text>
          <Text style={styles.userInfoText}>{userProfile.email}</Text>
          <Text style={styles.userInfoText}>{userProfile.mobile}</Text>
        </View>

        {/* Order Reference */}
        {route.params?.orderId && (
          <View style={styles.orderRefCard}>
            <Icon name="receipt-outline" size={20} color="#FF6B35" />
            <Text style={styles.orderRefText}>
              Regarding Order: {route.params.orderId.slice(-8)}
            </Text>
          </View>
        )}

        {/* Query Input */}
        <View style={styles.querySection}>
          <Text style={styles.sectionLabel}>Your Query *</Text>
          <TextInput
            style={[
              styles.queryInput,
              formData.query_error && styles.errorBorder
            ]}
            placeholder="Describe your issue or question in detail..."
            multiline
            numberOfLines={6}
            value={formData.query}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                query: text,
                query_error: false,
              })
            }
            textAlignVertical="top"
          />
          {formData.query_error && (
            <Text style={styles.errorText}>Query is required</Text>
          )}
        </View>

        {/* File Upload Section */}
        {(!route.params || route.params === "") && (
          <View style={styles.fileSection}>
            <Text style={styles.sectionLabel}>Attach File (Optional)</Text>
            {!formData.fileName ? (
              <TouchableOpacity 
                style={styles.uploadBox} 
                onPress={handleFileChange}
                disabled={formData.uploadLoader}
              >
                {formData.uploadLoader ? (
                  <ActivityIndicator size={30} color={COLORS.services} />
                ) : (
                  <>
                    <Icon name="cloud-upload-outline" size={40} color="#666" />
                    <Text style={styles.uploadText}>Tap to upload file</Text>
                    <Text style={styles.uploadSubtext}>
                      Images, documents, screenshots
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.fileAttached}>
                <View style={styles.fileInfo}>
                  <Icon name="document-attach-outline" size={20} color={COLORS.services} />
                  <Text style={styles.fileName} numberOfLines={1}>
                    {formData.fileName}
                  </Text>
                </View>
                <TouchableOpacity onPress={removeFile} style={styles.removeBtn}>
                  <Icon name="close-circle" size={20} color="#FF4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            styles.submitBtn,
            formData.loading && styles.disabledBtn
          ]}
          disabled={formData.loading}
        >
          {formData.loading ? (
            <ActivityIndicator size={20} color="white" />
          ) : (
            <>
              <Icon name="send" size={18} color="white" />
              <Text style={styles.submitBtnText}>Submit Query</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WriteToUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  historyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.services,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  historyBtnText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  userInfoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  userInfoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    paddingLeft: 32,
  },
  orderRefCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B35",
  },
  orderRefText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E65100",
    marginLeft: 8,
  },
  querySection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  queryInput: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    textAlignVertical: "top",
  },
  errorBorder: {
    borderColor: "#FF4444",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  fileSection: {
    marginBottom: 30,
  },
  uploadBox: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    width: "90%",
    textAlign: "center",
  },
  fileAttached: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  fileInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  fileName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  removeBtn: {
    padding: 4,
  },
  submitBtn: {
    backgroundColor: COLORS.services,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});