import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const EodBodDisplay = () => {
  const data = {
    overview:
      "'EOD' is a Process that is executed at periodic intervals, for specified dates or periods, using data that has been entered in various transactions. In a financial organization there are some tasks such as profit calculation, accrual balance calculation and accrual posting such task is executed at the end of days in batch. 'BOD (Beginning of Day)' is to be executed to start the day's activities.",
    actors: "User",
    actions:
      "User runs the EOD for profit calculation, accrual balance calculation and accrual posting such task is executed at the end of days in batch and BOD for start the day's activities.",
    preconditions: [
      "Date should not be changed in the system automatically when date is changed in general",
    ],
    postconditions: [],
    workflow: {
      eodProcesses: [
        {
          name: "Profit Accruals",
          description:
            "Profit Accruals is a process by virtue of which the profit is calculated and kept in a bucket until its application / maturity.",
        },
        {
          name: "Late Payment Profit Calculation (LPP Process)",
          description:
            "'Late payment profit' calculation is overdue profit computation.",
        },
        {
          name: "Autos knock off",
          description:
            "It is a process where system itself checks for the outstanding payable and receivable advices and knocks them off based on the auto allocation logic defined for the product.",
        },
        {
          name: "DPD Process",
          description:
            "DPD (Days Past Due) is a process that calculates the number of outstanding days from which the client is not paying the installment.",
        },
        {
          name: "NPA Process",
          description:
            "An asset becomes Non–Performing when it ceases to generate income for the bank, depends upon the criteria defined.",
        },
        {
          name: "Date Change Process",
          description:
            "This process moves the system to the next business date. For example, if the current business date is 19-Dec-2008, after this process is executed, the business date will be changed to 20-Dec-2008.",
        },
      ],
      bodProcess:
        "User executes the BOD mainly for the process, conversion of PEMI to EMI (The EMI repayment schedule will be auto generated after the Subsequent & Final disbursement details were auto-authorized in FMS).",
    },
    businessRules: [
      "Accrual process will be executed on daily basis at EOD and accounting for the accrual will be passed in the system.",
      "DPD calculation process will be executed on daily basis",
      "NPA Classification process will be executed on daily basis",
      "Billing process will be done on daily basis and accounting will be triggered for the installment.",
      "Provisioning process will be executed at month end and the process will be triggered.",
      "Automatic Knock off process will be executed on daily basis (Payable and Receivable adjustment)",
      "Date change process will be executed daily at EOD",
      "LPP calculation will not be executed as no LPP is levied on the overdue customer account",
    ],
  };

  const ProcessCard = ({ process }) => (
    <View style={styles.processCard}>
      <Text style={styles.processName}>{process.name}</Text>
      <Text style={styles.processDescription}>{process.description}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          EOD/BOD in FMS
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
          <Text style={styles.sectionTitle}>Workflow</Text>
          
          <Text style={styles.subsectionTitle}>EOD Processes</Text>
          <View style={styles.processesContainer}>
            {data.workflow.eodProcesses.map((process, index) => (
              <ProcessCard key={index} process={process} />
            ))}
          </View>

          <Text style={styles.subsectionTitle}>BOD Process</Text>
          <Text style={styles.paragraph}>{data.workflow.bodProcess}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Rules</Text>
          <View style={styles.listContainer}>
            {data.businessRules.map((rule, index) => (
              <Text key={index} style={styles.listItem}>• {rule}</Text>
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
  processesContainer: {
    marginBottom: 16,
  },
  processCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    paddingLeft: 12,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  processName: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
  },
  processDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
});

export default EodBodDisplay;