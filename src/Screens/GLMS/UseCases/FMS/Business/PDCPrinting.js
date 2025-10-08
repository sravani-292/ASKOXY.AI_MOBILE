import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

// Main Component
const PDCPrinting = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – PDC Printing
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            Once the finance application is approved by the underwriter, the
            customer is required to provide certain documents at the PDOC stage
            and specify the mode of repayment for the finance. The customer can
            choose cash, PDC, ATM, or remittance as the mode of repayment. When
            the mode of repayment is PDC, the customer provides blank PDCs for
            the entire tenure. Once the blank PDCs are received from the
            customer, the system shall print the PDCs for the finance
            application with the Payee Name, due date as the cheque date, and
            the installment amount on all the cheques as per the repayment
            schedule.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              • User receives the PDC cheques from the customer and initiates the
              PDC printing process in the System.
            </Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Conditions:</Text>
          <Text style={styles.paragraph}>
            Submission of PDC cheques and Mode of repayment should be PDC.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Conditions:</Text>
          <Text style={styles.paragraph}>
            The cheques will be printed with the installment amount, Payee Name,
            and the due date of the installment.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              • User receives the PDC cheques from the customer for use in finance
              repayment.
            </Text>
            <Text style={styles.listItem}>
              • The User enters PDC as the mode of payment and saves the repayment
              information in the System.
            </Text>
            <Text style={styles.listItem}>
              • The User enters the PDCs list on the PDC collections section on
              the screen. The System displays the PDC Print screen for the User
              to print the cheques.
            </Text>
            <Text style={styles.listItem}>
              • The User selects the Application ID/Agreement ID and submits to
              search the application/finance details. The System displays the
              screen for cheque printing.
            </Text>
            <Text style={styles.listItem}>
              • The User checks the details of all the due installments for cheque
              printing.
            </Text>
            <Text style={styles.listItem}>
              • The User enters the blank cheques received from the customer in
              the printer to print the cheques.
            </Text>
            <Text style={styles.listItem}>
              • Once the cheques are placed in the printer and submitted, the
              cheques will be printed with the Payee Name, Due Date, and the
              installment amount for the number of installments selected for
              printing.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              • The User can print a cheque of a particular installment more than
              once by inserting another PDC received from the customer in case a
              particular PDC is not printed correctly.
            </Text>
            <Text style={styles.listItem}>
              • If there is a change in any of the financial parameters of the
              finance which will change the installment amount, the User can
              print the cheques for the new installment amount when the customer
              provides a new PDC.
            </Text>
            <Text style={styles.listItem}>
              • The System will show only those installments for printing for
              which the due date is greater than the current system date.
            </Text>
            <Text style={styles.listItem}>
              • If the customer wishes to change the PDC or a new PDC needs to be
              printed in case of deferral of installments, the repayment
              schedule of the finance from the System will be available on the
              PDC Printing screen for the User to print the cheques.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>
              1. User: Receives the PDC cheques from the customer for finance
              repayment.
            </Text>
            <Text style={styles.flowchartItem}>
              2. User: Enters PDC as the mode of payment and saves the repayment
              information in the System.
            </Text>
            <Text style={styles.flowchartItem}>
              3. User: Enters the PDCs list on the PDC collections section.
              System displays the PDC Print screen.
            </Text>
            <Text style={styles.flowchartItem}>
              4. User: Selects the Application ID/Agreement ID and submits to
              search the application/finance details. System displays the cheque
              printing screen.
            </Text>
            <Text style={styles.flowchartItem}>
              5. User: Checks the details of all due installments for cheque
              printing.
            </Text>
            <Text style={styles.flowchartItem}>
              6. User: Places the blank cheques in the printer.
            </Text>
            <Text style={styles.flowchartItem}>
              7. User: Submits to print the cheques with Payee Name, Due Date,
              and installment amount.
            </Text>
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
    fontSize: 16,
    fontWeight: "bold",
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
  flowchart: {
    borderWidth: 1,
    borderColor: "#374151",
    padding: 16,
    borderRadius: 4,
  },
  flowchartItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default PDCPrinting;