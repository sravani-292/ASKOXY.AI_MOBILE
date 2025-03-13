import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useCallback } from "react";
import axios from "axios";
// import { TextInput } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asktoken } from "../../Redux/action/index";
import BASE_URL, { userStage } from "../../Config";
const { height, width } = Dimensions.get("window");
import Icon from "react-native-vector-icons/Ionicons";
// import WhatsappLogin from "../../Authorization/WhatsappLogin";
import { useSelector } from "react-redux";

const Rudraksha = ({ navigation }) => {
  const userData = useSelector((state) => state.counter);
  // console.log({userData})
  const [modalVisible1, setModalVisible1] = useState(false);
  const [deliveryType, setDeliveryType] = useState(null);

  const [formData, setFormData] = useState({
    whatsappNumber: "",
    whatsappNumber_error: false,
    whatsappNumberValid_error: false,
    saltKey: "",
    mobileOtpSession: "",
    otp: "",
    otp_error: false,
    address: "",
    address_error: false,
    hidebtn: false,
    loading: false,
    saveaddressbtn: true,
  });
  function interestedfunc() {
    if (userData == null) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    } else {
      setModalVisible1(true);
    }
  }

  function saveaddress() {
    if (formData.address == "" || formData.address == null) {
      setFormData({ ...formData, address_error: true });
      return false;
    }
    let data = {
      address: formData.address,
      userId: userData.userId,
    };
    setFormData({ ...formData, loading: true });
    axios({
      method: "post",
      url: BASE_URL + "marketing-service/campgin/rudhrakshaDistribution",
      data: data,
    })
      .then((response) => {
        console.log(response.data);
        setFormData({
          ...formData,
          //  hidebtn: false,
          loading: false,
          saveaddressbtn: false,
        });
      })
      .catch((error) => {
        setFormData({ ...formData, loading: false });
        console.log("error", error);
      });
  }

  function recieveType(value) {
    console.log(value);
    setFormData({ ...formData, loading: true });

    axios({
      method: "post",
      url:
        userStage == "test"
          ? BASE_URL + "marketing-service/campgin/rudhrakshaDistribution"
          : BASE_URL + "auth-service/auth/rudhrakshaDistribution",
      data: {
        userId: userData.userId,
        deliveryType: value,
      },
    })
      .then((response) => {
        console.log(response.data);
        setFormData({
          ...formData,
          loading: false,
          saveaddressbtn: false,
          loading: false,
        });
        setModalVisible1(false);
        Alert.alert("Success", "Your details saved successfully!");
      })
      .catch((error) => {
        setFormData({ ...formData, loading: false });
        console.log("error", error.response);
      });
  }

  function getCall(){
    let data={
      userId: userData.userId
    }
    axios.post(BASE_URL+`marketing-service/campgin/allOfferesDetailsForAUser`,data)
    .then((response)=>{
      console.log(response.data)
      const hasFreeAI = response.data.some(item => item.askOxyOfers === "FREERUDRAKSHA");

  if (hasFreeAI) {
    // Alert.alert("Yes", "askOxyOfers contains FREEAI");
    setAlreadyInterested(true)
  } else {
    // Alert.alert("No","askOxyOfers does not contain FREEAI");
    setAlreadyInterested(false)
  }
    })
    .catch((error)=>{
      console.log(error.response)
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Rudraksha</Text>
      {/* <View>
          <Text style={styles.paragraph}>
            You already submitted your details. Please check below submitted
            details.
          </Text>
          <View style={styles.cardView}>
            <View style={styles.rowCard}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{Rudraksha?.address}</Text>
            </View>
            <View style={styles.rowCard}>
              <Text style={styles.label}>Delivery Type:</Text>
              <Text style={styles.value}>{Rudraksha?.deliveryType}</Text>
            </View>
            <View style={styles.rowCard}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{Rudraksha?.date}</Text>
            </View>
          </View>
        </View> */}

      <Text style={styles.paragraph}>
        The One Lakh Rudraksharchana on 19th November was a grand success! 🌟
        Click on
        <Text style={styles.highlight}> “I Want Free Rudraksha” </Text>
        now to receive the sacred Rudrakshas used in the Archana. They will be
        delivered to your doorstep at no cost. Inspired by this success, we
        aspire to host 99 more Rudraksharchana events to fulfill our vision of
        One Crore Rudraksharchanas! Join us on this divine journey. 🙏
      </Text>

      <Text style={styles.paragraph}>
        నవంబర్ 19న నిర్వహించిన లక్ష రుద్రాక్షార్చన ఘన విజయాన్ని సాధించింది! 🌟
        ఆర్చనలో ఉపయోగించిన పవిత్ర రుద్రాక్షలను పొందడానికి ఇప్పుడు
        <Text style={styles.highlight}> "I Want Free Rudraksha" </Text>పై క్లిక్
        చేయండి. అవి మీ ఇంటి వద్దకు ఉచితంగా పంపబడతాయి. ఈ విజయంతో ప్రేరణ పొందిన
        మేము, మా లక్ష్యం అయిన కోటి రుద్రాక్షార్చనల సాధన కోసం మరో 99
        రుద్రాక్షార్చన కార్యక్రమాలను నిర్వహించేందుకు సంకల్పించాము! ఈ దివ్య
        ప్రయాణంలో భాగస్వామ్యం అవ్వండి. 🙏
      </Text>
      {/* {!Rudraksha && ( */}
      <TouchableOpacity
        style={styles.button}
        // onPress={() => setModalVisible(true)}
        // onPress={() => {
        //   if (userData != null) {
        //     setModalVisible1(true);
        //   } else {
        //     // callWhatsappLogin();
        //     // setModalVisible1(true)
        //     navigation.navigate("Login");
        //   }
        // }}
        onPress={() => interestedfunc()}
      >
        <Text style={styles.buttonText}>I Want Free Rudraksha</Text>
      </TouchableOpacity>
      {/* )} */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => setModalVisible1(false)} // Android back button close
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon
              name="close"
              size={30}
              onPress={() => setModalVisible1(false)}
              style={{ alignSelf: "flex-end" }}
            />
            {/* <Text>{userData?.whatsappNumber}</Text> */}
            <Text style={styles.modalText}>
              Please enter your address below!
            </Text>

            <View>
              <TextInput
                placeholder="Address"
                // mode="outlined"
                placeholderTextColor={"gray"}
                value={formData.address}
                style={styles.input1}
                error={formData.address_error}
                multiline={true} // Enables multiline input
                numberOfLines={4} // Default visible lines
                editable={formData.saveaddressbtn==true?true:false}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    address: text,
                    address_error: false,
                  })
                }
              />
              {formData.address_error == true ? (
                <Text style={styles.errortxt}>Address is mandatory</Text>
              ) : null}

              {formData.saveaddressbtn ? (
                <View>
                  {formData.loading == false ? (
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => saveaddress()}
                    >
                      <Text style={styles.buttonText}>Save Address</Text>
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <ActivityIndicator
                        size="small"
                        color="#fff"
                        style={styles.btn}
                      />
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <View style={styles.row}>
                    {/* Home Delivery Button */}
                    <TouchableOpacity
                      style={[
                        styles.button1,
                        deliveryType === "HomeDelivery"
                          ? styles.selectedButton
                          : {},
                      ]}
                      onPress={() => setDeliveryType("HomeDelivery")}
                    >
                      <Text
                        style={[
                          styles.buttonText1,
                          deliveryType === "HomeDelivery"
                            ? styles.selectedText
                            : {},
                        ]}
                      >
                        Home Delivery
                      </Text>
                    </TouchableOpacity>

                    {/* Collect from Office Button */}
                    <TouchableOpacity
                      style={[
                        styles.button1,
                        deliveryType === "PickInOffice"
                          ? styles.selectedButton
                          : {},
                      ]}
                      onPress={() => setDeliveryType("PickInOffice")}
                    >
                      <Text
                        style={[
                          styles.buttonText1,
                          deliveryType === "PickInOffice"
                            ? styles.selectedText
                            : {},
                        ]}
                      >
                        Collect from Office
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    {formData.loading == false ? (
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => recieveType(deliveryType)}
                      >
                        <Text style={styles.buttonText}>Save Address</Text>
                      </TouchableOpacity>
                    ) : (
                      <View>
                        <ActivityIndicator
                          size="small"
                          color="#fff"
                          style={styles.btn}
                        />
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Rudraksha;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#351664",
  },
  paragraph: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
    textAlign: "justify",
  },
  highlight: {
    color: "#FF4500",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4B0082",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width * 0.9,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    // alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#4B0082",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: width * 0.8,
    alignSelf: "center",
    margin: 10,
  },
  input: {
    height: 40,
    width: width * 0.8,
    borderColor: "#4B0082",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "black", // Ensure text is visible
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "white",
  },
  input1: {
    height: 100,
    width: width * 0.8,
    borderColor: "#4B0082",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "black", // Ensure text is visible
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "white",
  },
  errortxt: {
    color: "red",
    fontSize: 15,
    marginBottom: 10,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: 10,
  },
  homebtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: width * 0.35,
    alignSelf: "center",
  },
  officebtn: {
    backgroundColor: "#0384d5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: width * 0.35,
    alignSelf: "center",
  },
  cardView: {
    width: width * 0.9,
    borderColor: "#4B0082",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "black", // Ensure text is visible
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "white",
  },
  rowCard: {
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
    fontWeight: "bold",
    width: width * 0.25,
  },
  value: {
    fontSize: 16,
    color: "#333",
    textWarp: "wrap",
  },
  button1: {
    flex: 1,
    margin: 5,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#fff", // Default white background
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Shadow for Android
  },
  buttonText1: {
    fontSize: 16,
    color: "#333",
  },
  selectedButton: {
    backgroundColor: "#3498db", // Highlighted color
  },
  selectedText: {
    color: "#fff", // Text color for selected button
    fontWeight: "bold",
  },
});
