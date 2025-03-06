import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert
} from "react-native";
import React,{useEffect, useState,useCallback} from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch,useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
// import { AccessToken } from "../../Redux/action/index";
import Icon from "react-native-vector-icons/Ionicons"
import BASE_URL,{userStage} from "../../../../Config"
import { Asktoken } from "../../../../Redux/action"
const { height, width } = Dimensions.get("window");
import axios from "axios";


const Services = () => {
  const navigation = useNavigation();
  const userData = useSelector((state) => state.counter);
// console.log({userData})
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const[loading,setLoading]=useState(false)
  const dispatch = useDispatch();
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

  const [data, setData] = useState([])

  const [showWhatsappLoginModal, setShowWhatsappLoginModal] = useState(false);

  const toggleWhatsappLoginModal = () => {
    console.log("showWhatsappLoginModal", showWhatsappLoginModal);
    setShowWhatsappLoginModal(!showWhatsappLoginModal);
  };
  useFocusEffect(
    useCallback(() => {
      const checkLoginData = async () => {
        try {
          const userDetail = await AsyncStorage.getItem("userDetails"); // Use await here
          if (userDetail) {
            const parsedUser = JSON.parse(userDetail); // Parse the data
            console.log("userDetails", parsedUser); // Log the parsed details
            dispatch(Asktoken(parsedUser)); // Dispatch the token action
          } else {
            toggleWhatsappLoginModal(); // Show modal if no userDetails
          }
        } catch (error) {
          console.error("Error fetching login data", error); // Log any errors
          toggleWhatsappLoginModal(); // Show modal in case of an error
        }
      };

      checkLoginData();
    }, [])
  );


    useEffect(() => {
      getAllCampaign();
    }, []);

  function getAllCampaign() {
      setLoading(true)
      axios({
        method: "get",
        url:
          // userStage == "test"
          //   ? 
            BASE_URL + "marketing-service/campgin/getAllCampaignDetails"
            // : null,
      })
        .then((response) => {
          console.log("response", response.data);
          setLoading(false)
          setData(response.data.filter((item) => item.campaignStatus)); 
        
           // setImage(response.data.imageUrls);
        })
        .catch((error) => {
          console.log("error", error.response);
          setLoading(false)
        });
    }

  const renderItem = ({ item }) => (
    
    <TouchableOpacity
      onPress={() => {
       
        navigation.navigate("CampaignServices", { screen: item.campaignType });
      }}
      style={{ alignItems: "center", marginTop: 20 }}
    >
      <View style={styles.box}>
        {/* <Image
          source={{ uri: item.imageUrls[0].imageId }}
          style={styles.image}
        /> */}
        {item.imageUrls.length > 0 ? (
          <Image
            source={{ uri: item.imageUrls[0].imageUrl }}
            style={styles.image}
          />
        ) : (
          <Text style={{ textAlign: "center" }}>No Image</Text>
        )}
      </View>
      <Text style={styles.txt}>{item.campaignType}</Text>
    </TouchableOpacity>
  );


	function footer() {
    return (
      <View style={{ alignSelf: "center" }}>
        <Text></Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#c0c0c0" }}>
      {loading == true ? (
        <ActivityIndicator size="large" color="#3d2a71" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          numColumns={2}
          ListFooterComponent={footer}
          ListFooterComponentStyle={styles.footerStyle}
        />
      )}
    </View>
  );
};

export default Services;

const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 10,
    margin: 10,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: "center", // Ensures the image covers the box
  },
  txt: {
    marginTop: 5,
    fontSize: 16,
    textAlign: "center",
    width: width * 0.3,
    fontWeight: "bold",
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
    justifyContent: "space-between",
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
  footerStyle: {
    marginTop: 50,
  },
});
