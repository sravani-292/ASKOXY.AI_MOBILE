

import React,{useState,useEffect,useCallback} from "react";
import { View, Text, Image, TextInput, FlatList, TouchableOpacity,ScrollView,
          BackHandler, Dimensions ,StyleSheet,Alert} from "react-native";
import { Ionicons, FontAwesome,MaterialCommunityIcons,MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import BASE_URL,{userStage} from "../Config"
const{height,width}=Dimensions.get('window' || 'screen')
import { useNavigationState } from '@react-navigation/native';
import LottieView from "lottie-react-native";
import LoginModal from "./Components/LoginModal";
import { i } from "framer-motion/m";
import UpdateChecker from "../until/Updates";
import * as Clipboard from 'expo-clipboard';


const services = [
  { id: "1", name: "Free Rudraksha", image: require("../assets/freerudraksha.png"),screen:"FREE RUDRAKSHA" },
  { id: "2", name: "Free Rice Samples", image: require("../assets/RiceSamples.png"),screen:"FREE CONTAINER" },
  { id: "3", name: "Free AI & Gen AI", image: require("../assets/FreeAI.png") ,screen:"FREE AI & GEN AI"},
  { id: "4", name: "Study Abroad", image: require("../assets/study abroad.png"),screen:"STUDY ABROAD" },
  { id: "5", name: "Cryptocurrency", image: require("../assets/BMVCOIN1.png") ,screen:"Crypto Currency"},
  { id: "6", name: "Legal Knowledge Hub", image: require("../assets/LegalHub.png"),screen:"LEGAL SERVICE" },
  { id: "7", name: "My Rotary", image: require("../assets/Rotary.png"),screen:"MY ROTARY " },
  { id: "8", name: "We are Hiring", image: require("../assets/Careerguidance.png") ,screen:"We Are Hiring"},
  { id: "9", name: "Manufacturing Services", image: require("../assets/Machines.png") ,screen:"Machines"},

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
  const [copied, setCopied] = useState(false);

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
        // console.log("response", response.data);
        setChainId(response.data.multiChainId)
        setCoin(response.data.coinAllocated)
      })
      .catch((error) => {
        // console.log("error1", error);
        setLoading(false)
      })
  )
  :console.log("no user data");
}


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
        //  console.log({mergedData})
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
  profile()
  setLoginMobal(true)
},[userData])

// Function to truncate the ID (Example: "0x1234567890abcdef" → "0x12...ef")
const truncateId = (id) => {
  return id.length > 6 ? `${id.slice(0, 4)}...${id.slice(-4)}` : id;
};
const handleCopy = async () => {
  try {
    await Clipboard.setStringAsync(chainId);
    setCopied(true);
  } catch (error) {
    console.error('Copy error:', error);
  }
};


  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5F5", padding: 5 }}>
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
      {/* <UpdateChecker/> */}
      {userData!=null&&
      <View style={styles.IDcontainer}>
     <Text style={styles.label}>
        Blockchain ID: <Text style={styles.value}>{truncateId(chainId)}</Text>
        
      </Text>
      <TouchableOpacity 
        style={[styles.copyButton, copied ? styles.copiedButton : null,{left:-80}]} 
        onPress={handleCopy}
        activeOpacity={0.7}
      >
        <MaterialIcons 
          name={copied ? "check" : "content-copy"} 
          size={14} 
          color="#FFFFFF" 
        />
        {/* <Text style={styles.buttonText}>
          {copied ? "Copied" : "Copy"}
        </Text> */}
      </TouchableOpacity>
      <Text style={styles.label}>
        Coins: <Text style={styles.value}>{coin}</Text>
      </Text>
      </View>
}

<ScrollView>
      <View style={{marginBottom:height*0.1}}>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
          <Image source={item} style={{ width:"95%",height: "34%", }} />
         </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={{ flexDirection: "row", alignSelf: "center",marginTop:-height*0.13 }}>
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
        <TouchableOpacity onPress={()=>navigation.navigate("Rice Products",{screen:"Rice Products",category:"All CATEGORIES"})}>
          <Text style={{ fontSize: 14, color: "#3d2a71",fontWeight:"bold",marginRight:15 }}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getCategories}
        keyExtractor={(item,index) => index}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-evenly", marginTop: 10 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#ffff",
              borderRadius: 10,
              padding: 10,
              width: "45%",
              height: "100%",
              marginBottom: 15,
              position: "relative",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <TouchableOpacity onPress={()=>navigation.navigate("Rice Products",{screen:"Rice Products",category:item.categoryName})}>
            <Image
              source={{ uri: item.categoryLogo }}
              style={{ width: width/2.8, height: 150, borderRadius: 10 ,alignSelf:"center"}}
            />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 5,alignSelf:"center" }}>{item.categoryName}</Text>
           <TouchableOpacity style={{backgroundColor:"#b1a9c6",padding:10,borderRadius:10,marginTop:10,alignItems:"center",left:0,bottom:0,top:0,right:0}} 
           
            onPress={()=>navigation.navigate("Rice Products",{screen:"Rice Products",category:item.categoryName})}
            >
              <Text>Show Items</Text>
           </TouchableOpacity>
            
          </View>
        )}
      />
</View>
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
    width:width,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: height * 0.42,
    marginTop:-height*0.12
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
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5e35b1',
    padding: 6,
    // paddingHorizontal: 12,
    borderRadius: 4,
    // marginLeft:40
  },
  copiedButton: {
    backgroundColor: '#4CAF50',
    // marginLeft:40

  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 14,
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
    flexDirection:"row",
    justifyContent:"space-evenly",

  },
  value: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#007bff",
    // marginRight:10
  },
})
