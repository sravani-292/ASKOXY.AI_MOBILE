import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { isWithin, getCoordinates } from "./LocationService";
import { useSelector } from "react-redux";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import BASE_URL, { userStage } from "../../../../Config";

const UpdateOrderAddressScreen = ({ navigation, route }) => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  console.log("order address", route.params.orderAddress);
  console.log("order id", route.params.order_id);
  const order_id = route.params?.order_id;

  const houseTypes = [
    "apartment",
    "villa",
    "pg",
    "gatedCommunity",
    "individualHouse",
  ];

  // Get the current address data from navigation params
  const orderAddress = route?.params?.orderAddress || {
    address: "123 Main Street, Downtown Area",
    addressType: "Home",
    flatNo: "A-204",
    landMark: "Near City Mall",
    pincode: 500001,
    latitude: "",
    longitude: "",
    area: "",
    residenceType: "",
    residenceName: "",
  };

  // Form state for address details
  const [addressDetails, setAddressDetails] = useState({
    houseType: "",
    houseTypeName: "",
    houseNo: "",
    landmark: "",
    fullAddress: "",
    pincode: "",
    area: "",
    addressLabel: "Home",
  });

  const [selectedHouseType, setSelectedHouseType] = useState("");
  const [areaOptions, setAreaOptions] = useState([]);
  const [areaLoading, setAreaLoading] = useState(false);
  const [isAreaEditable, setIsAreaEditable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with existing data
  useEffect(() => {
    setAddressDetails({
      houseType: orderAddress.houseType || "",
      houseTypeName: orderAddress.residenceName || "",
      houseNo: orderAddress.flatNo || "",
      landmark: orderAddress.landMark || "",
      fullAddress: orderAddress.address || "",
      pincode: orderAddress.pincode ? orderAddress.pincode.toString() : "",
      area: orderAddress.area || "",
      addressLabel: orderAddress.addressType || "Home",
    });
    setSelectedHouseType(orderAddress.houseType || "");
  }, [orderAddress]);

  const houseTypeOptions = houseTypes.map((type) => ({
    label:
      type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, " $1"),
    value: type,
  }));

  // Fetch area by pincode
  useEffect(() => {
    const fetchAreaByPincode = async () => {
      if (addressDetails.pincode.length === 6) {
        setAreaLoading(true);
        try {
          const res = await axios.get(
            `https://api.postalpincode.in/pincode/${addressDetails.pincode}`
          );
          const result = res.data[0];
          setAreaLoading(false);
          if (result.Status === "Success" && result.PostOffice.length > 0) {
            const areaNames = result.PostOffice.map((post) => post.Name);
            console.log("Area names:", areaNames);
            const areaNamesWithDistrict = areaNames.map((area) => ({
              label: area,
              value: area,
            }));
            console.log("Area names with district:", areaNamesWithDistrict);

            setAreaOptions(areaNamesWithDistrict);
            setIsAreaEditable(false);
          } else {
            setAreaOptions([]);
            setIsAreaEditable(true);
            Alert.alert("Invalid Pincode", "No area found for this pincode.");
          }
        } catch (error) {
          console.error("Error fetching area:", error);
          Alert.alert("Error", "Unable to fetch area for the entered pincode.");
          setIsAreaEditable(true);
          setAreaLoading(false);
        }
      } else {
        setAreaOptions([]);
        setIsAreaEditable(true);
      }
    };

    fetchAreaByPincode();
  }, [addressDetails.pincode]);

  const setAddressLabel = (label) => {
    setAddressDetails((prev) => ({
      ...prev,
      addressLabel: label,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!addressDetails.fullAddress.trim()) {
      newErrors.fullAddress = "Full address is required";
    }

    if (!addressDetails.pincode || addressDetails.pincode.length !== 6) {
      newErrors.pincode = "Valid 6-digit pincode is required";
    }

    if (!addressDetails.landmark.trim()) {
      newErrors.landmark = "Landmark is required";
    }

    if (selectedHouseType) {
      if (!addressDetails.houseTypeName.trim()) {
        newErrors.houseTypeName = `${selectedHouseType} name is required`;
      }
      if (!addressDetails.houseNo.trim()) {
        newErrors.houseNo = `${selectedHouseType} number is required`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
  if (!validateForm()) return;

  const fullAddress = `${addressDetails.houseNo}, ${addressDetails.area}, ${addressDetails.landmark}, ${addressDetails.fullAddress}, ${addressDetails.pincode}`;

  try {
    const { status, isWithin, distanceInKm, coord1 } = await getCoordinates(fullAddress);
    console.log("Geolocation check:", { status, isWithin, distanceInKm, coord1 });
    console.log("coord1",coord1);
    
    if (!isWithin || !coord1) {
      // Alert.alert("Error", "This address is outside our delivery area.");
      return;
    }

    setLoading(true);

    const updatedAddressData = {
      address: addressDetails.fullAddress,
      flatNo: addressDetails.houseNo,
      landMark: addressDetails.landmark,
      pincode: parseInt(addressDetails.pincode),
      area: addressDetails.area,
      houseType: selectedHouseType || "",
      residenceName: addressDetails.houseTypeName || "",
      latitude: coord1.latitude,
      longitude: coord1.longitude,
      orderId: order_id,
    };

    console.log("Payload for address update:", updatedAddressData);

    const response = await axios.patch(
      BASE_URL + "order-service/orderAddressUpdate",
      updatedAddressData
    );

    console.log("Update response:", response);

    Alert.alert("Success", "Address updated successfully!", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  } catch (error) {
    console.error("Error updating address:", error);
     setAddressDetails({
        houseNo: "",
        area: "",
        landmark: "",
        fullAddress: "",
        pincode: "",
        addressLabel: "Home",
        houseType: "",
        houseTypeName:"",
      });
      setSelectedHouseType(null);
    Alert.alert("Error", "Failed to update address. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView style={styles.formContainer}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Update Address</Text>

          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#333",
                marginBottom: 8,
              }}
            >
              Residence Type <Text style={{ color: "red" }}>*</Text>
            </Text>

            <Dropdown
              style={{
                height: 48,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                paddingHorizontal: 12,
                backgroundColor: "#fff",
                justifyContent: "center",
              }}
              data={houseTypeOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Residence Type"
              placeholderStyle={{ color: "#999", fontSize: 14 }}
              itemTextStyle={{ color: "#000", fontSize: 14 }}
              selectedTextStyle={{ color: "#000", fontSize: 14 }}
              value={selectedHouseType}
              onChange={(item) => {
                setSelectedHouseType(item.value);
                setAddressDetails((prev) => ({
                  ...prev,
                  houseType: item.value,
                }));
                setErrors((prev) => ({ ...prev, houseType: "" }));
              }}
              maxHeight={150}
              mode="modal"
              iconStyle={{ width: 20, height: 20, tintColor: "#555" }}
            />
          </View>

          {selectedHouseType && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {selectedHouseType.charAt(0).toUpperCase() +
                    selectedHouseType.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                  Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.houseTypeName && styles.inputError,
                  ]}
                  placeholder={`Enter ${selectedHouseType} Name`}
                  value={addressDetails.houseTypeName}
                  onChangeText={(text) => {
                    setAddressDetails({
                      ...addressDetails,
                      houseTypeName: text,
                    });
                    setErrors((prev) => ({ ...prev, houseTypeName: "" }));
                  }}
                />
                {errors.houseTypeName && (
                  <Text style={styles.errorText}>{errors.houseTypeName}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {selectedHouseType.charAt(0).toUpperCase() +
                    selectedHouseType.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                  No <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.houseNo && styles.inputError]}
                  placeholder={`Enter ${selectedHouseType} Number`}
                  value={addressDetails.houseNo}
                  onChangeText={(text) => {
                    setAddressDetails({ ...addressDetails, houseNo: text });
                    setErrors((prev) => ({ ...prev, houseNo: "" }));
                  }}
                />
                {errors.houseNo && (
                  <Text style={styles.errorText}>{errors.houseNo}</Text>
                )}
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Landmark <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.landmark && styles.inputError]}
              placeholder="Enter Landmark"
              value={addressDetails.landmark}
              onChangeText={(text) => {
                setAddressDetails({ ...addressDetails, landmark: text });
                setErrors((prev) => ({ ...prev, landmark: "" }));
              }}
            />
            {errors.landmark && (
              <Text style={styles.errorText}>{errors.landmark}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Full Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.addressInput,
                errors.fullAddress && styles.inputError,
              ]}
              placeholder="Enter complete address"
              value={addressDetails.fullAddress}
              onChangeText={(text) => {
                setAddressDetails({ ...addressDetails, fullAddress: text });
                setErrors((prev) => ({ ...prev, fullAddress: "" }));
              }}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
            {errors.fullAddress && (
              <Text style={styles.errorText}>{errors.fullAddress}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Pincode <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.pincode && styles.inputError]}
              placeholder="Enter Pincode"
              value={addressDetails.pincode}
              onChangeText={(text) => {
                setAddressDetails({ ...addressDetails, pincode: text });
                setErrors((prev) => ({ ...prev, pincode: "" }));
              }}
              keyboardType="numeric"
              maxLength={6}
            />
            {errors.pincode && (
              <Text style={styles.errorText}>{errors.pincode}</Text>
            )}
          </View>

          {addressDetails.pincode.length === 6 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.inputLabel}>Area</Text>

              {areaLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#4B0082"
                  style={{ marginTop: 10 }}
                />
              ) : !isAreaEditable ? (
                <Dropdown
                  style={{
                    height: 48,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    marginTop: 8,
                  }}
                  data={areaOptions}
                  labelField="label"
                  valueField="value"
                  value={addressDetails?.area}
                  onChange={(item) => {
                    console.log(item);
                    setAddressDetails((prev) => ({
                      ...prev,
                      area: item.value,
                    }));
                    setErrors((prev) => ({ ...prev, area: "" }));
                  }}
                  placeholder="Select Area"
                  placeholderStyle={{ color: "#999", fontSize: 14 }}
                  itemTextStyle={{ color: "#000", fontSize: 14 }}
                  selectedTextStyle={{ color: "#000", fontSize: 14 }}
                  iconStyle={{ width: 20, height: 20, tintColor: "#555" }}
                  maxHeight={150}
                  scrollEnabled={true}
                  mode="modal"
                />
              ) : (
                <TextInput
                  style={[styles.input, { marginTop: 8 }]}
                  placeholder="Enter area name"
                  value={addressDetails.area}
                  onChangeText={(text) => {
                    setAddressDetails((prev) => ({
                      ...prev,
                      area: text,
                    }));
                    setErrors((prev) => ({ ...prev, area: "" }));
                  }}
                />
              )}

              {errors.area && (
                <Text style={styles.errorText}>{errors.area}</Text>
              )}
            </View>
          )}
        </View>

        {/* Address Label */}
        {/* <View style={styles.card}>
          <Text style={styles.sectionTitle}>Address Label</Text>
          <View style={styles.labelContainer}>
            <TouchableOpacity
              style={[
                styles.labelButton,
                addressDetails.addressLabel === "Home" &&
                  styles.labelButtonActive,
              ]}
              onPress={() => setAddressLabel("Home")}
            >
              <Ionicons
                name="home-outline"
                size={16}
                color={
                  addressDetails.addressLabel === "Home" ? "#4B0082" : "#555"
                }
              />
              <Text
                style={[
                  styles.labelText,
                  addressDetails.addressLabel === "Home" &&
                    styles.labelTextActive,
                ]}
              >
                {" "}
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.labelButton,
                addressDetails.addressLabel === "Work" &&
                  styles.labelButtonActive,
              ]}
              onPress={() => setAddressLabel("Work")}
            >
              <Ionicons
                name="briefcase-outline"
                size={16}
                color={
                  addressDetails.addressLabel === "Work" ? "#4B0082" : "#555"
                }
              />
              <Text
                style={[
                  styles.labelText,
                  addressDetails.addressLabel === "Work" &&
                    styles.labelTextActive,
                ]}
              >
                {" "}
                Work
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.labelButton,
                addressDetails.addressLabel === "Other" &&
                  styles.labelButtonActive,
              ]}
              onPress={() => setAddressLabel("Other")}
            >
              <Ionicons
                name="bookmark-outline"
                size={16}
                color={
                  addressDetails.addressLabel === "Other" ? "#4B0082" : "#555"
                }
              />
              <Text
                style={[
                  styles.labelText,
                  addressDetails.addressLabel === "Other" &&
                    styles.labelTextActive,
                ]}
              >
                {" "}
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}

        <TouchableOpacity
          style={[styles.saveButton, { margin: 16 }]}
          onPress={() => handleSaveAddress()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>UPDATE ADDRESS</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#FF3B30",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  addressInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 4,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "#fff",
  },
  labelButtonActive: {
    borderColor: "#4B0082",
    backgroundColor: "#f0f8ff",
  },
  labelText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  labelTextActive: {
    color: "#4B0082",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4B0082",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UpdateOrderAddressScreen;
