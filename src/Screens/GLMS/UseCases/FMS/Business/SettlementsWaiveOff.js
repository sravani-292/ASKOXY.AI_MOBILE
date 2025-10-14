import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ImageModal from '../../ImageModal';
// Main Component
const SettlementsWaiveOff = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – Settlements: Waive Off
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            Waiver is an essential part of any financial system wherein the User can waive off a partial or full charge that has been levied on the customer.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User waives off the receivable amounts.</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            Receivable amounts are to be eligible for waive-off.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            Waive-off is done successfully.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User opens the Financial Management System application.</Text>
            <Text style={styles.listItem}>• User navigates to Waive Off in Settlements.</Text>
            <Text style={styles.listItem}>• The screen displays the receivable amounts that need to be waived off.</Text>
            <Text style={styles.listItem}>• User enters the details in the following fields:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Agreement Number</Text>
            <Text style={styles.listItem}>• Branch</Text>
            <Text style={styles.listItem}>• Currency</Text>
            <Text style={styles.listItem}>• Waive Off Date</Text>
            <Text style={styles.listItem}>• Advice Details</Text>
            <Text style={styles.listItem}>• Advice Date</Text>
            <Text style={styles.listItem}>• Original Amount</Text>
            <Text style={styles.listItem}>• Current Advice Amount</Text>
            <Text style={styles.listItem}>• Already Waived Off Amount</Text>
            <Text style={styles.listItem}>• Already Adjusted Amount</Text>
            <Text style={styles.listItem}>• Amount to be Waived Off</Text>
            <Text style={styles.listItem}>• Remarks</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User saves the record and sends it for authorization.</Text>
            <Text style={styles.listItem}>• Waive-off is done successfully.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>1. User: Opens the Financial Management System application.</Text>
            <Text style={styles.flowchartItem}>2. User: Navigates to the Waive Off screen in Settlements.</Text>
            <Text style={styles.flowchartItem}>3. System: Displays receivable amounts eligible for waive-off.</Text>
            <Text style={styles.flowchartItem}>4. User: Enters details (e.g., Agreement Number, Amount to be Waived Off, Remarks).</Text>
            <Text style={styles.flowchartItem}>5. User: Saves the record and sends it for authorization.</Text>
            <Text style={styles.flowchartItem}>6. System: Waive-off is completed successfully.</Text>
            <ImageModal imageSource={'https://i.ibb.co/KzwZKxyR/settlements-payments.jpg'}/>
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

export default SettlementsWaiveOff;