import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
} from "react-native";
import BASE_URL from "../../../../Config";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function KycCreationModal({ visible, onClose }: Props) {
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [pan, setPan] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

   const userData = useSelector((state:any) => state.counter);
  //  console.log({userData})
    const token = userData?.accessToken;
    const userId = userData?.userId;

  useEffect(() => {
    if (visible) getVendorId();
  }, [visible]);

  const getVendorId = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}ai-service/vendorDetails?userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) return;

      if (data.vendorId) {
        const statusRes = await fetch(
          `${BASE_URL}ai-service/getVendorStatus?vendorId=${data.vendorId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const statusData = await statusRes.json();
        if (statusRes.ok) {
          if (statusData.status !== "BANK_VALIDATION_FAILED") {
            setAccountHolder(statusData?.bank?.account_holder || "");
            setAccountNumber(statusData?.bank?.account_number || "");
            setIfsc(statusData?.bank?.ifsc || "");
            const panDoc = statusData?.related_docs?.find(
              (d: any) => d.doc_name === "PAN"
            );
            setPan(panDoc?.doc_value || "");
          } else {
            setRemarks(statusData?.remarks || "");
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const validateFields = () => {
    const err: any = {};
    if (!accountHolder) err.accountHolder = "Account holder name is required";
    if (!/^[0-9]{8,20}$/.test(accountNumber))
      err.accountNumber = "Invalid account number";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc))
      err.ifsc = "Invalid IFSC code";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan))
      err.pan = "Invalid PAN number";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    setLoading(true);

    try {
      const body = {
        bank: {
          account_holder: accountHolder,
          account_number: accountNumber,
          ifsc,
        },
        dashboard_access: true,
        kyc_details: { pan },
        userId,
        verify_account: true,
      };

      const res = await fetch(`${BASE_URL}ai-service/createVendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();
      Alert.alert("Success", "Vendor KYC details captured");
      getVendorId();
    } catch {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Vendor Creation</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Account Holder Name</Text>
            <TextInput style={styles.input} value={accountHolder} onChangeText={setAccountHolder} />
            {errors.accountHolder && <Text style={styles.error}>{errors.accountHolder}</Text>}

            <Text style={styles.label}>Account Number</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={accountNumber} onChangeText={setAccountNumber} />
            {errors.accountNumber && <Text style={styles.error}>{errors.accountNumber}</Text>}

            <Text style={styles.label}>IFSC Code</Text>
            <TextInput style={styles.input} value={ifsc} onChangeText={t => setIfsc(t.toUpperCase())} />

            <Text style={styles.label}>PAN Number</Text>
            <TextInput style={styles.input} value={pan} maxLength={10} onChangeText={t => setPan(t.toUpperCase())} />

            {remarks ? <Text style={styles.remarks}>{remarks}</Text> : null}

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Submitting..." : "Create Vendor"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.95,
    maxHeight: height * 0.9,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  close: { fontSize: 18 },
  container: { padding: 16 },
  label: { fontWeight: "600", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  error: { color: "red", fontSize: 12 },
  remarks: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#5856D6",
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
});
