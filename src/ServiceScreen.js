

import React,{useState,useEffect,useCallback} from "react";
import { View, Text, Image, TextInput, FlatList, TouchableOpacity,ScrollView,
          BackHandler, Dimensions ,StyleSheet,Alert} from "react-native";
import { Ionicons, FontAwesome,AntDesign } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch,useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import BASE_URL,{userStage} from "../Config"
const{height,width}=Dimensions.get('window')
import { useNavigationState } from '@react-navigation/native';
import { ActivityIndicator } from "react-native-paper";
import LottieView from "lottie-react-native";


const services = [
  { id: "1", name: "Free Rudraksha", image: require("../assets/tick.png"),screen:"FREE RUDRAKSHA" },
  { id: "2", name: "Free Rice Samples", image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Mazda_logo_with_emblem.png",screen:"FREE CONTAINER" },
  { id: "3", name: "Free AI & Gen AI", image: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" ,screen:"FREE AI & GEN AI"},
  { id: "4", name: "Study Abroad", image: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",screen:"STUDY ABROAD" },
  { id: "5", name: "Cryptocurrency", image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Mazda_logo_with_emblem.png" ,screen:"Crypto Currency"},
  { id: "6", name: "Legal Knowledge Hub", image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Mazda_logo_with_emblem.png",screen:"LEGAL SERVICE" },
  { id: "7", name: "My Rotary", image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Mazda_logo_with_emblem.png",screen:"MY ROTARY " },
  { id: "8", name: "We are Hiring", image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Mazda_logo_with_emblem.png" ,screen:"We Are Hiring"},
  { id: "89", name: "Manufacturing Services", image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Mazda_logo_with_emblem.png" ,screen:"Machines"},

];

const images = [
  require("../assets/ricecard1.png"),
  require("../assets/ricecard2.png"),
];

const ComboRice = [
  {
    id: "1",
    name: "Tesla Model 3",
    price: "$45,590",
    rating: 4.5,
    image: "https://tesla-cdn.thron.com/delivery/public/image/tesla/d6b78c35-71bc-4b2b-a65d-e46a7c705ab1/bvlatuR/std/2880x1800/Desktop-Model3",
  },
  {
    id: "2",
    name: "Tesla Model X",
    price: "$25,680",
    rating: 4.8,
    image: "https://tesla-cdn.thron.com/delivery/public/image/tesla/700b6b26-0ed0-4cb6-92b2-5c53ff8d731e/bvlatuR/std/2880x1800/Desktop-ModelX",
  },
  {
    id: "3",
    name: "Ford Mustang",
    price: "$32,500",
    rating: 4.7,
    image: "https://www.motortrend.com/uploads/sites/5/2019/02/2019-ford-mustang-gt-pp2-coupe-angular-front.png",
  },
  {
    id: "4",
    name: "Chevrolet Blazer",
    price: "$28,000",
    rating: 4.6,
    image: "https://di-uploads-pod30.dealerinspire.com/lovechevrolet/uploads/2020/05/Blazer-1.png",
  },
  
];

const ServiceScreen = () => {
  const userData = useSelector((state) => state.counter);
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const[data,setData]=useState([])
  const[getCategories,setGetCategories]=useState([])
  const[loading,setLoading]=useState(false)
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


  function getAllCampaign() {
    setLoading(true)
    axios({
      method: "get",
      url:
        userStage == "test"
          ? BASE_URL + "marketing-service/campgin/getAllCampaignDetails"
          : null,
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
        userStage == "test"
          ? BASE_URL + "product-service/showItemsForCustomrs"
          : null,
    })
    .then((response) => {
      setLoading(false)
      console.log(response.data)
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
},[])



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
          <AntDesign name="logout" size={30} color="black" />
        </TouchableOpacity>
        
        :null}

      </View>

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
          <Image source={item} style={{ width:"97%",height: "42%", }} />

          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
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
      <View style={{marginBottom:10,height:180,}}>
      <FlatList
        data={data}
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
                        console.log("campaignType",item.campaignType || item.screen);
                        
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
                  }}         >
            <Image source={item.image} style={{ width: 70, height: 70, resizeMode: "contain" }} />
            <Text style={{ fontSize: 12, marginTop: 20 ,textAlign:"center"}}>{item.name || item.campaignType}
            </Text>
          </TouchableOpacity>
        )}
      />
      </View>

      {/* Popular Categories List */}
      <View style={{ flexDirection: "row", justifyContent: "space-between",padding:10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Popular Categories</Text>
        <TouchableOpacity onPress={()=>{userData!=null?navigation.navigate("Home",{screen:"UserDashboard"}):navigation.navigate("Dashboard")}}>
          <Text style={{ fontSize: 14, color: "#3d2a71" }}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getCategories}
        keyExtractor={(item) => item.id}
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
            <Image
              source={{ uri: item.categoryLogo }}
              style={{ width: width/2.5, height: 200, borderRadius: 10 ,alignSelf:"center"}}
            />
            
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 5,alignSelf:"center" }}>{item.categoryName}</Text>
           <TouchableOpacity style={{backgroundColor:"#b1a9c6",padding:10,borderRadius:10,marginTop:10,alignItems:"center"}} 
            // onPress={()=> navigation.navigate("Rice Product Detail", {
            //   details: item,
            //   name: item.categoryName,
            //   image: item.ategoryLogo,
            // })}
            onPress={()=>{userData!=null?navigation.navigate("Home",{screen:"UserDashboard"}):navigation.navigate("Dashboard")}}
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
    width:width/1,
    justifyContent: "center",
    alignItems: "center",
    height:240,
    top:-50
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
})
