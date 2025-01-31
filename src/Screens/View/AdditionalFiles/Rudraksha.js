import { StyleSheet, Text, View, TouchableOpacity,Dimensions,navigation,Modal,ActivityIndicator,TextInput ,Alert} from "react-native";
import React, { useState,useCallback } from "react";
import axios from "axios";
// import { TextInput } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
const { height, width } = Dimensions.get("window");
import Icon from "react-native-vector-icons/Ionicons";
// import WhatsappLogin from "../../Authorization/WhatsappLogin";
import { useSelector } from "react-redux";
import BASE_URL from "../../../../Config";


const Rudraksha = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const navigation= useNavigation();

  // const userdata = useSelector((state) => state.counter);
  // console.log("userdata", userdata);
  // if (userdata == null) {
  //   navigation.navigate("Login");
    
  // }
  // else{
  //   navigation.navigate("Rudraksha");
  // }
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null) 
  const userData = useSelector((state) => state.logged);
  // console.log("userData", userData);
  const [showWhatsappLoginModal, setShowWhatsappLoginModal] = useState(false);
  const [status, setStatus] = useState(false);
  const [Rudraksha, setRudraksha] = useState(null);
  const [deliveryType, setDeliveryType] = useState(null);

  const toggleWhatsappLoginModal = () => {
    setShowWhatsappLoginModal(!showWhatsappLoginModal);
  };

// useFocusEffect(
//   useCallback(() => {
//     const checkData = async () => {
//       try {
//         const Rudraksha = await AsyncStorage.getItem("Rudraksha"); // Use await here
//         if (Rudraksha) {
//           const parsedUser = JSON.parse(Rudraksha); // Parse the data
//           console.log("Rudraksha", parsedUser); // Log the parsed details
//           setRudraksha(parsedUser);
//         } else {
//           console.log("No user details found");
//         }
//       } catch (error) {
//         console.error("Error fetching login data", error); // Log any errors
//       }
//     };
//     checkData();
//      const userData = useSelector((state) => state.logged);
//     setUserId(userData?.userId);
//   }, [showWhatsappLoginModal])
// );
  
  const[formData,setFormData]=useState({
    whatsappNumber: "",
    whatsappNumber_error: false,
    whatsappNumberValid_error: false,
    saltKey:"",
    mobileOtpSession: "",
    otp: "",
    otp_error: false,
    address: "",
    address_error: false,
    hidebtn: false,
    loading: false,
    saveaddressbtn:true
  })


//   function sendOtpfunc() {
//     if (formData.whatsappNumber == "" || formData.whatsappNumber == null) {
//       setFormData({ ...formData, whatsappNumber_error: true });
//       return false;
//     }
//      if (formData.whatsappNumber.length != 10) {
//        setFormData({ ...formData, whatsappNumberValid_error: true });
//        return false;
//      }


//     let data = {
//       whatsappNumber: "+91" + formData.whatsappNumber,
//       registrationType: "whatsapp",
//     };
//     setFormData({...formData,loading:true})
//     axios({
//       method: "post",
//       url: BASE_URL + "auth-service/auth/registerwithMobile",
//       data: data,
//     })
//       .then((response) => {
//         console.log(response.data)
//       if (response.data.accessToken == null) {
//         setFormData({
//           ...formData,
//           hidebtn: true,
//           mobileOtpSession: response.data.mobileOtpSession,
//           loading: false,
//           saltKey:response.data.salt
//         });
//         }
//       else {
//         // console.log("sdchjv", response.data.accessToken);
//         setFormData({
//           ...formData,
//           loading: false
//         })
//         dispatch(Asktoken(response.data));
//         setUserId(response.data.userId);

//         setModalVisible1(true)
//         setModalVisible(false)
//         }
//     })
//       .catch((error) => {
//           setFormData({ ...formData, loading: false });
//           console.log("error", error);
//     });
//   }
  
//   function verifyOtpfunc() {
//     if(formData.otp == "" || formData.otp == null){
//       setFormData({...formData, otp_error:true})
//       return false
//     }
//     let data = {
//       mobileNumber: formData.whatsappNumber,
//       mobileOtpSession: formData.mobileOtpSession,
//       mobileOtpValue: formData.otp,
//       primaryType: "ASKOXY",
//       salt: formData.saltKey
//     };
//     setFormData({ ...formData, loading: true });
//     axios({
//       method: "post",
//       url: BASE_URL + "auth-service/auth/registerwithMobile",
//       data: data,
//     })
//       .then((response) => {
//         console.log(response.data);
//           setFormData({
//             ...formData,
//             hidebtn: false,
//             loading: false,
//           });
//         setModalVisible(false)
//         setModalVisible1(true)
//         dispatch(Asktoken(response.data));
//         setUserId(response.data.userId);

      
//       })
//       .catch((error) => {
//         setFormData({ ...formData, loading: false });
//         console.log("error", error);
//       });
//   }

  const callWhatsappLogin = () => {
    // You can directly call any function from WhatsappLogin or render it here
    console.log("WhatsappLogin called")
    toggleWhatsappLoginModal()
    
  };


//   function saveaddress() {
//      if(formData.address == "" || formData.address == null){
//        setFormData({...formData, address_error:true})
//        return false
//      }
//      let data = {
//        "address": formData.address,
//        "userId": userId,
//        "deliveryType":deliveryType
//      };
//     setFormData({ ...formData, loading: true });
//      axios({
//        method: "post",
//        url: BASE_URL + "auth-service/auth/rudhrakshaDistribution",
//        data: data,
//      })
//        .then((response) => {
//          console.log(response.data);
//         //  setFormData({
//         //    ...formData,
//         //    hidebtn: false,
//         //    loading: false,
//         //    saveaddressbtn:false
//         //  });
//          setModalVisible1(false);
//          AsyncStorage.setItem(
//            "Rudraksha",
//            JSON.stringify({
//              address: formData.address,
//              userId: userId,
//              date: new Date().toDateString(),
//              deliveryType: deliveryType,
//            })
//          );
//         //  setModalVisible1(false);
//         //  Alert.alert("Success", "Address saved successfully!");
//        })
//        .catch((error) => {
//          setFormData({ ...formData, loading: false });
//          console.log("error", error.response);
//        });
//   }

//   function recieveType(value) {
//     console.log(value)
//          setFormData({ ...formData, loading: true });

//     axios({
//       method: "post",
//       url: BASE_URL + "auth-service/auth/rudhrakshaDistribution",
//       data: {
//         userId: userId,
//         deliveryType:value
//       },
//     })
//       .then((response) => {
//         console.log(response.data);
//         setFormData({
//           ...formData,
//           hidebtn: false,
//           loading: false,
//           saveaddressbtn: false,
//           loading:false
//         });
//         setModalVisible(false);
//         setModalVisible1(false);
//         Alert.alert("Success", "Your details saved successfully!");
//       })
//       .catch((error) => {
//         setFormData({ ...formData, loading: false });
//         console.log("error", error.response);
//       });
// }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Rudraksha</Text>
      {Rudraksha && (
        <View>
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
        </View>
      )}
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
      {!Rudraksha && (
        <TouchableOpacity
          style={styles.button}
          // onPress={() => setModalVisible(true)}
          // onPress={() => {
          //   // if (userdata != null) {
          //     setModalVisible1(true);
          //   } else {
          //     // navigation.navigate("Login");
          //   }
          // }}
          onPress={()=>{
            if (userData == null) {
              
              const currentScreen = navigation.getState().routes[navigation.getState().index].name;
             navigation.navigate("Login", { fromScreen: currentScreen });
            } else {
              navigation.navigate("Dashboard", { screen: "Free Rudraksha" });
            }
          }}
        >
          <Text style={styles.buttonText}>I Want Free Rudraksha</Text>
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false),
            setFormData({ ...formData, whatsappNumber: "" });
        }} // Android back button close
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon
              name="close"
              size={30}
              onPress={() => setModalVisible(false)}
              style={{ alignSelf: "flex-end" }}
            />
            <Text style={styles.modalText}>Confirm your Whatsapp Number!</Text>

            <View>
              <TextInput
                placeholder="Whatsapp Number"
                // mode="outlined"
                value={formData.whatsappNumber.replace(/[^0-9]/g, "")}
                style={styles.input}
                maxLength={10}
                keyboardType="numeric"
                placeholderTextColor="gray" // Placeholder text color
                error={formData.whatsappNumber_error}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    whatsappNumber: text,
                    whsappNumber_error: false,
                    whatsappNumberValid_error: false,
                  })
                }
              />
              {formData.whatsappNumber_error == true ? (
                <Text style={styles.errortxt}>
                  Whastapp Number is mandatory
                </Text>
              ) : null}

              {formData.whatsappNumberValid_error == true ? (
                <Text style={styles.errortxt}>
                  Whastapp Number should be 10 digits
                </Text>
              ) : null}
            </View>

            {formData.hidebtn == false ? (
              <View>
                {formData.loading == false ? (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => sendOtpfunc()}
                  >
                    <Text style={styles.buttonText}>Verify</Text>
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
                <TextInput
                  placeholder="OTP"
                  // mode="outlined"
                  value={formData.otp.replace(/[^0-9]/g, "")}
                  style={styles.input}
                  keyboardType="numeric"
                  error={formData.otp_error}
                  placeholderTextColor="gray" // Placeholder text color
                  onChangeText={(text) =>
                    setFormData({ ...formData, otp: text, otp_error: false })
                  }
                />
                {formData.otp_error == true ? (
                  <Text style={styles.errortxt}>OTP is mandatory</Text>
                ) : null}
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => verifyOtpfunc()}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
           
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModal}
        onRequestClose={() => {
          setConfirmModal(false);
          // setFormData({ ...formData, whatsappNumber: "" });
        }} // Android back button close
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon
              name="close"
              size={30}
              onPress={() => setConfirmModal(false)}
              style={{ alignSelf: "flex-end" }}
            />
            <Text style={styles.modalText}>Confirm your Whatsapp Number! </Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.homebtn}
                // onPress={() => <WhatsappLogin/>}
                onPress={() => {
                  setConfirmModal(false); // Close the modal
                  callWhatsappLogin(); // Call WhatsappLogin
                }}
              >
                <Text>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.officebtn}
                onPress={() => {
                  setModalVisible1(true), setConfirmModal(false);
                }}
              >
                <Text>Yes</Text>
              </TouchableOpacity>
            </View>
            <View>
              {/* <TextInput
                placeholder="Whatsapp Number"
                // mode="outlined"
                value={formData.whatsappNumber.replace(/[^0-9]/g, "")}
                style={styles.input}
                maxLength={10}
                keyboardType="numeric"
                placeholderTextColor="gray" // Placeholder text color
                error={formData.whatsappNumber_error}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    whatsappNumber: text,
                    whsappNumber_error: false,
                    whatsappNumberValid_error: false,
                  })
                }
              />
              {formData.whatsappNumber_error == true ? (
                <Text style={styles.errortxt}>
                  Whastapp Number is mandatory
                </Text>
              ) : null}

              {formData.whatsappNumberValid_error == true ? (
                <Text style={styles.errortxt}>
                  Whastapp Number should be 10 digits
                </Text>
              ) : null} */}
              {/* <Text></Text> */}
            </View>

            {/* {formData.hidebtn == false ? (
              <View>
                {formData.loading == false ? (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => sendOtpfunc()}
                  >
                    <Text style={styles.buttonText}>Verify</Text>
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
                <TextInput
                  placeholder="OTP"
                  // mode="outlined"
                  value={formData.otp.replace(/[^0-9]/g, "")}
                  style={styles.input}
                  keyboardType="numeric"
                  error={formData.otp_error}
                  placeholderTextColor="gray" // Placeholder text color
                  onChangeText={(text) =>
                    setFormData({ ...formData, otp: text, otp_error: false })
                  }
                />
                {formData.otp_error == true ? (
                  <Text style={styles.errortxt}>OTP is mandatory</Text>
                ) : null}
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => verifyOtpfunc()}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )} */}
            {/* <TextInput
                label="Address"
                mode="outlined"
                value={formData.address}
                style={styles.input}
                error={formData.address_error}
                onChangeText={(text) => setFormData({ ...formData, address: text, address_error: false })}
              />
              {formData.address_error == true ?
                <Text>Address is mandatory</Text>
                : null} */}
          </View>
        </View>
      </Modal>

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

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.homebtn}
                  onPress={() => setDeliveryType("HomeDelivery")}
                >
                  <Text>Home Delivery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.officebtn}
                  onPress={() => setDeliveryType("PickInOffice")}
                >
                  <Text>Collect from office</Text>
                </TouchableOpacity>
              </View>

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
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.homebtn}
                    onPress={() => recieveType("HomeDelivery")}
                  >
                    <Text>Home Delivery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.officebtn}
                    onPress={() => recieveType("PickInOffice")}
                  >
                    <Text>Collect from office</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
      {/* <WhatsappLogin
        showModal={showWhatsappLoginModal}
        hideModal={toggleWhatsappLoginModal}
      /> */}
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
    color: "#4B008",
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
    margin:10
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
  cardView  : {
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
    width: width * 0.25
  },
  value: {
    fontSize: 16,
    color: "#333",
    textWarp:"wrap"
  }
});
