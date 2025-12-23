;
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import BASE_URL from '../../../../../Config'
// 1️ Withdraw amount for customer
export const withdrawAmountForCustomer = async (userId, requestAmount) => {
  console.log("Withdrawing amount:", requestAmount, "for user:", userId);
  return axios.post(
    `${BASE_URL}order-service/withdrawalAmountForCustomer`,
    {
      requestAmount,
      status: "", // <-- required field (send empty if not needed)
      userId,
    },
   
  );
};



// 2 Get withdrawal history by customerId
export const getWithdrawalByCustomerId = async (customerId) => {
  console.log("Getting withdrawal history for customer:", customerId);
  return axios.get(
    `${BASE_URL}order-service/withdrawalRequestBasedOnId`,
    {
      params: { customerId }, 
    }
  );
};


//3 for verifying the bank details
export const verifyBankDetails = async (accountNumber,ifscCode) => {
  console.log("Verifying bank details:",accountNumber,ifscCode);
  return axios.post(`${BASE_URL}order-service/verifyBankAccountAndIfsc`,null,{
    params: {
      bankAccount:accountNumber,
      ifscCode:ifscCode
    } 
  })
}


// 4 Update customer bank details
export const saveOrUpdateCustomerBank = async (bankDetails) => {
  console.log("Saving/updating customer bank details:", bankDetails);
  return axios.patch(
    `${BASE_URL}order-service/saveBankDetails`,null,
    {
      params: {
        bankAccount: bankDetails.bankAccount,
        ifscCode: bankDetails.ifscCode,
        userId: bankDetails.userId,
      },
    }
  );
};


// 5 Get customer details by Id
export const getCustomerDetailsById = async (customerId) => {
  console.log("for getting customer bank details by id");
return axios.get(`${BASE_URL}order-service/bankDetailsBasedOnCustomerId`, {
  params: { customerId }
});

};


// 6 Get wallet withdrawal amount
export const getWalletWithdrawalAmount = async (customerId) => {
  console.log("into the withdrawal function", customerId);
  return axios.get(`${BASE_URL}order-service/walletWithdrawalAmount`, {
    params: { customerId },
  });
};


// 7 to know whether user subscribed premium plan or not
 export const checkPremiumSubscription = async (customerId) => {
  const url = `${BASE_URL}order-service/premiumPlan?customerId=${customerId}`;
  console.log("Checking premium subscription with URL:", url);
  return axios.get(`${BASE_URL}order-service/premiumPlan`, {
    params: { customerId },
  });
};


