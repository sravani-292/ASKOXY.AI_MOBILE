import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Dimensions
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useSelector } from "react-redux";
import { Ionicons } from "react-native-vector-icons";
import BASE_URL, { userStage } from "../../../../Config";
import { COLORS } from "../../../../Redux/constants/theme";

const {width, height} = Dimensions.get("window");

const AddressScreen = ({ route }) => {
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [newAddress, setNewAddress] = useState({
    customerId: customerId,
    flatNo: "",
    landMark: "",
    pincode: "",
    address: "",
    type: "",
    status: true,
  });

  useFocusEffect(
    useCallback(() => {
      fetchOrderAddress();
    }, [])
  );

  const validateFields = () => {
    const newErrors = {};
    if (!newAddress.flatNo) newErrors.flatNo = "Flat No is required.";
    if (!newAddress.landMark) newErrors.landMark = "Landmark is required.";
    if (!newAddress.pincode) newErrors.pincode = "Pincode is required.";
    else if (newAddress.pincode.length < 6)
      newErrors.pincode = "Pincode must be 6 digits.";
    if (!newAddress.address) newErrors.address = "Address is required.";
    if (!selectedType) newErrors.type = "Please select an address type.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = () => {
    setModalVisible(true);
  };

  const handleTypePress = (type) => {
    setSelectedType(type);
    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: null }));
    }
  };

  const fetchOrderAddress = async () => {
    setLoading(true);
    try {
      const response = await axios({
        url: BASE_URL + `user-service/getAllAdd?customerId=${customerId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("All addresss are :", response.data);

      if (response && response.data) {
        setAddressList(response.data);
      } else {
        console.warn("API returned empty or invalid data");
        setAddressList([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching order address data:", error);
      setLoading(false);
    }
  };

  const saveAddress = async () => {
    if (!validateFields()) {
      return;
    }
    setSaveLoader(true);

    try {
      const data = {
        method: "post",
        url: BASE_URL + "user-service/addAddress",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          address: newAddress.address,
          addressType: selectedType,
          userId: customerId,
          flatNo: newAddress.flatNo,
          landMark: newAddress.landMark,
          latitude: 0, // Default value since we're not checking distance
          longitude: 0, // Default value since we're not checking distance
          pincode: newAddress.pincode,
        },
      };
      console.log("data", data);

      const response = await axios(data);
      setSaveLoader(false);
      console.log("Added address:", response.data);
      Alert.alert("Address saved successfully");
      setModalVisible(false);
      setNewAddress({
        address: "",
        flatNo: "",
        landMark: "",
        pincode: "",
      });
      setSelectedType("");
      fetchOrderAddress();
    } catch (error) {
      console.error("Error adding address:", error);
      setSaveLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
              <Text style={styles.title}>Your Delivery Addresses</Text>
              <View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddAddress()}
                >
                  <Text style={styles.addButtonText}>Add +</Text>
                </TouchableOpacity>
              </View>

              {addressList.length > 0 ? (
                addressList
                  .slice(-4)
                  .reverse()
                  .map((address, index) => {
                    return (
                      <View key={index}>
                        <View style={styles.addressRow}>
                          <Text style={styles.addressText}>
                            <Text style={styles.label}>Address: </Text>
                            <Text style={styles.value}>{address.address}</Text>
                            {"\n"}
                            <Text style={styles.label}>Flat No: </Text>
                            <Text style={styles.value}>{address.flatNo}</Text>
                            {"\n"}
                            <Text style={styles.label}>Landmark: </Text>
                            <Text style={styles.value}>{address.landMark}</Text>
                            {"\n"}
                            <Text style={styles.label}>Address Type: </Text>
                            <Text style={styles.value}>
                              {address.addressType}
                            </Text>
                            {"\n"}
                            <Text style={styles.label}>Pincode: </Text>
                            <Text style={styles.value}>{address.pincode}</Text>
                            {"\n"}
                          </Text>
                        </View>
                      </View>
                    );
                  })
              ) : (
                <View style={styles.noDeliveryRow}>
                  <Text style={styles.noDeliveryText}>
                    No address found. Add a new address above.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            <View style={{ marginTop: 25 }}>
              <TextInput
                style={styles.input}
                placeholder="Flat No"
                value={newAddress.flatNo}
                onChangeText={(text) => {
                  setNewAddress((prev) => ({ ...prev, flatNo: text }));
                  if (errors.flatNo) {
                    setErrors((prev) => ({ ...prev, flatNo: null }));
                  }
                }}
              />
              {errors.flatNo && (
                <Text style={styles.errorText}>{errors.flatNo}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Landmark"
                value={newAddress.landMark}
                onChangeText={(text) => {
                  setNewAddress((prev) => ({ ...prev, landMark: text }));
                  if (errors.landMark) {
                    setErrors((prev) => ({ ...prev, landMark: null }));
                  }
                }}
              />
              {errors.landMark && (
                <Text style={styles.errorText}>{errors.landMark}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Address"
                value={newAddress.address}
                onChangeText={(text) => {
                  setNewAddress((prev) => ({ ...prev, address: text }));
                  if (errors.address) {
                    setErrors((prev) => ({ ...prev, address: null }));
                  }
                }}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Pincode"
                value={newAddress.pincode}
                onChangeText={(text) => {
                  setNewAddress((prev) => ({ ...prev, pincode: text }));
                  if (errors.pincode) {
                    setErrors((prev) => ({ ...prev, pincode: null }));
                  }
                }}
                keyboardType="numeric"
                maxLength={6}
              />
              {errors.pincode && (
                <Text style={styles.errorText}>{errors.pincode}</Text>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  selectedType === "Home" && styles.buttonSelected,
                ]}
                onPress={() => handleTypePress("Home")}
              >
                <Text style={styles.buttonText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  selectedType === "Work" && styles.buttonSelected,
                ]}
                onPress={() => handleTypePress("Work")}
              >
                <Text style={styles.buttonText}>Work</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  selectedType === "Others" && styles.buttonSelected,
                ]}
                onPress={() => handleTypePress("Others")}
              >
                <Text style={styles.buttonText}>Others</Text>
              </TouchableOpacity>
            </View>
            {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

            {saveLoader == false ? (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => saveAddress()}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.submitButton}>
                <ActivityIndicator size={"small"} color="white" />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 8,
    textAlign: "center",
  },
  addressRow: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 2,
    width:width*0.9,
    alignSelf:"center"
  },
  addressText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  noDeliveryRow: {
    padding: 12,
    alignItems: "center",
  },
  noDeliveryText: {
    fontSize: 14,
    color: "#6c757d",
  },
  addButton: {
    backgroundColor: COLORS.services,
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-end",
    margin: 5,
    marginRight: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 2,
    right: 4,
    margin: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.backgroundcolour,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonSelected: {
    backgroundColor: COLORS.services,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: COLORS.title,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 1,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    color: "#000",
  },
});

export default AddressScreen;