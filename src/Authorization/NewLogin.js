import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity,StyleSheet,Dimensions,Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AccessToken } from "../../Redux/action";
const {width,height} =Dimensions.get('window');
import BASE_URL from "../../Config"
import { COLORS } from '../../Redux/constants/theme';
const NewLogin = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [loginData,setLoginData] = useState({
    mobileNumber:"",
    mobileNumber_Error:false,
    validMobileNumber_Error:false,
    otp:"",
    otp_Error:"",
    validOtp_Error:"",
    loading:false,
    showOtp:false,
    otpSession:"",
    otpGeneratedTime:"",
    saltSession:"",
  })

  const handleSendOtp = async () =>{
    console.log("sravani");
    
      if(loginData.mobileNumber ==""||loginData.mobileNumber== null){
        setLoginData({...loginData,mobileNumber_Error:true})
        return;
      }
      if(loginData.mobileNumber.length!=10){
        setLoginData({...loginData,validMobileNumber_Error:true})
        return;
      }
      console.log("mobileNumber",loginData.mobileNumber);
      let data ={
      whatsappNumber: "+91"+loginData.mobileNumber,
      userType: "Login",
      registrationType: "whatsapp",
      }
      console.log({data});
      setLoginData({...loginData,loading:true})
      try {
        const response = await axios.post(
          
          BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
          data
        );
        console.log("Send Otp");
        if(response.data.mobileOtpSession){
          setLoginData({
            ...loginData,
            otpSession:response.data.mobileOtpSession,
            otpGeneratedTime:response.data.otpGeneratedTime,
            saltSession:response.data.salt,
            loading:false,
            showOtp:true
          })
        }else{
          Alert.alert("Error", "Failed to send OTP. Try again.")
        }
      }catch(error){
        console.log(error);
         setLoginData({...loginData,showOtp:false})
         Alert.alert("Sorry", "You  are not registered,Please signup");
        //  if(error.response.status==400){
        //   navigation.navigate("RegisterScreen")
        //  }
      }finally{
        setLoginData({...loginData,loading:false})
      }
  }


  const handleVerifyOtp =()=>{
    if(loginData.otp==""||loginData.otp==null){
      setLoginData({...loginData,otp_Error:true})
      return false;
    }
    if(loginData.otp.length!=4){
      setLoginData({...loginData,validOtp_Error:true})
      return false;
    }
    setLoginData({...loginData,loading:true});
    let data ={
      whatsappNumber: "+91"+loginData.mobileNumber,
      whatsappOtpSession:loginData.otpSession,
      whatsappOtpValue:loginData.otp,
      userType: "Login",
      salt: loginData.saltSession,
      expiryTime:loginData.otpGeneratedTime,
    }
    console.log({data});
     axios({
        method: "post",
             url: BASE_URL+`user-service/registerwithMobileAndWhatsappNumber`,
             data: data,
     }).then(async(response)=>{
         console.log("response",response.data);
         setLoginData({...loginData,loading:false,showOtp:false})
        if(response.data.accessToken != null){
           dispatch(AccessToken(response.data));
           await AsyncStorage.setItem("userData", JSON.stringify(response.data));
           await AsyncStorage.setItem("mobileNumber", loginData.mobileNumber);
            setLoginData({...loginData,otp:""})
            console.log("varalakshmi");
              if (
                        response.data.userStatus == "ACTIVE" ||
                        response.data.userStatus == null
                      ) {
                        // navigation.navigate("Home");
                        navigation.navigate("Home",{screen:"UserDashboard"});
                      } else {
                        Alert.alert(
                          "Deactivated",
                          "Your account is deactivated, Are you want to reactivate your account to continue?",
                          [
                            { text: "Yes", onPress: () => navigation.navigate("Active") },
                            { text: "No", onPress: () => BackHandler.exitApp() },
                          ]
                        );
                      }
                    } else {
                      Alert.alert("Error", "Invalid credentials.");
                    }
        }).catch((error)=>{
          setLoginData({...loginData,loading:false})
          console.error("OTP verification failed:", error);
          setLoginData({...loginData,otp_Error:false,validOtp_Error:true})
          console.log(error.response);
              if(error.response.status ==400){
                 Alert.alert("Failed", "Invalid Credentials");
                
              }
        })
  }
  return (
    <View  style={styles.container} >
        <Text>hai</Text>
        <View style={styles.imageContainer}>
        <Image style={styles.image}source={require("../../assets/Images/logo.png")}/>
        </View>
        <View style={styles.scrollContainer}>
        <Text>hai</Text>
        </View>
        <View style={styles.loginContainer}>
           <Text style={styles.title}>Login</Text>
           <View style={{flexDirection:"row"}}>
              <View style={styles.fixedPrefix}>
                            <Image
                              source={{
                                uri: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
                              }}
                              style={styles.flag}
                            />
                            <View style={styles.divider} />
                            <Text style={styles.countryCode}>+91</Text>
                          </View>
               <TextInput style={styles.inputContainer}
                  placeholder="Enter Whatsapp Number"
                  keyboardType="numeric"
                  dense={true}
                  maxLength={10}
                  // error={loginData.mobileNumber_Error}
                  // activeOutlineColor={
                  //   loginData.mobileNumber_Error?"red":COLORS.title2
                  // }
                  // accessibilityValue={loginData.mobileNumber}
                  // editable={({...loginData,showOtp:false})}
                  onChangeText={(text)=>{
                    setLoginData({
                      ...loginData,
                      mobileNumber:text,
                      mobileNumber_Error:false,
                      validMobileNumber_Error:false
                    })
                  }}
               />
               {loginData.mobileNumber_Error ?(
                  <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  Mobile Number is mandatory
                </Text>
               ):null}
               {loginData.validMobileNumber_Error?(
                   <Text
                   style={{
                     color: "red",
                     fontSize: 16,
                     fontWeight: "bold",
                     alignSelf: "center",
                   }}
                 >
                   Invalid Mobile Number
                 </Text> 
               ):null}
           </View>
           <TouchableOpacity style={styles.sendOtp} onPress={()=>handleSendOtp()}>
           <Text>Send Otp</Text>
           </TouchableOpacity>
           {loginData.showOtp?(
               <View>
                </View>
           ):null}
        </View>
    </View>
  )}

export default NewLogin;

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#DDDAF7",
    flex:1,
    borderColor:"#000",
    height:height/2,
    width:width,
    borderWidth:2,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  imageContainer:{
    height:height/7,
    width:width,
    borderColor:"#000",
    borderWidth:2
  },
  image:{
     width:width*0.9,
     height:height/9,
     borderRadius:20
  },
  scrollContainer:{
    marginTop:20,
    width:width,
    height:height/6,
    borderColor:"#000",
    borderWidth:2,
  },
  loginContainer:{
    marginTop:380,
    position:"absolute",
    backgroundColor:"#fff",
    height:height/2.5,
    width:width*0.9,
    borderRadius:20,
    alignSelf:"center",
    alignItems:"center"

  },
  title:{
    fontWeight:"bold",
    color:"#000",
    fontSize:20,
    marginTop:30
   
  },
  inputContainer:{
    marginTop:30,
    width:width*0.5,
    height:height/17,
    borderColor:"#000",
    borderRadius:2,
    borderWidth:1.5,
    padding:10
  },
 
 fixedPrefix: {
  marginTop:30,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  flag: {
    width: 24,
    height: 18,
    resizeMode: "contain",
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  sendOtp: {
    width: width * 0.7,
    height: 45,
    backgroundColor:COLORS.primary,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    margin: 20,
  }

 
  
})