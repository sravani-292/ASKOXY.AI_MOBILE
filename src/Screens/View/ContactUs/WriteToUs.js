import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ToastAndroid,
  Platform,
  ActivityIndicator,
  Dimensions,
  Touchable,
  TouchableOpacity,
  ScrollView
} from "react-native";
import React, { useState,useEffect,useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import BASE_URL ,{userStage}from "../../../../Config";
import * as DocumentPicker from "expo-document-picker";
import { FormData } from "formdata-node";
import { COLORS } from "../../../../Redux/constants/theme";
import Icon from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage";

const{height,width}=Dimensions.get('window')

const WriteToUs = ({navigation,route}) => {
    const accessToken = useSelector((state) => state.counter);
    const fd = new FormData();
    const [ticketId,setTicketId] = useState("")
    // console.log("route",accessToken);

    // useEffect(()=>{
      
    //    if(route.params=="" || route.params==undefined || route.params==null){
    //      setTicketId("")
    //   }
    //   else{
    //     setTicketId(route.params)
    //   }
    // },[])


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "", 
    query: "",
    query_error:false,
    fileName: "",
    documentId: "",
    uploadStatus:'',
    uploadLoader:false,
    loading:false
  });
  // Validation and Submit Handler


  useFocusEffect(
    useCallback(() => {
      getProfileDetails();
    }, [])
  );

  function getProfileDetails() {
    axios.get(BASE_URL+`user-service/customerProfileDetails?customerId=${accessToken.userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`,
    }
    })
    .then(function (response) {
      console.log("customer data1",response.data);
      if(response.data.whatsappVerified==true || response.data.mobileVerified==true){
      setFormData({
        ...formData, name: `${response.data.firstName} ${response.data.lastName}`,
                    email: response.data.email,
                    mobileNumber: response.data?.whatsappNumber || response.data?.mobileNumber
      });
    }else{
      Alert.alert(
        "Incomplete Profile",
        "Please fill out your profile to proceed.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Profile"), 
          },
        ]
      );
    }
    })
    .catch(function (error) {
      console.log(error.response);
    });
  }


  

  const handleSubmit = () => {
    if (formData.name == null) {
      navigation.navighate('Profile Screen')
    }

    else {
      const { name, email, mobileNumber, query } = formData;

      // Validation
      if (query=="" || query==null) {
        setFormData({ ...formData, query_error: true });
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        Alert.alert("Error", "Invalid email format!");
        return;
      }
      // if (!/^\d{13}$/.test(mobileNumber)) {
      //   Alert.alert("Error", "Mobile number must be 10 digits!");
      //   return;
      // }

      // Success
      // Alert.alert("Success", "Your query has been submitted!");
      // console.log(formData);
      let data
if(route.params=="" || route.params==undefined){
   data =
  {
    "adminDocumentId": "",
    "askOxyOfers": "FREESAMPLE",
    "comments": "",
    "email": formData.email,
    "id": "",
    "mobileNumber": formData.mobileNumber,
    
    "projectType": "ASKOXY",
    "query": formData.query,
    "queryStatus": "PENDING",
    "resolvedBy": "",
    "resolvedOn": "",
    "status": "",
    "userDocumentId": formData.documentId || "",
    "userId": accessToken.userId
  }
}
else{
 data =
  {
    "adminDocumentId": "",
    "askOxyOfers": "FREESAMPLE",
    "comments": formData.query,
    "email": formData.email,
    "id": route.params.ticketId,
    "mobileNumber": formData.mobileNumber,
    "projectType": "ASKOXY",
    "query": route.params.query,
    "queryStatus": "PENDING",
    "resolvedBy": "customer",
    "resolvedOn": "",
    "status": "",
    "userDocumentId": formData.documentId || "",
    "userId": accessToken.userId
  }

}
      console.log({data})
      console.log("form data query",formData.query);
      
      setFormData({...formData,loading:true})
        axios.post(
          BASE_URL + "user-service/write/saveData",
          data
          ,{    
        headers: {
          Authorization: `Bearer ${accessToken.accessToken}`,
        },
      })
        .then(function (response) {
          console.log(response.data)
          Alert.alert("Success", "You have sucessfully submitted the query",[{
            text:"ok",onPress:()=>navigation.navigate('Ticket History')
          }]);
          console.log("formdataquery",formData.query);
          
          setFormData({...formData,loading:false,fileName:"",query:""})

        })
        .catch(function (error) {
          console.log(error.response)
          Alert.alert("Failed", error.response.data.message)
          setFormData({...formData,loading:false})

        })


    }
  };




  const handleFileChange = async () => {
    
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      allowsEditing: false,
      aspect: [4, 4],
    })
      .then(
         (response) => {
        console.log("response",response);
        if (response.canceled == false) {
          let { name, size, uri } = response.assets[0];
          // console.log("");
          // ------------------------/

          if (Platform.OS === "android" && uri[0] === "/") {

            uri = `file://${uri}`;
            console.log(uri);
            uri = uri.replace(/%/g, "%25");
            console.log(uri);
          }
          // ------------------------/
          let nameParts = name.split(".");
          let fileType = nameParts[nameParts.length - 1];
          var fileToUpload = {
            name: name,
            size: size,
            uri: uri,
            type: "application/" + fileType,
          };
          // console.log(fileToUpload, "...............file");
          fd.append("file", fileToUpload);
          fd.append("fileType", "kyc");
          fd.append("projectType","ASKOXY")

          // console.log(fd);
          setFormData({...formData,uploadLoader:true})
          axios({
            method: "post",
            url:BASE_URL+`user-service/write/uploadQueryScreenShot?userId=${accessToken.userId}`,
            data: fd,
            headers: {
              Authorization: `Bearer ${accessToken.accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          })
            .then(function (response) {
               console.log("uploadQueryScreenShot",response.data);
               Alert.alert("Success","File uploaded successfully")
               setFormData({...formData,fileName:fileToUpload.name,documentId:response.data.id,uploadLoader:false})
              // setLoading(false);
              // setmodal1(true);
              // getpan();
            })
            .catch(function (error) {
              // setLoading(false);
              console.log(error.response.data);
              Alert.alert(error.response.data.error);
              setFormData({...formData,uploadLoader:false})
          //     if (error.response.data.errorCode == 100) {
          //       setmodal3(true);
          //     } else {
          //       setmodal2(true);
          //     }
            });
          // setPanPicurl(fileToUpload.uri);
        }
      })
      .catch(function (error) {});
  };





  return (
    <View style={{ flex: 1, padding: 20 }}>

<TouchableOpacity onPress={()=>navigation.navigate('Ticket History')} style={styles.btn}>
  <Text style={{color:"white"}}>Ticket History</Text>
</TouchableOpacity>
        <ScrollView
               style={{ flex: 1 }}
               contentContainerStyle={{ flexGrow: 1, padding: 5 }}
             >
         
      <Text style={styles.header}>Write a Query</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        editable={false}
        // disabled={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        keyboardType="phone-pad"
        value={formData.mobileNumber}
        onChangeText={(text) =>
          setFormData({ ...formData, mobileNumber: text })
          }
          editable={false}
          // disabled={true}

      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter Your Query"
        multiline
        value={formData.query}
        onChangeText={(text) => setFormData({ ...formData, query: text,query_error:false })}
      />
      {formData.query_error == true ?
        <Text style={{ color: "red", fontWeight: "bold", marginBottom: 5 ,alignSelf:"center"}}>Query is Mandatory</Text>
      : null}

    {/* {ticketId==""? */}
    {route.params==undefined || route.params==""?
    <>
    {formData.uploadLoader==false?
      <TouchableOpacity style={styles.box} onPress={handleFileChange}>
        <View style={{ alignItems: "center", justifyContent: "center" ,height:"auto",padding:5}}>
          <Icon name="cloud-upload" size={50} color="gray" />
          <Text>Upload a file</Text>
          {formData.fileName != null ? (
            <Text style={{color:"green",marginBottom:5}}>{formData.fileName}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
      :
      <View style={styles.box}>
        <ActivityIndicator size={30} color="green"/>
      </View>
      }
      </>
    :null}

{formData.loading==false?
<TouchableOpacity onPress={()=>handleSubmit()} style={styles.submitbtn}>
  <Text style={{color:"white",fontWeight:"bold"}}>Submit</Text>
</TouchableOpacity>
:
<View style={styles.submitbtn}>
  <ActivityIndicator size={30} color="white"/>
</View>
}
</ScrollView>
    </View>
  );
};

export default WriteToUs;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: width * 0.9,
    alignSelf:"center"
  },
  box: {
    textDecorationStyle: "dashed",
    // textDecorationLine:"underline",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: width * 0.9,
    height: "auto",
    alignSelf:"center"
    
  },
  submitbtn:{
    backgroundColor:COLORS.services,
    width:width*0.8,
    alignSelf:"center",
    padding:10,
    alignItems:"center",
    borderRadius:10
  },
  btn:{
    backgroundColor:COLORS.services,
    width:"auto",
    padding:5,
    alignSelf:"flex-end",
    alignItems:"center",
    marginHorizontal:15
  }
});
