import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const FinanceReschedulingDueDateDisplay = () => {
  const data = {
    overview: 'The Finance Rescheduling functionality allows the user to modify the Financial Details of the Finance. On the basis of the modification performed the system computes the new repayment schedule. The following transactions can be performed by the rescheduling functionality: Bulk Prepayment, Modification of Profit Rate, Modification of tenure, Modification of Due Date Change. During the lifetime of the finance deal a customer may come to bank & request for Change of Due date of the finance Installment to change the Due date of the Installment which will be paid in the future.',
    actors: ['Customer', 'User', 'Checker'],
    actions: [
      { role: 'Customer', description: 'Visits the Bank & submits the request for Due Date Change of the Finance Installment.' },
      { role: 'User', description: 'Initiates the process for Generation of New Repayment Schedule due to Due Date Change.' },
      { role: 'Checker', description: 'Verifies the New Repayment schedule & authorizes the same if found correct.' },
    ],
    preconditions: ['Existing Finance Account', 'Due Date Change to the Finance Account'],
    postconditions: ['Due date Change marked to the Finance Account', 'New Repayment schedule generated'],
    workflow: {
      steps: [
        'The Customer walks into the Bank & submits the request for Due Date change of the Finance Account.',
        'The User verifies the request & rule pertaining to the Due Date Change.',
        'Once the User satisfied with the Due Date Change request initiates the process for Due Date Change.',
        'Once the Due Date of the Finance account changed the user initiates the process for generation of New Repayment schedule.',
        'The User retrieves the Finance Account details with the Agreement ID for generation of New Repayment Schedule.',
        'The User modifies the Due Date of the Installment & submits the record for generation of New Repayment Schedule.',
        'The Checker retrieves the New Repayment Schedule with the Agreement ID & verifies the same & Authorizes if found correct.',
        'Once the record is authorized New Repayment schedule generated & customer is notified accordingly.',
      ],
      financeDetails: [
        { name: 'Finance No', value: 'TBD' },
        { name: 'Agreement ID', value: 'TBD' },
        { name: 'Loan Amount', value: 'TBD' },
        { name: 'Loan Original Tenure', value: 'TBD' },
        { name: 'Original Due Date', value: 'TBD' },
        { name: 'Outstanding Amount', value: 'TBD' },
        { name: 'Reschedule Effective Date', value: 'TBD' },
        { name: 'Repayment Effective Date', value: 'TBD' },
        { name: 'Bulk Refund Amount', value: 'TBD' },
        { name: 'Balance Tenure', value: 'TBD' },
        { name: 'Frequency', value: 'TBD' },
        { name: 'Rate of Interest', value: 'TBD' },
      ],
    },
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Work Flow – Finance Rescheduling: Due Date Change</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.text}>{data.overview}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actors</Text>
          {data.actors.map((actor, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>{actor}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionsContainer}>
            {data.actions.map((action, index) => (
              <View key={index} style={styles.actionItem}>
                <Text style={styles.actionRole}>{action.role}</Text>
                <Text style={styles.text}>{action.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preconditions</Text>
          {data.preconditions.map((condition, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>{condition}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Postconditions</Text>
          {data.postconditions.map((condition, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>{condition}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workflow</Text>
          <Text style={styles.subsectionTitle}>Steps</Text>
          {data.workflow.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <Text style={styles.stepNumber}>{index + 1}.</Text>
              <Text style={styles.text}>{step}</Text>
            </View>
          ))}

          <Text style={styles.subsectionTitle}>Finance Account Details</Text>
          <View style={styles.detailsGrid}>
            {data.workflow.financeDetails.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailName}>{detail.name}</Text>
                <Text style={styles.detailValue}>{detail.value}</Text>
              </View>
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
    backgroundColor: '#f1f5f9',
  },
  content: {
    maxWidth: '100%',
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1f2937',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1f2937',
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    color: '#374151',
  },
  text: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 16,
    color: '#374151',
    marginRight: 8,
  },
  actionsContainer: {
    gap: 12,
  },
  actionItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    paddingLeft: 12,
    paddingVertical: 4,
  },
  actionRole: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
    lineHeight: 20,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    paddingLeft: 12,
    paddingVertical: 6,
  },
  detailName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
  },
});

export default FinanceReschedulingDueDateDisplay;