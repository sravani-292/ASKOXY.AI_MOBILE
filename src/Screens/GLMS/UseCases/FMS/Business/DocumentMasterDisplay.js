import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const DocumentMasterDisplay = () => {
  const data = {
    overview: 'System provides provision of maintaining a master set-up of documents that can be tracked across various contract stages such as at contract discounting, post contract purchase, rescheduling etc. A master list of documents is maintained in the system through the document master. User can select the relevant documents from this list and master maintains a separate document checklist based on finance type, customer constitution, customer segment, product or plan. At each stage user may include a master document directly at the transactional stage if it is not part of the master checklist. At each stage the documents can be marked as pending, waived, completed or incomplete.',
    actors: 'User',
    actions: 'User updates the Document Master with the list of Documents as waived/pending/complete/incomplete.',
    preconditions: ['Existing Finance Account'],
    postconditions: ['Document status updated in Document Master'],
    workflow: {
      steps: [
        'The User initiates the process for updation of the document master with the document status pertaining to the Finance Account.',
        'The User retrieves the Document Master pertaining to the Finance Account with the Agreement ID.',
        'The User updates the Document Master with the Finance Account documents & saves the record.',
        'The Document Master also helps in the tracking of deferral.',
      ],
      documentDetails: [
        { name: 'Document Stage', value: 'TBD' },
        { name: 'Document For', value: 'TBD' },
        { name: 'Customer Name', value: 'TBD' },
        { name: 'Finance Type', value: 'TBD' },
        { name: 'Guarantor/ Co-Applicant', value: 'TBD' },
        { name: 'Maker ID', value: 'TBD' },
        { name: 'Checker ID', value: 'TBD' },
        { name: 'Description', value: 'TBD' },
        { name: 'Document', value: 'TBD' },
        { name: 'Mandatory', value: 'TBD' },
        { name: 'Status', value: 'TBD' },
        { name: 'Date', value: 'TBD' },
        { name: 'Tracker No', value: 'TBD' },
        { name: 'Reason', value: 'TBD' },
        { name: 'Target Date', value: 'TBD' },
        { name: 'Validity Date', value: 'TBD' },
        { name: 'Remarks', value: 'TBD' },
      ],
    },
  };

  const DetailCard = ({ item }) => (
    <View style={styles.detailCard}>
      <Text style={styles.detailName}>{item.name}</Text>
      <Text style={styles.detailValue}>{item.value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Work Flow – Document Master</Text>

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

          <Text style={styles.subsectionTitle}>Document Master Details</Text>
          <View style={styles.grid}>
            {data.workflow.documentDetails.map((detail, index) => (
              <DetailCard key={index} item={detail} />
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
    borderLeftColor: "#3b82f6",
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

export default DocumentMasterDisplay;