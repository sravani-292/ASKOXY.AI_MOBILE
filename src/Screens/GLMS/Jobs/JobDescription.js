import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  Dimensions,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import BASE_URL from "../../../Config";
import axios from "axios";

const { height, width } = Dimensions.get("window");

const JobDescription = ({ route }) => {
  const jobData = route.params.jobDetails;
  console.log({ jobData });
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: "",
    noticePeriod: "",
    mobileNumber: "",
    name: "",
    resume: null,
    documentPath: "",
  });
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [error, setError] = useState({
    coverLetterError: "",
    noticePeriodError: "",
    mobileNumberError: "",
    nameError: "",
    resumeError: "",
  });

  useFocusEffect(
    useCallback(() => {
      appliedjobsfunc();
    }, [])
  );

  const handleCall = () => {
    const phoneNumber = `${jobData.countryCode}${jobData.contactNumber}`;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleApply = () => {
    setModalVisible(true);
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log({ file });

        setFormData((prev) => ({
          ...prev,
          resume: {
            name: file.name,
            uri: file.uri,
            type: file.mimeType,
            size: file.size,
          },
        }));
        const data = new FormData();
        data.append("file", {
          uri:
            Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
          name: file.name,
          type: file.mimeType,
        });
        data.append("fileType", "resume");
        data.append("userId", "e00536d6-a7eb-40d9-840c-38acaceb6177");
        data.append("jobId", route.params.jobDetails.id);
        console.log(data._parts);
        axios
          .post(`${BASE_URL}marketing-service/campgin/upload`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Upload Success", response.data);
            Alert.alert("Success", "Resume uploaded successfully!");
            setFormData((prev) => ({
              ...prev,
              documentPath: response.data.fileUrl,
            }));
          })
          .catch((error) => {
            console.log("Upload Error", error.response);
            Alert.alert(
              "Error",
              error.response?.data?.error ||
                "Failed to upload resume. Please try again."
            );
          });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document. Please try again.");
      console.error("Document picker error:", error);
    }
  };

  const handleSubmitApplication = () => {
    // Validate required fields
    if (!formData.name.trim()) {
      //   Alert.alert('Error', 'Please enter your name');
      setError((prev) => ({ ...prev, nameError: "Field is mandatory" }));
      return;
    }

    if (!formData.mobileNumber.trim()) {
      //   Alert.alert('Error', 'Please enter your mobile number');
      setError((prev) => ({
        ...prev,
        mobileNumberError: "Field is mandatory",
      }));
      return;
    }
    if (!formData.resume) {
      //   Alert.alert('Error', 'Please upload your resume');
      setError((prev) => ({ ...prev, resumeError: "Field is mandatory" }));
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Application Data:", formData);

    var data = {
      coverLetter: formData.coverLetter,
      noticePeriod: formData.noticePeriod || 0,
      mobileNumber: formData.mobileNumber,
      userName: formData.name,
      applicationStatus: "applied",
      resumeUrl: formData.documentPath,
      jobDesignation: route.params.jobDetails.jobDesignation,
      companyName: route.params.jobDetails.companyName,
      userId: "e00536d6-a7eb-40d9-840c-38acaceb6177",
      jobId: route.params.jobDetails.id,
    };

    axios
      .post(`${BASE_URL}marketing-service/campgin/userapplyjob`, data)
      .then((response) => {
        console.log("Application Success", response.data);
        Alert.alert(
          "Success",
          "Your application has been submitted successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                setModalVisible(false);
                // Reset form
                setFormData({
                  coverLetter: "",
                  noticePeriod: "",
                  mobileNumber: "",
                  name: "",
                  resume: null,
                });
              },
            },
          ]
        );
        handleCancel();
      })
      .catch((error) => {
        console.log("Application Error", error.response);
        Alert.alert(
          "Error",
          error.response?.data?.error ||
            "Failed to submit application. Please try again."
        );
      });
  };

  const handleCancel = () => {
    setModalVisible(false);
    // Reset form
    setFormData({
      coverLetter: "",
      noticePeriod: "",
      mobileNumber: "",
      name: "",
      resume: null,
    });
  };

  const appliedjobsfunc = () => {
    axios
      .get(
        `${BASE_URL}marketing-service/campgin/getuserandllusersappliedjobs?userId=e00536d6-a7eb-40d9-840c-38acaceb6177`
      )
      .then((response) => {
        console.log("applied jobs", response.data);
        setAppliedJobs(response.data); // save the applied jobs
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const formatBenefits = (benefits) => {
    return benefits.split("\n").filter((benefit) => benefit.trim() !== "");
  };

  const formatSkills = (skills) => {
    return skills.split(",").map((skill) => skill.trim());
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Image
              source={{ uri: jobData.companyLogo }}
              style={styles.companyLogo}
              resizeMode="contain"
            />
            <View style={styles.headerText}>
              <Text style={styles.jobTitle}>{jobData.jobTitle}</Text>
              <Text style={styles.companyName}>{jobData.companyName}</Text>
            </View>
          </View>
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{jobData.jobLocations}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="briefcase-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{jobData.experience}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="business-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{jobData.industry}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="document-text-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{jobData.jobType}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="home-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{jobData.workMode}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                {new Date(jobData.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>{jobData.description}</Text>
        </View>

        {/* Qualifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qualifications</Text>
          <Text style={styles.qualifications}>{jobData.qualifications}</Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Skills</Text>
          <View style={styles.skillsContainer}>
            {formatSkills(jobData.skills).map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits & Perks</Text>
          {formatBenefits(jobData.benefits).map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <Ionicons name="call-outline" size={20} color="#2196F3" />
            <Text style={styles.contactText}>
              {jobData.countryCode} {jobData.contactNumber}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <Ionicons name="mail-outline" size={20} color="#2196F3" />
            <Text style={styles.contactText}>
              {jobData.companyEmail == ""
                ? "support@askoxy.ai"
                : jobData.companyEmail}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Apply Button */}
        <View style={styles.applyContainer}>
          {appliedJobs.some(
            (job) => job.jobId === route.params.jobDetails.id
          ) ? (
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: "gray" }]}
              disabled
            >
              <Text style={styles.applyButtonText}>Applied</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>
                Apply for this Position
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Application Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Your Job Application</Text>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Text style={styles.required}>* </Text>Name
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your name"
                  value={formData.name}
                  onChangeText={(text) => {
                    setFormData((prev) => ({ ...prev, name: text }));
                    if (text.trim() !== "") {
                      setError((prev) => ({ ...prev, nameError: "" }));
                    }
                  }}
                />

                {error.nameError != "" && (
                  <Text style={{ color: "red" }}>Field is mandatory</Text>
                )}
              </View>

              {/* Mobile Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Text style={styles.required}>* </Text>Mobile Number
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 9876543210"
                  keyboardType="numeric"
                  value={formData.mobileNumber}
                  maxLength={10}
                  onChangeText={(text) => {
                    setFormData((prev) => ({ ...prev, mobileNumber: text }));
                    if (text.trim() !== "") {
                      setError((prev) => ({ ...prev, mobileNumberError: "" }));
                    }
                  }}
                />

                {error.mobileNumberError != "" && (
                  <Text style={{ color: "red" }}>Field is mandatory</Text>
                )}
              </View>

              {/* Cover Letter */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Text style={styles.required}>* </Text>Cover Letter
                </Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Write your cover letter here..."
                  multiline
                  numberOfLines={4}
                  value={formData.coverLetter}
                  onChangeText={(text) => {
                    setFormData((prev) => ({ ...prev, coverLetter: text }));
                    if (text.trim() !== "") {
                      setError((prev) => ({ ...prev, coverLetterError: "" }));
                    }
                  }}
                />

                {error.coverLetterError != "" && (
                  <Text style={{ color: "red" }}>Field is mandatory</Text>
                )}
              </View>

              {/* Notice Period */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notice Period</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 30 days"
                  value={formData.noticePeriod}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, noticePeriod: text }))
                  }
                />
                {error.noticePeriodError != "" && (
                  <Text style={{ color: "red" }}>Field is mandatory</Text>
                )}
              </View>

              {/* Upload Resume */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Text style={styles.required}>* </Text>Upload Resume
                </Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleDocumentPick}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color="#666"
                  />
                  <Text style={styles.uploadButtonText}>
                    {formData.resume ? formData.resume.name : "Click to Upload"}
                  </Text>
                </TouchableOpacity>
                {formData.resume && (
                  <View style={styles.fileInfo}>
                    <Ionicons name="document-text" size={16} color="#4CAF50" />
                    <Text style={styles.fileName}>{formData.resume.name}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, resume: null }))
                      }
                    >
                      <Ionicons name="close-circle" size={16} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitApplication}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyLogo: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: "#666",
  },
  quickInfo: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
    width: width * 0.35,
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  qualifications: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 12,
    color: "#1976d2",
    fontWeight: "500",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  benefitText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
  },
  applyContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  applyButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    maxHeight: height * 0.6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#f44336",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 15,
    backgroundColor: "#fafafa",
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e8f5e8",
    borderRadius: 8,
  },
  fileName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#2196F3",
  },
  submitButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default JobDescription;
