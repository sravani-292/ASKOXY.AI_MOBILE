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
export const handleUserAddorIncrementCart = async (data, type) => {
  console.log("data", {data}, {type});

var data
  if(type==="COMBO"){
 data= {
        customerId: data.customerId,
        itemId: data.itemId,
        status:"COMBO",
        cartQuantity:data.cartQuantity
      }
  }
  else{
     data= {
        customerId: data.customerId,
        itemId: data.itemId,
        cartQuantity:data.cartQuantity
      }
  }
  console.log("api hitting post data",{data})
  try {
    // Step 1: Always try to add to cart first
    const cartResponse = await axios.post(
      `${BASE_URL}cart-service/cart/addAndIncrementCart`,
     data
    );

    console.log("Cart API response", cartResponse.data);

    // Step 2: If type is ADD, try to fetch combo offers
    if (type === "ADD") {
      try {
        const comboResponse = await axios.get(
          `${BASE_URL}product-service/getComboInfo/${data.itemId}`
        );

        console.log("Combo offer response", comboResponse.status);

        if (comboResponse.status == 200) {
          console.log("hsgxf")
          return {
            cartResponse: cartResponse.data,
            comboOffers: comboResponse.data,
          };
        }
      } catch (comboError) {
        console.warn("Combo fetch failed, proceeding without it", comboError);
        console.log("comboError", comboError.response);
      }
    }

    // Step 3: Default return only cart response
    return {
      cartResponse: cartResponse.data,
    };
  } catch (error) {
    console.error("Add to cart failed:", error);
    throw new Error("Failed to add item to cart. Please try again.");
  }
};




export const getAllComboOffers = async (itemId) => {

  axios({
    method:"get",
    url:BASE_URL+`product-service/getComboInfo/${itemId}`
  })
  .then((response)=>{
    console.log("getComboInfo Responze",response)
    return response
  })
  .catch((error)=>{
    console.log(error.response)
  })
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

export const feedbackget = async (customerId,order_id)=>{
  console.log("into the feedback get call");
  try{
    const response = await axios.get(`${BASE_URL}order-service/feedback?feedbackUserId=${customerId}&orderid=${order_id}`)
    // console.log("response",response);
    return response;
  }catch(error){
    console.log("error",error);
  }
}

export const getOrders = async (userId) => {
  console.log("into the get orders call", userId);
  try {
    const response = await axios.post(
      `${BASE_URL}order-service/getAllOrders_customerId`,
         {userId: userId}
    );
    // console.log("response", response.data[0]);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response);
    throw error;
 }
};

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


export const getAllAddresss = async(customerId)=>{
  console.log("into the get all address call",customerId);
    try {
      const response = await axios({
        url: BASE_URL + `user-service/getAllAdd?customerId=${customerId}`,
        method: "GET",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      console.log("All addresss are :", response.data);
      return response;
    } catch (error) {
      console.error("Error fetching order address data:", error);
       return error;
    }

}