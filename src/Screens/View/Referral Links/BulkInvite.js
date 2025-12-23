import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useSelector } from "react-redux";
import AskOxyAgentWidget from "../../../AskOxyAgentWidget";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";


// FileUploadButton Component
const FileUploadButton = ({ selectedFile, onPress, error }) => (
  <View>
    <TouchableOpacity
      style={[styles.fileButton, error && styles.inputError]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.fileButtonContent}>
        <Text style={styles.fileButtonText}>Choose File</Text>
        <Text style={styles.fileButtonSubtext} numberOfLines={1}>
          {selectedFile ? selectedFile.name : "No file chosen"}
        </Text>
      </View>
    </TouchableOpacity>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// CustomDropdown Component
const CustomDropdown = ({
  label,
  value,
  options,
  placeholder,
  onSelect,
  isOpen,
  onToggle,
  required,
  error,
}) => (
  <View>
    <Text style={styles.label}>
      {label} {required && <Text style={styles.required}>*</Text>}
    </Text>
    <TouchableOpacity
      style={[styles.dropdown, error && styles.inputError]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
        {value || placeholder}
      </Text>
      <Text style={styles.dropdownArrow}>{isOpen ? "▲" : "▼"}</Text>
    </TouchableOpacity>

    {isOpen && (
      <View style={styles.dropdownMenu}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dropdownItem,
              index === options.length - 1 && { borderBottomWidth: 0 },
            ]}
            onPress={() => onSelect(option)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownItemText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// CustomTextInput Component
const CustomTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  multiline,
  numberOfLines,
  hint,
  error,
}) => (
  <View>
    <Text style={styles.label}>
      {label} {required && <Text style={styles.required}>*</Text>}
    </Text>
    <TextInput
      style={[
        styles.input,
        multiline && styles.textArea,
        error && styles.inputError,
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical={multiline ? "top" : "center"}
    />
    {hint && <Text style={styles.hint}>{hint}</Text>}
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// SampleTable Component
const SampleTable = ({ data }) => (
  <View style={styles.tableContainer}>
    <View style={styles.tableHeader}>
      <View style={[styles.tableHeaderCell, styles.nameColumn]}>
        <Text style={styles.tableHeaderText}>Name</Text>
      </View>
      <View style={[styles.tableHeaderCell, styles.emailColumn]}>
        <Text style={styles.tableHeaderText}>Email</Text>
      </View>
      <View style={[styles.tableHeaderCell, styles.mobileColumn]}>
        <Text style={styles.tableHeaderText}>Mobile</Text>
      </View>
    </View>

    {data.map((row, index) => (
      <View
        key={index}
        style={[
          styles.tableRow,
          index === data.length - 1 && styles.lastTableRow,
        ]}
      >
        <View style={[styles.tableCell, styles.nameColumn]}>
          <Text style={styles.tableCellText}>{row.name}</Text>
        </View>
        <View style={[styles.tableCell, styles.emailColumn]}>
          <Text style={styles.tableCellText}>{row.email}</Text>
        </View>
        <View style={[styles.tableCell, styles.mobileColumn]}>
          <Text style={styles.tableCellText}>{row.mobile}</Text>
        </View>
      </View>
    ))}
  </View>
);

// PreviewCard Component
const PreviewCard = ({
  mailSubject,
  displayName,
  message,
  selectedFile,
  sampleMailText
}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Preview</Text>

    <View style={styles.previewItem}>
      <Text style={styles.previewLabel}>Mail Subject:</Text>
      <Text style={styles.previewText}>{mailSubject || "-"}</Text>
    </View>

    <View style={styles.previewItem}>
      <Text style={styles.previewLabel}>Mail Display Name:</Text>
      <Text style={styles.previewText}>{displayName || "-"}</Text>
    </View>

    <View style={styles.previewItem}>
      <Text style={styles.previewLabel}>Message:</Text>
      <Text style={styles.previewText}>{message || "-"}</Text>
    </View>
    
      <View style={styles.previewItem}>
      <Text style={styles.previewLabel}>Sample Email:</Text>
      <Text style={styles.previewText}>{sampleMailText || "-"}</Text>
    </View>

    <View style={styles.previewItem}>
      <Text style={styles.previewLabel}>File:</Text>
      <Text style={styles.previewText}>
        {selectedFile ? selectedFile.name : "No file selected"}
      </Text>
    </View>

    <Text style={styles.previewNote}>
      This preview shows how the email content will appear.
    </Text>
  </View>
);

// LoadingButton Component
const LoadingButton = ({ title, onPress, loading, disabled }) => (
  <TouchableOpacity
    style={[
      styles.sendButton,
      (loading || disabled) && styles.sendButtonDisabled,
    ]}
    onPress={onPress}
    activeOpacity={0.8}
    disabled={loading || disabled}
  >
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.sendButtonText}>{title}</Text>
    )}
  </TouchableOpacity>
);

// ==================== MAIN COMPONENT ====================

const BulkInvite = () => {
  const myDynamicAgentUrl =
    "https://www.askoxy.ai/asst_8HQ35SXOFzofo6Ox2Kq8b5gl/434f3067-d4da-43b5-bf1c-1e0675b9235f/Epiclife%20guide";

  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;

  // Form States
  const [inviteType, setInviteType] = useState("");
  const [mailSubject, setMailSubject] = useState(
    "ASKOXY AI – Invitation to Join Our AI-Powered Platform"
  );
  const [message, setMessage] = useState(
    `I'm already using ASKOXY.AI, and I'm really impressed with the platform — smooth user experience, intelligent insights, and powerful tools that help simplify decisions.\n\nThey've also introduced new AI-driven features that make the platform even more useful in everyday tasks. I'd love for you to join using my referral link and explore the benefits yourself.\n\nJoin using my referral link: https://www.askoxy.ai/whatsappregister?referralCode=${customerId}\n\nFeel free to reach out once you join!`
  );
  const [displayName, setDisplayName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sampleMailText, setSampleMailText] = useState("");

  // UI States
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Error States
  const [errors, setErrors] = useState({});

  const inviteTypes = ["Sample Mail", "Non Sample Mail"];

  const sampleData = [
    { name: "John Doe", email: "test1@email.com", mobile: "9876543210" },
    { name: "Jane Smith", email: "test2@email.com", mobile: "9988776655" },
  ];

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!inviteType) {
      newErrors.inviteType = "Please select an invite type";
    }

    if (!selectedFile) {
      newErrors.file = "Please select an Excel file";
    }

    if (!mailSubject.trim()) {
      newErrors.mailSubject = "Mail subject is required";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    }

    if (inviteType === "Sample Mail") {
      if (!sampleMailText.trim()) {
        newErrors.sampleMail = "Sample Email  is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sampleMailText)) {
          newErrors.sampleMail = "Please enter a valid email address";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  // File Upload Handler
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        Alert.alert("Error", "File size must be less than 10MB");
        return;
      }

      // Validate file extension
      const validExtensions = [".xlsx", ".xls"];
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));
      if (!validExtensions.includes(fileExtension.toLowerCase())) {
        Alert.alert("Error", "Please select a valid Excel file (.xlsx or .xls)");
        return;
      }

      setSelectedFile({
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
      });

      clearError("file");
      Alert.alert("Success", `File selected: ${file.name}`);
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to select file. Please try again.");
    }
  };

  // Download Sample Handler
  const handleDownloadSample = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);

      const worksheet = XLSX.utils.json_to_sheet(sampleData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sample Data");

      const excelFile = XLSX.write(workbook, {
        type: "base64",
        bookType: "xlsx",
      });

      const filePath = FileSystem.documentDirectory + "BulkInvite_Sample.xlsx";

      await FileSystem.writeAsStringAsync(filePath, excelFile, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath);
        Alert.alert("Success", "Sample file downloaded successfully");
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error downloading sample:", error);
      Alert.alert("Error", "Failed to download sample file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Send Invite Handler
  const handleSendInvite = async () => {
    if (!validateForm()) {
      // Alert.alert("Validation Error", "Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("multiPart", {
        uri: selectedFile.uri,
        type:
          selectedFile.mimeType ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        name: selectedFile.name,
      });

      formData.append("inviteType", inviteType);
      formData.append("mailSubject", mailSubject.trim());
      formData.append("message", message.trim());
      formData.append("mailDispalyName", displayName.trim());
      formData.append("userId", customerId);
      formData.append("sampleEmail", sampleMailText.trim());

      const response = await fetch(
        `https://meta.oxyloans.com/api/user-service/excelInvite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success",
          result.message || "Bulk invites sent successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset form
                setSelectedFile(null);
                setInviteType("");
                setDisplayName("");
                setSampleMailText("");
                setErrors({});
              },
            },
          ]
        );
      } else {
        const errorMessage =
          result.message ||
          result.error ||
          "Failed to send invites. Please try again.";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Error sending invites:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.message === "Network request failed") {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        {/* <AskOxyAgentWidget agentUrl={myDynamicAgentUrl} /> */}
        <Text style={styles.title}>Bulk Invite</Text>
        <Text style={styles.subtitle}>
          Upload an Excel file and send personalized invitations in one go
        </Text>
      </View>

      {/* Excel Format Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>Excel Upload Format</Text>
            <Text style={styles.formatDescription}>
              Your Excel must include the following columns:
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.downloadButton,
              isDownloading && styles.downloadButtonDisabled,
            ]}
            onPress={handleDownloadSample}
            activeOpacity={0.7}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.downloadButtonText}>Download Sample</Text>
            )}
          </TouchableOpacity>
        </View>

        <SampleTable data={sampleData} />
      </View>

      {/* Form Card */}
      <View style={styles.card}>
        <Text style={styles.label}>
          Excel File <Text style={styles.required}>*</Text>
        </Text>
        <FileUploadButton
          selectedFile={selectedFile}
          onPress={handleFileUpload}
          error={errors.file}
        />

        <CustomDropdown
          label="Invite Type"
          value={inviteType}
          options={inviteTypes}
          placeholder="Select Type"
          onSelect={(type) => {
            setInviteType(type);
            setShowTypeDropdown(false);
            clearError("inviteType");
          }}
          isOpen={showTypeDropdown}
          onToggle={() => setShowTypeDropdown(!showTypeDropdown)}
          required
          error={errors.inviteType}
        />

        <CustomTextInput
          label="Mail Subject"
          value={mailSubject}
          onChangeText={(text) => {
            setMailSubject(text);
            clearError("mailSubject");
          }}
          placeholder="Enter mail subject"
          required
          multiline
          error={errors.mailSubject}
        />

        <CustomTextInput
          label="Message"
          value={message}
          onChangeText={(text) => {
            setMessage(text);
            clearError("message");
          }}
          placeholder="Enter your message"
          required
          multiline
          numberOfLines={6}
          hint="Use {{referral_link}} to include user's referral."
          error={errors.message}
        />

        <CustomTextInput
          label="Mail Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter display name"
        />

        {inviteType === "Sample Mail" && (
          <View>
            <Text style={styles.label}>
              Sample Mail Content <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.sampleMail && styles.inputError]}
              placeholder="Enter Sample Mail Content"
              value={sampleMailText}
              onChangeText={(text) => {
                setSampleMailText(text);
                clearError("sampleMail");
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.sampleMail && (
              <Text style={styles.errorText}>{errors.sampleMail}</Text>
            )}
          </View>
        )}

        <LoadingButton
          title="Send Bulk Invite"
          onPress={()=>handleSendInvite()}
          loading={loading}
        />
      </View>

      {/* Preview Card */}
      <PreviewCard
        mailSubject={mailSubject}
        displayName={displayName}
        message={message}
        selectedFile={selectedFile}
        sampleMailText={sampleMailText}
      />
    </ScrollView>
  );
};

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  formatDescription: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  downloadButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 120,
    alignItems: "center",
  },
  downloadButtonDisabled: {
    backgroundColor: "#93c5fd",
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableHeaderCell: {
    padding: 12,
    justifyContent: "center",
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  lastTableRow: {
    borderBottomWidth: 0,
  },
  tableCell: {
    padding: 12,
    justifyContent: "center",
  },
  tableCellText: {
    fontSize: 13,
    color: "#374151",
  },
  nameColumn: {
    flex: 2,
  },
  emailColumn: {
    flex: 2.5,
  },
  mobileColumn: {
    flex: 1.8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  hint: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    marginTop: 4,
  },
  fileButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#fff",
  },
  fileButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fileButtonText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
  },
  fileButtonSubtext: {
    fontSize: 12,
    color: "#9ca3af",
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  placeholderText: {
    color: "#9ca3af",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#6b7280",
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 24,
  },
  sendButtonDisabled: {
    backgroundColor: "#93c5fd",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  previewItem: {
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  previewText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
  previewNote: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
    marginTop: 8,
  },
});

export default BulkInvite;