import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { isWithin, getCoordinates } from "./LocationService";
import { COLORS } from "../../../../Redux/constants/theme";
import BASE_URL, { userStage } from "../../../../Config";
import { useSelector } from "react-redux";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
const NewAddressBook = ({ navigation }) => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  // console.log("from mylocationpage", route.params);
  // const [locationData, setLocationData] = useState(route.params);
  const [coordinates, setCoordinates] = useState(null);
  const [isWithinStatus, setIsWithinStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAreaEditable, setIsAreaEditable] = useState(true);
  const [areaLoading, setAreaLoading] = useState(false);
  const [selectedHouseType, setSelectedHouseType] = useState(null);
  const [addressDetails, setAddressDetails] = useState({
    houseNo: "",
    area: "",
    landmark: "",
    fullAddress: "",
    pincode: "",
    addressLabel: "Home",
    houseType: "",
    houseTypeName: "",
  });

  const [errors, setErrors] = useState({});

  const [areaOptions, setAreaOptions] = useState([]);

  const houseTypes = [
    "apartment",
    "villa",
    "pg",
    "gatedCommunity",
    "individualHouse",
  ];

  const houseTypeOptions = houseTypes.map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type,
  }));

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
        }
      } else {
        setAreaOptions([]);
        setIsAreaEditable(true);
      }
    };

    fetchAreaByPincode();
  }, [addressDetails.pincode]);

  const validateForm = () => {
    const newErrors = {};
    console.log("selectedHouseType", selectedHouseType);
  
    const capitalizedType = selectedHouseType
      ? selectedHouseType.charAt(0).toUpperCase() + selectedHouseType.slice(1)
      : "";
  
    if (!addressDetails.houseTypeName || !addressDetails.houseTypeName.trim()) {
      console.log("❌ houseTypeName is missing or empty");
      newErrors.houseTypeName = `${capitalizedType} Name is required`;
    }
  
    if (!addressDetails.houseNo || !addressDetails.houseNo.trim()) {
      console.log("❌ houseNo is missing or empty");
      newErrors.houseNo = `${capitalizedType} Number is required`;
    }
    
  
    if (!addressDetails.area || !addressDetails.area.toString().trim()) {
      console.log("❌ area is missing or empty");
      newErrors.area = "Area is required";
    }
  
    if (!addressDetails.landmark || !addressDetails.landmark.trim()) {
      console.log("❌ landmark is missing or empty");
      newErrors.landmark = "Landmark is required";
    }
  
    if (!addressDetails.fullAddress || !addressDetails.fullAddress.trim()) {
      console.log("❌ fullAddress is missing or empty");
      newErrors.fullAddress = "Full Address is required";
    }
  
    if (!addressDetails.pincode || !addressDetails.pincode.trim()) {
      console.log("❌ pincode is missing");
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(addressDetails.pincode.trim())) {
      console.log("❌ pincode format is invalid");
      newErrors.pincode = "Pincode must be 6 digits";
    }
  
    if (!addressDetails.houseType) {
      console.log("❌ houseType is missing");
      newErrors.houseType = "House Type is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSaveAddress = async () => {
    console.log("Saving address...");
    const isValid = validateForm();
    console.log("Form validation result:", isValid);
    if (!isValid) return;
    console.log("Address details before saving:", addressDetails);
    const value = `${addressDetails.houseNo}, ${addressDetails.area}, ${addressDetails.landmark}, ${addressDetails.fullAddress}, ${addressDetails.pincode}`;
    console.log("value for saving api", value);
    const { status, isWithin, distanceInKm, coord1 } = await getCoordinates(
      value
    );
    console.log("distanceInKm", distanceInKm);
    
    console.log("savingggggg address");
    console.log({ isWithin });
    console.log({ coord1 });

    if (isWithin && coord1) {
      console.log("Address saved as it is within the radius.");
      setLoading(true);
      try {
        const url = BASE_URL + "user-service/addAddress";

        const payload = {
          address: addressDetails.fullAddress,
          addressType: addressDetails.addressLabel,
          userId: customerId,
          flatNo: addressDetails.houseNo,
          landMark: addressDetails.landmark,
          latitude: coord1.latitude,
          longitude: coord1.longitude,
          pincode: addressDetails.pincode,
          area: addressDetails.area,
          houseType: addressDetails.houseType,
          residenceName: addressDetails.houseTypeName,
        };
        console.log("Payload for saving address:", payload);
        const config = {
          method: "post",
          url: url,
          data: payload,
        };

        const response = await axios(config);

        console.log("Added address:", response.data);
        Alert.alert("Success", "Address Saved Successfully", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Ok",
            onPress: () => navigation.navigate("Address Book"),
          },
        ]);

        setAddressDetails({
          houseNo: "",
          area: "",
          landmark: "",
          fullAddress: "",
          pincode: "",
          addressLabel: "Home",
          houseType: "",
          houseTypeName: "",
          
        });
        setSelectedHouseType(null);

        setCoordinates(null);
        setIsWithinStatus(false);
      } catch (error) {
        console.error(
          "Error adding address:",
          error.response?.data || error.message || error
        );
        Alert.alert("Failed to save address. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Address not saved as it is outside the radius.");
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
    }
  };

  const setAddressLabel = (label) => {
    setAddressDetails({ ...addressDetails, addressLabel: label });
  };

 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView style={styles.formContainer}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Add Address</Text>

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
                    selectedHouseType.slice(1)}{" "}
                  Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.landmark]}
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
                    selectedHouseType.slice(1)}{" "}
                  No <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.houseNo]}
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
          {/* *********************************************************** */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Landmark <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.landmark]}
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
              style={[styles.addressInput, errors.fullAddress]}
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
              style={[styles.input, errors.pincode]}
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
              <Text>Area</Text>

              {areaLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#4B0082"
                  style={{ marginTop: 10 }}
                />
              ) : !isAreaEditable ? (
                <Dropdown
                  style={{
                    height: 40,
                    borderWidth: 1,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}
                  data={areaOptions}
                  labelField="label"
                  valueField="value"
                  value={addressDetails?.area }
                   onChange={(item) => {
                    console.log(item);
                    setAddressDetails((prev) => ({
                      ...prev,
                      area: item.value,
                    }));
                    setErrors((prev) => ({ ...prev, area: "" }));
                  }}
                  placeholder="Select Area"
                  placeholderStyle={{ color: "#B4B4B4" }}
                  itemTextStyle={{ color: "#000" }}
                  selectedTextStyle={{ color: "#000" }}
                  iconStyle={{ width: 20, height: 20 }}
                  maxHeight={150}
                  scrollEnabled={true}
                  mode="modal"
                />
              ) : (
                // Show TextInput if editable
                <TextInput
                  style={{
                    height: 40,
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}
                  placeholder="Enter area name"
                  value={addressDetails.area}
                  onChangeText={(text) =>{
                    setAddressDetails((prev) => ({
                      ...prev,
                      area: text,
                     }))
                    setErrors((prev) => ({ ...prev, area: "" }));
                  }}
                />
              )}

              {errors.area && (
                <Text style={{ color: "red" }}>{errors.area}</Text>
              )}
            </View>
          )}
        </View>

        {/* Address Label */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Add Address Label</Text>
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
                  addressDetails.addressLabel === "Home" ? "#4a90e2" : "#555"
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
                  addressDetails.addressLabel === "Work" ? "#4a90e2" : "#555"
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
                  addressDetails.addressLabel === "Other" ? "#4a90e2" : "#555"
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
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSaveAddress()}
          disabled={loading} 
        >
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>SAVE ADDRESS</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  formContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  locationPreview: {
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  locationIcon: {
    marginRight: 10,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 0.8,
  },
  required: {
    color: "#e74c3c",
  },
  input: {
    backgroundColor: "#f5f7fa",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  addressInput: {
    backgroundColor: "#f5f7fa",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e7ff",
    height: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: 5,
  },
  dropdownButton: {
    backgroundColor: "#f5f7fa",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e7ff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownSelectedText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  labelButton: {
    borderWidth: 1,
    borderColor: "#e0e7ff",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  labelButtonActive: {
    borderColor: "#4a90e2",
    backgroundColor: "#f0f7ff",
  },
  labelText: {
    fontSize: 14,
    color: "#555",
  },
  labelTextActive: {
    color: "#4a90e2",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: COLORS.services,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 24,
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    maxHeight: "70%",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  dropdownItem: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  required: {
    color: "red",
  },
});

export default NewAddressBook;
