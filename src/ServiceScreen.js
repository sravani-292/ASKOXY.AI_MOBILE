

import React,{useState,useEffect,useCallback} from "react";
import { View, Text, Image, TextInput, FlatList, TouchableOpacity,ScrollView,
          BackHandler, Dimensions ,StyleSheet,Alert} from "react-native";
import { Ionicons, FontAwesome,MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch,useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import BASE_URL,{userStage} from "../Config"
const{height,width}=Dimensions.get('window')
import { useNavigationState } from '@react-navigation/native';
import { ActivityIndicator } from "react-native-paper";
import LottieView from "lottie-react-native";
import { set } from "core-js/core/dict";
import LoginModal from "./Components/LoginModal";
import { i } from "framer-motion/m";

const services = [
  { id: "1", name: "Free Rudraksha", image: require("../assets/Rudraksha.jpeg"),screen:"FREE RUDRAKSHA" },
  { id: "2", name: "Free Rice Samples", image: require("../assets/container.jpg"),screen:"FREE CONTAINER" },
  { id: "3", name: "Free AI & Gen AI", image: require("../assets/freeaiandgenai.png") ,screen:"FREE AI & GEN AI"},
  { id: "4", name: "Study Abroad", image: require("../assets/Images/E.jpeg"),screen:"STUDY ABROAD" },
  { id: "5", name: "Cryptocurrency", image: require("../assets/BMVCOIN1.png") ,screen:"Crypto Currency"},
  { id: "6", name: "Legal Knowledge Hub", image: require("../assets/legal.png"),screen:"LEGAL SERVICE" },
  { id: "7", name: "My Rotary", image: require("../assets/myrotary.png"),screen:"MY ROTARY " },
  { id: "8", name: "We are Hiring", image: require("../assets/genai.png") ,screen:"We Are Hiring"},
  { id: "89", name: "Manufacturing Services", image: require("../assets/manufacturing.png") ,screen:"Machines"},

];

const images = [
  require("../assets/Images/r1.png"),
  require("../assets/Images/r2.png"),
];


const ServiceScreen = () => {
  const userData = useSelector((state) => state.counter);
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const[data,setData]=useState([])
  const[getCategories,setGetCategories]=useState([])
  const[loading,setLoading]=useState(false)
  const [chainId, setChainId] = useState("");
  const [coin, setCoin] = useState("");
  const [loginModal, setLoginMobal] = useState(false);
  // const[loader,setLoader]=useState(false)
  const currentScreen = useNavigationState(
    (state) => state.routes[state.index]?.name
  );

useFocusEffect(
  useCallback(() => {
    const handleBackPress = () => {
     
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        )

      return true;
    };

    // Add BackHandler event listener
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Cleanup
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [currentScreen])
)


useFocusEffect(
  useCallback(() => {
    console.log({userData});
    
    const profile =async()=>{
        userData!=null?(
          axios({
            method: "get",
            url:
              BASE_URL + `user-service/getProfile/${userData.userId}`,
            headers: {
              Authorization: `Bearer ${userData.accessToken}`,
            },

          })
            .then((response) => {
              console.log("response", response.data);
              setChainId(response.data.multiChainId)
              setCoin(response.data.coinAllocated)
            })
            .catch((error) => {
              console.log("error1", error);
              setLoading(false)
            })
        )
        :console.log("no user data");
      }
      profile()
      
  }, [userData])
);


  function getAllCampaign() {
    setLoading(true)
    axios({
      method: "get",
      url:
        BASE_URL + "marketing-service/campgin/getAllCampaignDetails"
         
    })
      .then((response) => {
        // console.log("response", response.data);
        setLoading(false)
        // setData(response.data.filter((item) => item.campaignStatus)); // Filter out inactive campaigns

         // setImage(response.data.imageUrls);
         const apiData = response.data.filter((item) => item.campaignStatus);
         const apiScreens = apiData.map((item) => item.campaignType);
         
         const mergedData = [
           ...apiData,
           ...services.filter(service => 
             !apiScreens.includes(service.screen)
           )
         ];
         console.log({mergedData})
         setData(mergedData);
      })
      .catch((error) => {
        console.log("error1", error);
        setData(services)
        setLoading(false)
      });
  }


  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  function getRiceCategories(){
    setLoading(true)
    axios({
      method: "get",
      url:
         BASE_URL + "product-service/showItemsForCustomrs"
          
    })
    .then((response) => {
      setLoading(false)
      // console.log(response.data)
      setGetCategories(response.data)
    })
    .catch((error) => {
      setLoading(false)
      console.log(error.response)
  })
  }

useEffect(()=>{
  getAllCampaign();
  getRiceCategories()
  setLoginMobal(true)
},[])

// Function to truncate the ID (Example: "0x1234567890abcdef" → "0x12...ef")
const truncateId = (id) => {
  return id.length > 6 ? `${id.slice(0, 4)}...${id.slice(-4)}` : id;
};



  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 5 }}>
      {loading==false?
    <>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 50,marginBottom:15,padding:10 }}>
        
        <Image
          source={require('../assets/Images/logo1.png')}
          style={{ width: 150, height: 50, marginRight: 10,marginBottom:-5 }}
        />
{userData!=null?
        <TouchableOpacity onPress={()=>navigation.navigate("Login")}  style={{ marginLeft: "auto" }}>
          <MaterialCommunityIcons name="logout" size={25} color="#5e606c" />
        </TouchableOpacity>
        
        :<TouchableOpacity onPress={()=>navigation.navigate("Login")}  style={{ marginLeft: "auto",color:"#5e606c" }}>
        <MaterialCommunityIcons name="login" size={25} color="#5e606c" /><Text>Login</Text>
      </TouchableOpacity>}

      </View>
      {userData!=null&&
      <View style={styles.IDcontainer}>
     <Text style={styles.label}>
        Blockchain ID: <Text style={styles.value}>{truncateId(chainId)}</Text>
      </Text>
      <Text style={styles.label}>
        Coin: <Text style={styles.value}>{coin}</Text>
      </Text>
      </View>
}

<ScrollView>
      <>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
          <Image source={item} style={{ width:"97%",height: "35%", }} />
         </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={{ flexDirection: "row", alignSelf: "center",marginTop:-95 }}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* Car Brands Horizontal List */}
      {services!=null || services!="" ?(
      <View style={{marginBottom:10,height:180,}}>
      <FlatList
        data={services}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              alignItems: "center",
              margin: 20,
              backgroundColor:"white",
              height:80,
              elevation:10,
              borderRadius:100,
              width:80
            }}
            // onPress={() => navigation.navigate(item.screen || item.campaignType)} 
             onPress={() => {
                     if(item.screen!=="Crypto Currency")
                      { 
                        // console.log("campaignType",item.campaignType || item.screen);
                        
                        navigation.navigate(item.screen || item.campaignType)
                      }
                     else{
                      if(userData==null || userData==undefined){
                        Alert.alert("Alert","Please login to continue",[
                          {text:"OK",onPress:()=>navigation.navigate("Login")},
                          {text:"Cancel"}
                        ])
                      }
                      else{
                        navigation.navigate(item.screen || item.campaignType)
                      }
                     }
                  }}  >
              {item.image?
            <Image source={item.image} style={{ width: 80, height: 80, resizeMode: "contain",borderRadius:100 }} />
            : <Image source={require("../assets/icon.png")} style={{ width: 80, height: 80, resizeMode: "contain",borderRadius:100 }} />
            }
            <Text style={{ fontSize: 12, marginTop: 20 ,textAlign:"center"}}>{item.name || item.campaignType}
            </Text>
          </TouchableOpacity>
        )}
      />
      </View>
      
      ):null}


      {/* Popular Categories List */}
      <View style={{ flexDirection: "row", justifyContent: "space-between",padding:10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Popular Categories</Text>
        <TouchableOpacity onPress={()=>{userData!=null?navigation.navigate("Home",{screen:"UserDashboard"}):navigation.navigate("Dashboard")}}>
          <Text style={{ fontSize: 14, color: "#3d2a71" }}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getCategories}
        keyExtractor={(item,index) => index}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-between", marginTop: 10 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#F5F5F5",
              borderRadius: 10,
              padding: 10,
              width: "48%",
              marginBottom: 15,
              position: "relative",
            }}
          >
            <TouchableOpacity onPress={()=>{userData!=null?navigation.navigate("Home",{screen:"Rice Products"}):navigation.navigate("Dashboard")}}>
            <Image
              source={{ uri: item.categoryLogo }}
              style={{ width: width/2.5, height: 200, borderRadius: 10 ,alignSelf:"center"}}
            />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 5,alignSelf:"center" }}>{item.categoryName}</Text>
           <TouchableOpacity style={{backgroundColor:"#b1a9c6",padding:10,borderRadius:10,marginTop:10,alignItems:"center"}} 
           
            onPress={()=>{userData!=null?navigation.navigate("Home",{screen:"Rice Products"}):navigation.navigate("Dashboard")}}
            >
              <Text>Show Items</Text>
           </TouchableOpacity>
            
          </View>
        )}
      />
</>
</ScrollView>
</>
:
<View style={styles.loaderContainer}>
  <LottieView 
          source={require("../assets/AnimationLoading.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        </View>
        }

        {userData==null?
         <LoginModal visible={loginModal} onClose={() => setLoginMobal(false)} />
         :null}

         </View>
  );
};

export default ServiceScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: "#3e2723",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },
  imageContainer: {
    width:width*1,
    justifyContent: "center",
    alignItems: "center",
    height:350,
    marginTop:-85
  },
  image: {
    width: width * 0.9, 
    height: height * 0.6, 
    resizeMode: "contain", 
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 10,
  },
  activeDot: {
    backgroundColor: "#3d2a71",
    width: 30,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
  IDcontainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#007bff",
  },
})
