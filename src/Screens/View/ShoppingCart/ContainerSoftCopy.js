import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
const { width, height } = Dimensions.get("window");
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL, { userStage } from "../../../../Config";
import { Ionicons } from "react-native-vector-icons";
import { COLORS } from "../../../../Redux/constants/theme";
const ContainerSoftCopy = ({
  visible,
  hasWeight,
  onClose,
  addContainer,
  cartData,
  removeItem,
  itemToRemove,
}) => {
  // console.log({ hasWeight });
  // console.log({ cartData });

  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData?.userId;
  const mobileNumber = userData?.mobileNumber;
  console.log("mobilenumber",mobileNumber);

  const whatsappNumber = userData?.whatsappNumber;
  console.log("whatsappnumber",whatsappNumber);

  const [modalVisible, setModalVisible] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanA, setSelectedPlanA] = useState(false);
  const [selectedPlanB, setSelectedPlanB] = useState(false);
  const [numbersArray, setNumbersArray] = useState([]);
  const [currentMobile, setCurrentMobile] = useState("");
  const [numberToSend, setNumberToSend] = useState();
  const [loading, setLoading] = useState(false);
  const [isApiCalled, setIsApiCalled] = useState(false);

  const scaleValue = useRef(new Animated.Value(0)).current;

  const containerItemIds = [
    "53d7f68c-f770-4a70-ad67-ee2726a1f8f3",
    "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61",
  ];
  useEffect(() => {
    if (modalVisible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const handlePlanSelect = (plan) => {
    if (plan === "A") {
      setSelectedPlanA(!selectedPlanA);
    } else if (plan === "B") {
      const isTogglingOn = !selectedPlanB;
      setSelectedPlanB(isTogglingOn);
      if (isTogglingOn) {
        setNumbersArray([]);
        setCurrentMobile("");
      }
    }
  };

  const handleNext = () => {
     let numberToSend =
      mobileNumber ||
      (whatsappNumber &&
        (whatsappNumber.length === 13
          ? whatsappNumber.slice(3)
          : whatsappNumber));

    if (currentMobile.trim() === "") {
      Alert.alert("Please enter a mobile number.");
      return;
    }
    if (currentMobile.length < 10) {
      Alert.alert("Invalid number", "Please enter a valid mobile number.");
      return;
    }
    if (numbersArray.length >= 9) {
      Alert.alert(
        "Maximum limit reached",
        "You can only enter up to 9 mobile numbers."
      );
      return;
    }

    if (numbersArray.includes(currentMobile.trim())) {
      Alert.alert(
        "Duplicate number",
        "This mobile number has already been entered."
      );
      return;
    }
    console.log("current mobile number",currentMobile);
    
    if (currentMobile == numberToSend) {
      Alert.alert("Self Referral is not allowed");
      setCurrentMobile("")

      return;
    }

    const updatedNumbers = [...numbersArray, currentMobile.trim()];
    console.log("Updated Numbers:", updatedNumbers);
    setNumbersArray(updatedNumbers);
    setCurrentMobile("");

    if (updatedNumbers.length === 9) {
      Alert.alert("Limit reached", "You have entered 9 mobile numbers.");
    }
  };

  const handleSubmit = (numbersArray) => {
    console.log("Submitting Numbers:", numbersArray);

     let numberToSend =
      mobileNumber ||
      (whatsappNumber &&
        (whatsappNumber.length === 13
          ? whatsappNumber.slice(3)
          : whatsappNumber));

    let finalNumbersArray = [];

    if (selectedPlanB) {
      console.log({numbersArray});
      
      finalNumbersArray = [...numbersArray];
       if(currentMobile == numberToSend||numbersArray.includes(numberToSend)){
        Alert.alert("Self Referral is not allowed")
        setCurrentMobile("");
        return;
       }
      if (finalNumbersArray.length === 0 && currentMobile.trim() !== "") {
        finalNumbersArray.push(currentMobile.trim());
      }

      if (finalNumbersArray.length === 0) {
        Alert.alert(
          "Please enter at least one reference mobile number for Plan B."
        );
        return;
      }
    }

    setLoading(true);
    console.log("current mobile", currentMobile);
    console.log("mobileNumber check" , mobileNumber)
   

    console.log("numberToSend:", numberToSend);
    const itemIds = cartData.map((item) => item.itemId);
    setNumberToSend(numberToSend);
    const requestBody = {
      user_id: customerId,
      mobilenumber: numberToSend,
      referenceMobileNumbers: finalNumbersArray,
      created_at: new Date(),
      itemIds: itemIds,
    };

    if (selectedPlanA) {
      requestBody.plana = "YES";
    }
    if (selectedPlanB) {
      requestBody.planb = "YES";
    }

    console.log("Final requestBody:", requestBody);
    // Inside your API success callback
  
    const API_URL = BASE_URL + `reference-service/referenceoffer`;

    axios
      .post(API_URL, requestBody, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("API Response:", response);
         
        const alreadySaved = response.data?.alreadySavedReferences;
        const newlySaved = response.data?.newlySavedReferences;
        let message = "Reference offer saved successfully.";

        if (
          alreadySaved &&
          alreadySaved?.length > 0 &&
          newlySaved?.length > 0
        ) {
          const numbers = alreadySaved.join(", ");
          message = `The following numbers already exist: ${numbers}. Reference offer saved successfully.`;
        }

        Alert.alert("Success", message, [
          {
            text: "OK",
            onPress: () => {
              handleSuccess();
              // addContainer();
            },
          },
        ]);
        // selectedPlan(" ");
        setSelectedPlanA(" ");
        setSelectedPlanB(" ");
      })
      .catch((error) => {
        console.log("error", error);

        console.log("Error in API:", error?.response);
        if (error?.response?.status === 500) {
          Alert.alert("Error", "Error Occured. Please try again later.");
        }
        if (error?.response?.status === 400) {
          Alert.alert("Error", error.response.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
        setModalVisible(false);
         setIsApiCalled(true)

        // addContainer();
      });
  };

  const handleNo = () => {
    console.log({isApiCalled});
    
    if (isApiCalled) {
      setModalVisible(false);
      onClose();
      return;
    }
   else{
    
    
    const hasProgress =
      selectedPlanA ||
      selectedPlanB ||
      numbersArray.length > 0 ||
      currentMobile.trim().length > 0;

      console.log("has pregress",hasProgress);

    Alert.alert(
      hasProgress ? "Discard Changes?" : "Exit Without Proceeding?",
      hasProgress
        ? "You have already selected a plan or entered numbers. Are you sure you want to exit from this Offer?"
        : "You have not selected any plan. So free container will not be added",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ok",
          onPress: handleOk, // call the remove function
        },
      ]
    );
  }
  };

  const handleSuccess =()=>{
   onClose();
     setSelectedPlanA(false);
    setSelectedPlanB(false);
    setNumbersArray([]);
    setCurrentMobile("");
    setIsApiCalled(false)
  }

  
  const handleOk = () => {
   if (removeItem && itemToRemove ) {
     removeItem(itemToRemove); 
   }
   setModalVisible(false);
    onClose(); 
    setSelectedPlanA(false);
    setSelectedPlanB(false);
    setNumbersArray([]);
    setCurrentMobile("");
    setIsApiCalled(false)
  };



  const handleRemoveNumber = (indexToRemove) => {
    setNumbersArray((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, marginTop: 100 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.congratsText}>🎉 Congratulations! 🎉</Text>
              <Text style={styles.messageText}>
                You've Won a{" "}
                <Text style={styles.highlight}>
                  {parseInt(hasWeight) === 10
                    ? "20 kgs"
                    : parseInt(hasWeight) === 26
                    ? "35 kgs"
                    : `${hasWeight}`}{" "}
                  Container for FREE!
                </Text>
              </Text>
              <Text style={styles.title}>Choose a Plan:</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleNo}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.plansContainer}>
                <TouchableOpacity
                  style={[
                    styles.planOption,
                    selectedPlanA && styles.selectedPlan,
                  ]}
                  onPress={() => handlePlanSelect("A")}
                >
                  <View style={styles.radioSection}>
                    <View style={styles.radioCircle}>
                      {selectedPlanA && <View style={styles.selectedRb} />}
                    </View>
                    <Text style={styles.planTitle}>Plan A</Text>
                  </View>
                  <Text style={styles.radioText}>
                    Buy 9 bags during the next 3 years, and the container is
                    yours.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.planOption,
                    selectedPlanB && styles.selectedPlan,
                  ]}
                  onPress={() => handlePlanSelect("B")}
                >
                  <View style={styles.radioSection}>
                    <View style={styles.radioCircle}>
                      {selectedPlanB && <View style={styles.selectedRb} />}
                    </View>
                    <Text style={styles.planTitle}>Plan B</Text>
                  </View>
                  <Text style={styles.radioText}>
                    Refer 9 people, and when they buy their first bag, the
                    container is yours forever.
                  </Text>
                </TouchableOpacity>

                {((selectedPlanB && selectedPlanA) || selectedPlanB) &&
                  (currentMobile.trim().length > 9 ||
                    numbersArray.length > 0) && (
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginVertical: 10,
                      }}
                    >
                      {numbersArray.map((num, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#e0e0e0",
                            borderRadius: 20,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            margin: 5,
                          }}
                        >
                          <Text style={{ marginRight: 8 }}>{num}</Text>
                          <TouchableOpacity
                            onPress={() => handleRemoveNumber(index)}
                          >
                            <Text style={{ fontWeight: "bold", color: "red" }}>
                              ✕
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
              </View>

              {((selectedPlanB && selectedPlanA) || selectedPlanB) && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.title}>
                    Enter Mobile Number ({numbersArray.length}/9):
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter mobile number"
                    keyboardType="phone-pad"
                    value={currentMobile}
                    onChangeText={setCurrentMobile}
                    maxLength={10}
                  />
                  <View style={styles.buttonRow}>
                    {(currentMobile.trim().length > 9 ||
                      numbersArray.length > 0) && (
                      <>
                        <TouchableOpacity
                          style={styles.cancelButton1}
                          onPress={() => handleSubmit(numbersArray)}
                        >
                          {loading ? (
                            <ActivityIndicator color="#ffffff" />
                          ) : (
                            <Text style={styles.cancelButtonText}>
                              I’ll Refer Later
                            </Text>
                          )}
                        </TouchableOpacity>
                        {numbersArray.length < 9 ? (
                          <TouchableOpacity
                            style={styles.interestedButton}
                            onPress={handleNext}
                          >
                            <Text style={styles.interestedButtonText}>
                              Continue
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.interestedButton}
                            onPress={handleSubmit}
                          >
                            <Text style={styles.interestedButtonText}>
                              Submit
                            </Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </View>
                </View>
              )}
              {selectedPlanA && !selectedPlanB && (
                <View>
                  <Text style={styles.questionText}>
                    Do you want to own it?
                  </Text>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleNo}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.interestedButton}
                      onPress={() => handleSubmit()}
                    >
                      {loading ? (
                        <ActivityIndicator color="#ffffff" />
                      ) : (
                        <Text style={styles.interestedButtonText}>Yes</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    height: height - 300,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 1,
    textAlign: "center",
  },
  plansContainer: {
    marginBottom: 15,
  },
  planOption: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedPlan: {
    borderColor: "green",
    backgroundColor: "#eaffea",
  },
  radioSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "green",
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  radioText: {
    fontSize: 14,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skipText: {
    color: "red",
    fontWeight: "bold",
  },
  nextText: {
    color: "green",
    fontWeight: "bold",
    marginLeft: 250,
  },
  questionText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },

  cancelButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#f44336",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton1: {
    flex: 1,
    marginRight: 10,
    backgroundColor: COLORS.services,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  interestedButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  interestedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  disabledButtonText: {
    color: "#666666",
  },
  closeButton: {
    position: "absolute",
    top: -30,
    right: 0.5,
    zIndex: 10,
    padding: 6,
    borderRadius: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: 10,
  },
  messageText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  highlight: {
    fontWeight: "bold",
    color: "#ff6b00",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
});

export default ContainerSoftCopy;
