import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const AccountClosureDisplay = () => {
  const data = {
    overview:
      "Termination refers to the closure of a finance account at the end of the stipulated period after the repayment of principal and profit amount in full. The Early Termination (Foreclosure) means that an account is being terminated before completion of its tenure. The User views the Account status & ensures that there is no Due from the customer/ Refund to the customer & proceeds further for closure.",
    actors: "User",
    actions: "User initiates the process for closure of Finance Account.",
    preconditions: [
      "Existing Finance Account",
      "No due/Refund to the Finance Account",
    ],
    postconditions: [
      "Finance Account Closed",
      "Customer is notified with the Finance Account status",
    ],
    workflow: {
      steps: [
        "The User initiates the process for Closure of Finance Account.",
        "User enters the agreement ID to retrieve the Finance Account for closure.",
        "The User views the status of the Finance Account, & ensures that there is no Due/ Refund to the customer.",
        "Once the Account status is viewed & there is no Due/ Refund pertaining to the Finance Account, The User closes the Finance Account.",
        "Once the Finance Account is closed the same is notified to the Customer.",
      ],
      accountDetails: [
        { name: "Agreement ID", value: "TBD" },
        { name: "Customer Name", value: "TBD" },
        { name: "Amount Financed", value: "TBD" },
        { name: "Tenure", value: "TBD" },
        { name: "Profit Rate", value: "TBD" },
        { name: "Agreement No", value: "TBD" },
        { name: "EMI", value: "TBD" },
      ],
      dues: [
        { name: "Balance Principal", value: "TBD" },
        { name: "Due Installments", value: "TBD" },
        { name: "Outstanding Payments", value: "TBD" },
        { name: "Prepayment Penalty", value: "TBD" },
        { name: "Profit on termination", value: "TBD" },
        { name: "Total Due", value: "TBD" },
      ],
      refunds: [
        { name: "Excess Amount", value: "TBD" },
        { name: "Advance Installments", value: "TBD" },
        { name: "Excess Principal", value: "TBD" },
        { name: "Excess Profit", value: "TBD" },
        { name: "Total Refund", value: "TBD" },
      ],
    },
  };

  const DetailCard = ({ item, borderColor }) => (
    <View style={[styles.detailCard, { borderLeftColor: borderColor }]}>
      <Text style={styles.detailName}>{item.name}</Text>
      <Text style={styles.detailValue}>{item.value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow Closure – Account Closure
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.paragraph}>{data.overview}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actors</Text>
          <Text style={styles.paragraph}>{data.actors}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <Text style={styles.paragraph}>{data.actions}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preconditions</Text>
          <View style={styles.listContainer}>
            {data.preconditions.map((condition, index) => (
              <Text key={index} style={styles.listItem}>• {condition}</Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Postconditions</Text>
          <View style={styles.listContainer}>
            {data.postconditions.map((condition, index) => (
              <Text key={index} style={styles.listItem}>• {condition}</Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workflow</Text>
          
          <Text style={styles.subsectionTitle}>Steps</Text>
          <View style={styles.orderedList}>
            {data.workflow.steps.map((step, index) => (
              <View key={index} style={styles.orderedListItem}>
                <Text style={styles.orderedListNumber}>{index + 1}.</Text>
                <Text style={styles.orderedListText}>{step}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.subsectionTitle}>Finance Account Details</Text>
          <View style={styles.grid}>
            {data.workflow.accountDetails.map((detail, index) => (
              <DetailCard key={index} item={detail} borderColor="#3b82f6" />
            ))}
          </View>

          <Text style={styles.subsectionTitle}>Dues</Text>
          <View style={styles.grid}>
            {data.workflow.dues.map((due, index) => (
              <DetailCard key={index} item={due} borderColor="#ef4444" />
            ))}
          </View>

          <Text style={styles.subsectionTitle}>Refunds</Text>
          <View style={styles.grid}>
            {data.workflow.refunds.map((refund, index) => (
              <DetailCard key={index} item={refund} borderColor="#10b981" />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  content: {
    padding: 16,
    backgroundColor: "white",
    margin: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  listContainer: {
    marginLeft: 8,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  orderedList: {
    marginLeft: 8,
  },
  orderedListItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  orderedListNumber: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
    lineHeight: 20,
  },
  orderedListText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailCard: {
    width: "48%",
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  detailName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: "#374151",
  },
});

export default AccountClosureDisplay;