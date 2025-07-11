import BASE_URL from "../Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";

// for getting customer cart data
export const handleCustomerCartData = async (customerId) => {
  console.log("customerId", customerId);

  try {
    const response = axios.get(
      `${BASE_URL}cart-service/cart/userCartInfo?customerId=${customerId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching customer cart data:", error);
   
    throw error;
  }
};

// for adding or increment cart data
export const handleUserAddorIncrementCart = async (data) => {
  console.log("data", data);

  try {
    const response = axios.post(
      `${BASE_URL}cart-service/cart/addAndIncrementCart`,
      {
        customerId: data.customerId,
        itemId: data.itemId,
      }
    );
    console.log("response", response);

    return response;
  } catch (error) {
    console.error("Error fetching customer cart data:", error);
    throw error;
  }
};

// for removal or decrement cart data
export const handleDecrementorRemovalCart = async (data) => {
  console.log({ data });
  try {
    const response = axios.patch(`${BASE_URL}cart-service/cart/minusCartItem`, {
      customerId: data.customerId,
      itemId: data.itemId,
    });

    return response;
  } catch (error) {
    console.error("Error fetching customer cart data:", error.response);
    throw error;
  }
};

// for removing item from the cart
export const handleRemoveItem = async (item) => {
  console.log({ item });
  let requestBody = {
    id: item,
  };
  console.log("requestBody", requestBody);
  try {
    const response = await axios({
      method: "delete",
      url: `${BASE_URL}cart-service/cart/remove`,
      data: requestBody,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(" cart response", response.data);
  } catch (error) {
    console.log(error.response);
  }
};

// for removing free item
export const handleRemoveFreeItem = async (item) => {
  console.log("into free item functionality");
  console.log(item);
  try {
    const response = await axios.delete(
      `${BASE_URL}cart-service/cart/removeFreeContainer`,
      {
        data: item,
      }
    );
    console.log("Cart response", response);
    return response;
  } catch (error) {
    console.error("Error in handleRemoveFreeItem:", error);
    throw error;
  }
};

//for getting Offers eligible for customer
export const getCustomerEligibleOfferDetails = async (CustomerId) => {
  console.log("getCustomerEligibleOfferDetails");
  try {
    const response = await axios.get(
      `${BASE_URL}cart-service/cart/userEligibleOffer/${CustomerId}`
    );
    console.log("offer response", response);
    return response.data;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

// for getting profile data
export const handleGetProfileData = async (customerId) => {
  console.log("customerId", customerId);

  console.log("into the profile data call");

  try {
     const response = await axios({
      method:"Get",
      url:`${BASE_URL}user-service/customerProfileDetails?customerId=${customerId}`,
      // headers:{
      //   Authorization:`Bearer ${token}`
      // }
     })
       return response
  } catch (error) {
    // console.error("Error fetching profile data:", error);
    throw error;
  }
};


export const getCoinsCount = async(customerId)=>{
  console.log("into the coins function");
  try{
    const response = await axios.get(
      `${BASE_URL}user-service/getProfile/${customerId}`
    );
    console.log("response",response);
    
  }catch(error){
    console.log("error",error);
    
  }
  
}


// FOR SERVICES AND CAMPAIGNS  APIS
export const getAllCampaignDetails = async()=>{
  console.log("into  the campaign call");
  try{
  const response = await axios.get(`${BASE_URL}marketing-service/campgin/getAllCampaignDetails`)
  return response;
 } catch(error){
  console.log("error",error.response);
}
}


export const getUserFeedback = async (data)=>{
  console.log("inot the function for getting to know the whether the user showed intrest or not");
  try{
  const response =  await axios.post( BASE_URL + `marketing-service/campgin/allOfferesDetailsForAUser`,data )
  console.log("response",response);
  return response;
  }
  catch(error){
    console.log("error",error);
     return error
  }
}

export const submitUserIntrest = async(data)=>{
console.log("into the intrest submit function",data);
try{
const response = await axios.post(BASE_URL + "marketing-service/campgin/askOxyOfferes", data)
console.log("user intrest",response);
return response
}
catch(error){
  console.log("error",error);
  return error
}
}