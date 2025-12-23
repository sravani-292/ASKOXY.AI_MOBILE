import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,

} from "react-native";
import {
  getWalletWithdrawalAmount,
  withdrawAmountForCustomer,
  getCustomerDetailsById,
  saveOrUpdateCustomerBank,
  verifyBankDetails,
} from "../Components/Withdrawapis";
import axios from "axios";
import CustomerBankInfo from "./CustomerBankInfo";
import { useSelector } from "react-redux";

const WithdrawRequest = () => {
  const userData = useSelector((state) => state.counter);
  const customerId = userData.userId;

  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [branch, setBranch] = useState("");
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [step, setStep] = useState(1); // 1 = enter amount, 2 = bank details, 3 = confirmation


  //state to trigger bank info refresh
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  useEffect(() => {
    getCustomerBankInfo();
  }, []);

  const getCustomerBankInfo = async () => {
    try {
      const res = await getCustomerDetailsById(customerId);
      console.log("Customer Bank Info Response:", res);

      if (res?.data) {
        const acc = res?.data;
        setBankName(acc.bankName);
        setAccountNumber(acc.accountNumber);
        setIfsc(acc.ifscCode);
        // setBranch(acc.branch);
        setHasBankDetails(true);
      }
    } catch (error) {
      console.log("Error fetching bank account:", error.response);
      
      Alert.alert("Error", "Failed to fetch bank account.");
    }
  };

  //  Validate amount
  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmount(numericValue);
    setIsValidAmount(numericValue.length > 0 && parseFloat(numericValue) > 0);
  };

  //  Check balance
  const checkBalanceAndProceed = async () => {
    try {
      const res = await getWalletWithdrawalAmount(customerId);
      const availableBalance = res.data?.withDrawalAmount || 0;

      if (parseFloat(amount) <= availableBalance) {
        setStep(2);
      } else {
        Alert.alert(
          "Insufficient balance",
          "Your balance is too low for this transaction."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Unable to check wallet balance.");
    }
  };

  // Validate IFSC with Razorpay API
  const validateIFSC = async (code) => {
    if (code.length !== 11) return;
    try {
      const res = await axios.get(`https://ifsc.razorpay.com/${code}`);
      console.log("IFSC Validation Response:", res);

      setBankName(res.data.BANK);
      setBranch(res.data.BRANCH);
    } catch (err) {
      Alert.alert("Invalid IFSC", "Please enter a valid IFSC code.");
      setBankName("");
      setBranch("");
    }
  };
  
//handle verify bank details
 const handleVerifyBankDetails = async () => {
  console.log("Verifying bank details:");
  try {
    const response = await verifyBankDetails(accountNumber, ifsc); 
    console.log("Bank details verification response:", response);
    handleSaveBankDetails();
  } catch(error) {
    console.log("error in verifying bank details", error.response);
  }
}
  //  Save/Update bank details
  const handleSaveBankDetails = async () => {
    // if (!bankName) {
    //   Alert.alert("Validation Error", "Bank name is required.");
    //   return;
    // }
    if(!accountNumber){
      Alert.alert("Alert", "Account number is required.");
      return;
    }
    if(!ifsc){
      Alert.alert("Alert", "IFSC code is required.");
      return;
    }
    if(!confirmAccountNumber){
      Alert.alert("Alert", "Please confirm account number.");
      return;
    }
    if (accountNumber !== confirmAccountNumber) {
      Alert.alert("Alert", "Account numbers do not match.");
      return;
    }
     if (ifsc.length !== 11 ) {
    Alert.alert("Invalid IFSC", "Please enter a valid IFSC code.");
    return;
  }
  try {
    const response = await saveOrUpdateCustomerBank({
        bankAccount: accountNumber,
        ifscCode: ifsc,
        userId: customerId,
      });
      console.log("Bank details saved successfully.",response);
      
      Alert.alert("Success", "Bank details saved successfully.");
      setRefreshTrigger(prev => prev + 1)
      setHasBankDetails(true);
      setStep(3);
    } catch (error) {
      console.log("Error saving bank details:", error);
      
      Alert.alert("Error", "Failed to save or update bank details.");
    }
  };

  // Final withdrawal
  const handleWithdraw = async () => {
    try {
      await withdrawAmountForCustomer(customerId, amount);
      Alert.alert("Success", "Withdrawal request submitted!");
      resetForm();
    } catch (error) {
      console.log("Withdrawal request error:", error);
      Alert.alert("Error", "Withdrawal request failed.");
    }
  };

  const resetForm = () => {
    setAmount("");
    setConfirmAccountNumber("");
    setStep(1);
  };

  return (
    <View>
      <CustomerBankInfo onAddAccount={() => setStep(2)} refreshBankInfo={refreshTrigger} />

      <View style={{ padding: 10 }}>
        {/* Step 1 - Enter Amount */}
        {step === 1 && (
          <>
            <Text style={styles.label}>Enter Withdraw Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              keyboardType="numeric"
              onChangeText={handleAmountChange}
              placeholder="Enter amount"
            />
            {/* {isValidAmount && (
              <Text style={styles.infoText}>Requested Amount: ₹{amount}</Text>
            )} */}
            <TouchableOpacity
              style={[styles.button, !isValidAmount && styles.buttonDisabled]}
              onPress={checkBalanceAndProceed}
              disabled={!isValidAmount}
            >
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 2 - Bank Details */}
        {step === 2 && (
          <>
            {hasBankDetails ? (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setStep(3)}
                >
                  <Text style={styles.buttonText}>Use This Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryButton]}
                  onPress={() => setHasBankDetails(false)}
                >
                  <Text style={styles.secondaryButtonText}>Edit Account</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>Account Number</Text>
                <TextInput
                  style={styles.input}
                  value={accountNumber}
                  keyboardType="numeric"
                  onChangeText={setAccountNumber}
                  placeholder="Enter account number"
                />

                <Text style={styles.label}>Confirm Account Number</Text>
                <TextInput
                  style={styles.input}
                  value={confirmAccountNumber}
                  keyboardType="numeric"
                  onChangeText={setConfirmAccountNumber}
                  placeholder="Re-enter account number"
                />

                <Text style={styles.label}>IFSC Code</Text>
                <TextInput
                  style={styles.input}
                  value={ifsc}
                  autoCapitalize="characters"
                  onChangeText={(val) => {
                    setIfsc(val.toUpperCase());
                    if (val.length === 11) validateIFSC(val.toUpperCase());
                  }}
                  placeholder="Enter IFSC code"
                />

                {/* {bankName ? (
                  <Text style={styles.infoText}>
                     {bankName.toLocaleUpperCase()}
                  </Text>
                ) : null} */}

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVerifyBankDetails()}
                >
                  <Text style={styles.buttonText}>Save Bank Details</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.secondaryButton]}
              onPress={() => setStep(1)}
            >
              <Text style={styles.secondaryButtonText}>← Edit Amount</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 3 - Confirmation */}
        {step === 3 && (
          <>
            <View style={styles.confirmationContainer}>
              <View style={styles.compactHeader}>
                <View style={styles.compactIconContainer}>
                  <Text style={styles.confirmIcon}>✓</Text>
                </View>
                <View style={styles.headerContent}>
                  <Text style={styles.compactTitle}>Confirm Withdrawal</Text>
                  <Text style={styles.compactAmount}>₹{amount}</Text>
                </View>
              </View>

              {/* Compact Bank Details */}
              <View style={styles.compactDetailsSection}>
                <View style={styles.compactDetailRow}>
                  <Text style={styles.compactLabel}>Bank:</Text>
                  <Text style={styles.compactValue}>{bankName}</Text>
                </View>
                <View style={styles.compactDetailRow}>
                  <Text style={styles.compactLabel}>Account:</Text>
                  <Text style={styles.compactValue}>{accountNumber}</Text>
                </View>

                <View style={styles.compactDetailRow}>
                  <Text style={styles.compactLabel}>IFSC:</Text>
                  <Text style={styles.compactValue}>{ifsc}</Text>
                </View>
              </View>

              {/* Compact Warning */}
              <View style={styles.compactWarning}>
                <Text style={styles.compactWarningText}>
                  ⚠️ Verify details - action cannot be undone
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
              <Text style={styles.buttonText}>Submit Withdrawal Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton]}
              onPress={() => setStep(2)}
            >
              <Text style={styles.secondaryButtonText}>
                ← Edit Bank Details
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default WithdrawRequest;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginTop: 6,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#28a745",
    backgroundColor: "#f8fff9",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#28a745",
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333333",
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 24,
    alignItems: "center",
    shadowColor: "#007bff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  buttonDisabled: {
    backgroundColor: "#9ca3af",
    shadowOpacity: 0,
    elevation: 0,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // Secondary Buttons
  secondaryButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#007bff",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#007bff",
    fontSize: 15,
    fontWeight: "600",
  },

  bankDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },

  bankDetailRowLast: {
    borderBottomWidth: 0,
  },

  bankDetailLabel: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
    flex: 1,
  },

  bankDetailValue: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },

  bankDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },

  bankDetailRowLast: {
    borderBottomWidth: 0,
  },

  bankDetailLabel: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
    flex: 1,
  },

  bankDetailValue: {
    fontSize: 15,
    color: "#333333",
    fontWeight: "600",
    flex: 1.5,
    textAlign: "right",
  },

  compactDetailRow: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  confirmationContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e8f5e8",
  },

  // Compact Header Section
  compactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  compactIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  confirmIcon: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
  },

  headerContent: {
    flex: 1,
  },

  compactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },

  compactAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: "#28a745",
  },

  compactDetailsSection: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },

  compactDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
    paddingVertical: 2,
  },

  compactLabel: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
    flex: 1,
  },

  compactValue: {
    fontSize: 13,
    color: "#333333",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },

  compactWarning: {
    backgroundColor: "#fff3cd",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  compactWarningText: {
    fontSize: 11,
    color: "#856404",
    fontWeight: "500",
    textAlign: "center",
  },
});
