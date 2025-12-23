// CustomerBankInfo.js
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { getCustomerDetailsById } from "../Components/Withdrawapis";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const CustomerBankInfo = ({ onEditAccount, onAddAccount, refreshBankInfo }) => {
  const userData = useSelector((state) => state.counter);
  const customerId = userData.userId;

  const [bankAccount, setBankAccount] = useState(null);
  const [showFull, setShowFull] = useState(false);

  // Centralized fetch function
  const fetchCustomerBankInfo = async () => {
    try {
      const response = await getCustomerDetailsById(customerId);
      const account = response.data || null;
      setBankAccount(account);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch bank account.");
    }
  };

  // Fetch on focus (existing behavior)
  useFocusEffect(
    useCallback(() => {
      fetchCustomerBankInfo();
    }, [])
  );

  // NEW: Listen for external refresh trigger
  useEffect(() => {
    if (refreshBankInfo) {
      fetchCustomerBankInfo();
    }
  }, [refreshBankInfo]);

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "";
    const str = accountNumber.toString();
    if (str.length <= 4) return str;
    return "****" + str.slice(-4);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>💳 Bank Account Details</Text>
        <Text style={styles.subheading}>Secure payment information</Text>
      </View>

      {bankAccount ? (
        <View style={styles.accountCard}>
          <View style={styles.bankHeader}>
            <View style={styles.bankIconContainer}>
              <Text style={styles.bankIcon}>🏦</Text>
            </View>
            <View style={styles.bankNameContainer}>
              <Text style={styles.bankName}>{bankAccount.bankName}</Text>
              <Text style={styles.accountStatus}>✅ Verified Account</Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Account Number</Text>
                <Text style={styles.detailValue}>
                  {showFull
                    ? bankAccount.accountNumber
                    : maskAccountNumber(bankAccount.accountNumber)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.showFullButton}
                onPress={() => setShowFull(!showFull)}
              >
                <Text style={styles.showFullText}>
                  {showFull ? "Hide Full" : "Show Full"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>IFSC Code</Text>
              <Text style={styles.detailValue}>{bankAccount.ifscCode}</Text>
            </View>

            {bankAccount.branch && (
              <>
                <View style={styles.separator} />
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Branch</Text>
                  <Text style={styles.detailValue}>{bankAccount.branch}</Text>
                </View>
              </>
            )}

            {bankAccount.accountHolderName && (
              <>
                <View style={styles.separator} />
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Account Holder</Text>
                  <Text style={styles.detailValue}>
                    {bankAccount.accountHolderName}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.noAccountCard}>
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>🏦</Text>
            </View>
            <Text style={styles.emptyTitle}>No Bank Account Found</Text>
            <Text style={styles.emptySubtitle}>
              Add your bank account to start receiving payments securely
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddAccount && onAddAccount()}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Add Bank Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CustomerBankInfo;


const styles = StyleSheet.create({
 
  container: {
    marginBottom: 7,
    width: "100%",
    padding:10
  },
  headerContainer: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: "#666666",
    fontWeight: "400",
  },
  accountCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },

  // Bank Header Section
  bankHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  bankIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#e8f4fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bankIcon: {
    fontSize: 22,
  },
  bankNameContainer: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },
  accountStatus: {
    fontSize: 11,
    color: "#28a745",
    fontWeight: "500",
  },

  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailItem: {
    flex: 1,
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 11,
    color: "#666666",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 15,
    color: "#333333",
    fontWeight: "600",
  },

  // Show Full Button
  showFullButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  showFullText: {
    fontSize: 11,
    color: "#007bff",
    fontWeight: "500",
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: "#e6e6e6",
    marginVertical: 10,
  },

  editButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#007bff",
    shadowOffset: { 
      width: 0, 
      height: 1 
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#28a745",
    shadowOffset: { 
      width: 0, 
      height: 1 
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    minWidth: 180,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },


  noAccountCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  emptyStateContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  emptyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyIcon: {
    fontSize: 28,
    opacity: 0.4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});