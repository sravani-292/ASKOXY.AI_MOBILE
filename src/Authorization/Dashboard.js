// import {
//     Dimensions,
//     FlatList,
//     StyleSheet,
//     Text,
//     View,
//     Image,
//     TouchableOpacity,
//     Modal,
//     ActivityIndicator,
//     TextInput,
//     Alert
//   } from "react-native";
//   import React,{useEffect, useState,useCallback} from "react";
//   import { useNavigation } from "@react-navigation/native";
//   import AsyncStorage from "@react-native-async-storage/async-storage";
//   import { useDispatch } from "react-redux";
//   import { useFocusEffect } from "@react-navigation/native";
//   import Icon from "react-native-vector-icons/Ionicons"
//   import BASE_URL from "../../Config";
//   import { Asktoken } from "../../Redux/action";
//   const { height, width } = Dimensions.get("window");
//   import axios from "axios";
// //   import WhatsappLogin from "../Authorization/";
  
  
//   const Dashboard = () => {
//     const navigation = useNavigation();
  
//     const [modalVisible, setModalVisible] = useState(false);
//     const [modalVisible1, setModalVisible1] = useState(false);
//     const dispatch = useDispatch();
//     const [formData, setFormData] = useState({
//       whatsappNumber: "",
//       whatsappNumber_error: false,
//       whatsappNumberValid_error: false,
//       saltKey: "",
//       mobileOtpSession: "",
//       otp: "",
//       otp_error: false,
//       address: "",
//       address_error: false,
//       hidebtn: false,
//       loading: false,
//       saveaddressbtn: true,
//     });
  
//     const data = [
//       {
//         id: 1,
//         name: "Free Rudraksha",
//         image: require("../../assets/Rudraksha.jpeg"),
//         // navigateTo: "Free Rudraksha", // Page to navigate
//         navigation.navigate("DashboardStack", { screen: "Free Rudraksha" });

//       },
//       {
//         id: 2,
//         name: "Oxy Rice",
//         image: require("../../assets/icon2.png"),
//         navigateTo: "Rice", 
//       },
//       {
//         id: 3,
//         name: "Free AI And GenAI",
//         image: require("../../assets/freeaiandgenai.png"),
//         navigateTo: "Free AI and Gen AI", 
//       },
  
//       {
//         id: 4,
//         name: "Study Abroad",
//         // image: require("../../../assets/studyAbroad.png"),
//         navigateTo: "AbroadCategories", 
//       },
//       {
//         id: 5,
//         name: "Legal Services",
//         image: require("../../assets/legalservice.png"),
//         navigateTo: "Legal Services", 
//       },
//       {
//         id: 6,
//         name: "My Rotary",
//         image: require("../../assets/freeaiandgenai.png"),
//         navigateTo: "My Rotary", 
//       },
//     //   {
//     //     id: 7,
//     //     name: "Machines & Manufacturing Services",
//     //     image: require("../../assets/machines.webp"),
//     //     navigateTo: "Machines", // Page to navigate
//     //   },
      
//     ];
  
//     const [showWhatsappLoginModal, setShowWhatsappLoginModal] = useState(false);
  
//     const toggleWhatsappLoginModal = () => {
//       console.log("showWhatsappLoginModal", showWhatsappLoginModal);
//       setShowWhatsappLoginModal(!showWhatsappLoginModal);
//     };
//     useFocusEffect(
//       useCallback(() => {
//         const checkLoginData = async () => {
//           try {
//             const userDetail = await AsyncStorage.getItem("userDetails"); 
//             if (userDetail) {
//               const parsedUser = JSON.parse(userDetail); 
//               console.log("userDetails", parsedUser); 
//               dispatch(Asktoken(parsedUser)); 
//             } else {
//               toggleWhatsappLoginModal(); 
//             }
//           } catch (error) {
//             console.error("Error fetching login data", error); 
//             toggleWhatsappLoginModal(); 
//           }
//         };
  
//         checkLoginData();
//       }, [])
//     );
  
//     const renderItem = ({ item }) => (
//       <TouchableOpacity
//         onPress={() => {
//           if (item.navigateTo) {
//             navigation.navigate(item.navigateTo); 
//           }
//         }}
//         style={{ alignItems: "center", marginTop: 20 }}
//       >
//         <View style={styles.box}>
//           {item.image && <Image source={item.image} style={styles.image} />}
//         </View>
//         <Text style={styles.txt}>{item.name}</Text>
//       </TouchableOpacity>
//     );
  
//     function sendOtpfunc() {
//       if (formData.whatsappNumber == "" || formData.whatsappNumber == null) {
//         setFormData({ ...formData, whatsappNumber_error: true });
//         return false;
//       }
//       if (formData.whatsappNumber.length != 10) {
//         setFormData({ ...formData, whatsappNumberValid_error: true });
//         return false;
//       }
  
//       let data = {
//         whatsappNumber: "+91" + formData.whatsappNumber,
//         registrationType: "whatsapp",
//       };
//       setFormData({ ...formData, loading: true });
//       axios({
//         method: "post",
//         url: BASE_URL + "auth-service/auth/registerwithMobile",
//         data: data,
//       })
//         .then((response) => {
//           console.log(response.data);
//           if (response.data.accessToken == null) {
//             setFormData({
//               ...formData,
//               hidebtn: true,
//               mobileOtpSession: response.data.mobileOtpSession,
//               loading: false,
//               saltKey: response.data.salt,
//             });
//           } else {
//             console.log("sdchjv", response.data.accessToken);
//             AsyncStorage.setItem("userDetails", JSON.stringify(response.data));
//             dispatch(Asktoken(response.data));
//             setModalVisible(false);
//             alert("Verified");
//             setFormData({
//               ...formData,
//               loading: false,
//             });
//           }
//         })
//         .catch((error) => {
//           setFormData({ ...formData, loading: false });
//           console.log("error", error);
//         });
//     }
  
//     function verifyOtpfunc() {
//       if (formData.otp == "" || formData.otp == null) {
//         setFormData({ ...formData, otp_error: true });
//         return false;
//       }
//       let data = {
//         mobileNumber: formData.whatsappNumber,
//         mobileOtpSession: formData.mobileOtpSession,
//         mobileOtpValue: formData.otp,
//         primaryType: "ASKOXY",
//         salt: formData.saltKey,
//       };
//       setFormData({ ...formData, loading: true });
//       axios({
//         method: "post",
//         url: BASE_URL + "auth-service/auth/registerwithMobile",
//         data: data,
//       })
//         .then((response) => {
//           console.log(response.data);
//           setFormData({
//             ...formData,
//             hidebtn: false,
//             loading: false,
//           });
//           setModalVisible(false);
//           setModalVisible1(true);
//           AsyncStorage.setItem("userDetails", JSON.stringify(response.data));
//           dispatch(Asktoken(response.data));
//           setUserId(response.data.userId);
//         })
//         .catch((error) => {
//           setFormData({ ...formData, loading: false });
//           console.log("error", error);
//         });
//     }
//       function footer() {
//       return (
//         <View style={{ alignSelf: "center" }}>
//           <Text></Text>
//         </View>
//       );
//     }
//     return (
//       <View style={{ flex: 1, alignItems: "center", backgroundColor: "#c0c0c0" }}>
//         <FlatList
//           data={data}
//           renderItem={renderItem}
//           numColumns={2}
//           ListFooterComponent={footer}
//           ListFooterComponentStyle={styles.footerStyle}
//         />
  
//         {/* <WhatsappLogin
//           showModal={showWhatsappLoginModal}
//           hideModal={toggleWhatsappLoginModal}
//         /> */}
//         {/* <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => {
//             setModalVisible(false),
//               setFormData({ ...formData, whatsappNumber: "" });
//           }} 
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <Icon
//                 name="close"
//                 size={30}
//                 onPress={() => setModalVisible(false)}
//                 style={{ alignSelf: "flex-end" }}
//               />
//               <Text style={styles.modalText}>Confirm your Whatsapp Number!</Text>
  
//               <View>
//                 <TextInput
//                   placeholder="Whatsapp Number"
//                   value={formData.whatsappNumber.replace(/[^0-9]/g, "")}
//                   style={styles.input}
//                   maxLength={10}
//                   keyboardType="numeric"
//                   placeholderTextColor="gray" 
//                   error={formData.whatsappNumber_error}
//                   onChangeText={(text) =>
//                     setFormData({
//                       ...formData,
//                       whatsappNumber: text,
//                       whsappNumber_error: false,
//                       whatsappNumberValid_error: false,
//                     })
//                   }
//                 />
//                 {formData.whatsappNumber_error == true ? (
//                   <Text style={styles.errortxt}>
//                     Whastapp Number is mandatory
//                   </Text>
//                 ) : null}
  
//                 {formData.whatsappNumberValid_error == true ? (
//                   <Text style={styles.errortxt}>
//                     Whastapp Number should be 10 digits
//                   </Text>
//                 ) : null}
//               </View>
  
//               {formData.hidebtn == false ? (
//                 <View>
//                   {formData.loading == false ? (
//                     <TouchableOpacity
//                       style={styles.btn}
//                       onPress={() => sendOtpfunc()}
//                     >
//                       <Text style={styles.buttonText}>Verify</Text>
//                     </TouchableOpacity>
//                   ) : (
//                     <View>
//                       <ActivityIndicator
//                         size="small"
//                         color="#fff"
//                         style={styles.btn}
//                       />
//                     </View>
//                   )}
//                 </View>
//               ) : (
//                 <View>
//                   <TextInput
//                     placeholder="OTP"
//                     value={formData.otp.replace(/[^0-9]/g, "")}
//                     style={styles.input}
//                     keyboardType="numeric"
//                     error={formData.otp_error}
//                     placeholderTextColor="gray" 
//                     onChangeText={(text) =>
//                       setFormData({ ...formData, otp: text, otp_error: false })
//                     }
//                   />
//                   {formData.otp_error == true ? (
//                     <Text style={styles.errortxt}>OTP is mandatory</Text>
//                   ) : null}
//                   <TouchableOpacity
//                     style={styles.btn}
//                     onPress={() => verifyOtpfunc()}
//                   >
//                     <Text style={styles.buttonText}>Submit</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
            
//             </View>
//           </View>
//         </Modal> */}
//       </View>
//     );
//   };
  
//   export default Dashboard;
  
//   const styles = StyleSheet.create({
//     box: {
//       backgroundColor: "white",
//       width: width * 0.35,
//       height: width * 0.35,
//       borderRadius: 10,
//       margin: 10,
//       elevation: 5,
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     image: {
//       width: width * 0.3,
//       height: width * 0.3,
//       resizeMode: "cover", 
//     },
//     txt: {
//       marginTop: 5,
//       fontSize: 16,
//       textAlign: "center",
//       width: width * 0.3,
//       fontWeight: "bold",
//     },
//     buttonText: {
//       color: "#FFFFFF",
//       fontSize: 16,
//       fontWeight: "bold",
//     },
//     modalOverlay: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       backgroundColor: "rgba(0, 0, 0, 0.5)",
//     },
//     modalContent: {
//       width: width * 0.9,
//       padding: 20,
//       backgroundColor: "white",
//       borderRadius: 10,
//       // alignItems: "center",
//     },
//     modalText: {
//       fontSize: 18,
//       marginBottom: 15,
//       textAlign: "center",
//     },
//     image: {
//       width: 150,
//       height: 150,
//       marginBottom: 15,
//     },
//     btn: {
//       backgroundColor: "#4B0082",
//       padding: 10,
//       borderRadius: 5,
//       alignItems: "center",
//       width: width * 0.8,
//       alignSelf: "center",
//       margin: 10,
//     },
//     input: {
//       height: 40,
//       width: width * 0.8,
//       borderColor: "#4B0082",
//       borderWidth: 1,
//       borderRadius: 8,
//       paddingHorizontal: 10,
//       color: "black", // Ensure text is visible
//       marginBottom: 15,
//       fontSize: 16,
//       backgroundColor: "white",
//     },
//     input1: {
//       height: 100,
//       width: width * 0.8,
//       borderColor: "#4B0082",
//       borderWidth: 1,
//       borderRadius: 8,
//       paddingHorizontal: 10,
//       color: "black", // Ensure text is visible
//       marginBottom: 15,
//       fontSize: 16,
//       backgroundColor: "white",
//     },
//     errortxt: {
//       color: "red",
//       fontSize: 15,
//       marginBottom: 10,
//       alignSelf: "center",
//     },
//     row: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       margin: 10,
//     },
//     homebtn: {
//       backgroundColor: "green",
//       padding: 10,
//       borderRadius: 5,
//       alignItems: "center",
//       width: width * 0.35,
//       alignSelf: "center",
//     },
//     officebtn: {
//       backgroundColor: "#0384d5",
//       padding: 10,
//       borderRadius: 5,
//       alignItems: "center",
//       width: width * 0.35,
//       alignSelf: "center",
//     },
//     footerStyle: {
//       marginTop: 50,
//     },
//   });
  

import React from "react";
import { View, Text, TouchableOpacity, Image,StyleSheet ,Dimensions} from "react-native";
import { useNavigation } from "@react-navigation/native";
const{width,height}=Dimensions.get("window")
export default function Dashboard() {
  const navigation = useNavigation(); // Get navigation using hook

  const items = [
    {
      id: 1,
      name: "Free Rudraksha",
      image: require("../../assets/Rudraksha.jpeg"),
      screen: "Free Rudraksha",
    },
          {
        id: 2,
        name: "Oxy Rice",
        image: require("../../assets/icon2.png"),
        screen: "Rice", 
      },
      {
        id: 3,
        name: "Free AI And GenAI",
        image: require("../../assets/freeaiandgenai.png"),
        screen: "Free AI and Gen AI", 
      },
  
      {
        id: 4,
        name: "Study Abroad",
        // image: require("../../../assets/studyAbroad.png"),
        navigateTo: "AbroadCategories", 
      },
      {
        id: 5,
        name: "Legal Services",
        image: require("../../assets/legalservice.png"),
        screen: "Legal Services", 
      },
      {
        id: 6,
        name: "My Rotary",
        image: require("../../assets/freeaiandgenai.png"),
        screen: "My Rotary", 
      },
  ];

  return (
    <View style={styles.container}>
    {items.map((item, index) => (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.itemContainer,
          { marginRight: index % 2 === 0 ? 10 : 0 }, // Adjust spacing for each row
        ]}
        onPress={() =>
          navigation.navigate("DashboardStack", { screen: item.screen })
        }
      >
        <Image source={item.image} style={styles.image} />
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flexDirection: "row",
  flexWrap: "wrap", 
  justifyContent: "space-between",
  padding: 10,
},
itemContainer: {
  marginTop:50,
  width: "48%", 
  justifyContent: "center",
  alignSelf:"center",
},
image: {
  borderRadius:15,
  width:width*0.4,
  height: height/7,
  marginBottom: 10, 
},
itemText: {
  textAlign: "center", 
},
});
