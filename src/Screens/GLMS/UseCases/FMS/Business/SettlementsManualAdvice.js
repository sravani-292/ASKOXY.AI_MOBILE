import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ImageModal from '../../ImageModal';
// Main Component
const SettlementsManualAdvise = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – Settlements: Manual Advise
        </Text>
 
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            An advice is essential for the materialization of a financial transaction. Such advices are generated during the business transaction/process. The Manual Advise will be used for making manual dues, such as commission payment handling.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User processes manual advises for Payments.</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            User collects the payment details.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            Manual advice is done successfully.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User opens the Financial Management System application.</Text>
            <Text style={styles.listItem}>• User navigates to Manual Advise in Settlements.</Text>
            <Text style={styles.listItem}>• The User selects the business party to whom the payment needs to be made along with the Agreement ID and enters the details such as:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Advice ID</Text>
            <Text style={styles.listItem}>• Advice Date</Text>
            <Text style={styles.listItem}>• Agreement No.</Text>
            <Text style={styles.listItem}>• Advice Amount</Text>
            <Text style={styles.listItem}>• Advice Type</Text>
            <Text style={styles.listItem}>• Currency</Text>
            <Text style={styles.listItem}>• Charge Type</Text>
            <Text style={styles.listItem}>• Maker ID</Text>
            <Text style={styles.listItem}>• Date</Text>
            <Text style={styles.listItem}>• Remarks</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• The due will be created as per the process defined, and the payment shall be made to the customer.</Text>
            <Text style={styles.listItem}>• Manual advice is done successfully.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>1. User: Opens the Financial Management System application.</Text>
            <Text style={styles.flowchartItem}>2. User: Navigates to Manual Advise in Settlements.</Text>
            <Text style={styles.flowchartItem}>3. User: Selects the business party and Agreement ID, and enters details (e.g., Advice ID, Advice Amount, Currency).</Text>
            <Text style={styles.flowchartItem}>4. System: Creates the due as per the defined process, and payment is made to the customer.</Text>
            <Text style={styles.flowchartItem}>5. System: Manual advice is completed successfully.</Text>
            <ImageModal imageSource={'https://i.ibb.co/99WM5mx5/manual-advise.jpg'}/>
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

export default SettlementsManualAdvise;