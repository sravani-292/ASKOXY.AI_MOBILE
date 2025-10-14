import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ImageModal from '../../ImageModal';
// Main Component
const SettlementsKnockOff = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}> 
        <Text style={styles.title}>
          Work Flow – Settlements: Knock Off
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            There might be situations where receivables are pending from a business partner, and payments are also pending to the same business partner. In such cases, a knock-off of receivables is required against the pending payment. The user can set the knock-off amount payable against the amount receivable from the customer.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User processes knock-off for pending amounts.</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            Receipts and payments details have to be considered into account.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            Knock-off is done successfully.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User opens the Financial Management System application.</Text>
            <Text style={styles.listItem}>• User navigates to Knock Off in Settlements.</Text>
            <Text style={styles.listItem}>• User checks the pending amounts of both receivables and payables from the Knock Off screen.</Text>
            <Text style={styles.listItem}>• User sets the knock-off amount payable against the amount receivable from the customer.</Text>
            <Text style={styles.listItem}>• User checks for the following validations:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Sum of receivable Advices must equal the sum of Payable Advices to knock off the transaction.</Text>
            <Text style={styles.listItem}>• Allocated Amount cannot be greater than the amount to be allocated.</Text>
            <Text style={styles.listItem}>• Knock-off date cannot be greater than the current business date.</Text>
            <Text style={styles.listItem}>• Only those advices of a finance will be shown whose advice date is less than or equal to the knock-off date entered.</Text>
            <Text style={styles.listItem}>• Receivable and Payable advices pertaining to one business partner type can be knocked off at one time.</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• After the above validations, the User initiates the knock-off feature and gets the same authorized.</Text>
            <Text style={styles.listItem}>• The User checks previous knock-offs done manually and may select the record for which reversal is required.</Text>
            <Text style={styles.listItem}>• The User also authorizes the knock-off reversal.</Text>
            <Text style={styles.listItem}>• Knock-off is done successfully.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Knock-off reversal is not allowed for auto knock-off cases.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>1. User: Opens the Financial Management System application and navigates to Knock Off in Settlements.</Text>
            <Text style={styles.flowchartItem}>2. User: Checks pending amounts of receivables and payables on the Knock Off screen.</Text>
            <Text style={styles.flowchartItem}>3. User: Sets the knock-off amount payable against the amount receivable.</Text>
            <Text style={styles.flowchartItem}>4. User: Validates the knock-off (e.g., equal sums, valid dates, same business partner type).</Text>
            <Text style={styles.flowchartItem}>5. User: Initiates the knock-off and gets it authorized.</Text>
            <Text style={styles.flowchartItem}>6. User: Optionally checks previous manual knock-offs and authorizes reversals if needed.</Text>
            <Text style={styles.flowchartItem}>7. System: Knock-off is completed successfully.</Text>
            <ImageModal imageSource={'https://i.ibb.co/SXqgtcGN/KNOCKOFF.jpg'}/>
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
  nestedList: {
    marginLeft: 20,
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

export default SettlementsKnockOff;