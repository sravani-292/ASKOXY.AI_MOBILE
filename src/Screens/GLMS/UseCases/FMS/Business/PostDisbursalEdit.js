import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const PostDisbursalEdit = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainCard}>
        <Text style={styles.title}>Work Flow – Post Disbursal Edit</Text>

        <View style={styles.card}>
          <Text style={styles.text}>
            The Post Disbursal Edit screen enables the user to update
            non-financial information such as guarantor, co-applicant details,
            finance details, prepay rates, address details, contact details,
            work details, remarks, and instrument details for a finance. Users
            can add new guarantor/co-applicant details but cannot update the
            guarantor and co-applicant details of existing customers.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>User</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                User modifies the Non Financial Information pertaining to the
                Finance Account.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.text}>Existing/New Finance Account.</Text>

          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.text}>
            Non Financial information pertaining to the Finance Account
            modified.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User initiates the process for modification of Non Financial
                information of the Finance Account.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                User enters the Agreement ID to retrieve the Finance Account for
                modification of Non Financial information.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The Account details get displayed. The User selects the specific
                tab and modifies the details.
              </Text>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Guarantor Details:</Text>
          <View style={styles.detailsGrid}>
            <Text style={styles.detailItem}>• First Name</Text>
            <Text style={styles.detailItem}>• Middle Name</Text>
            <Text style={styles.detailItem}>• Last Name</Text>
            <Text style={styles.detailItem}>• Father Name</Text>
            <Text style={styles.detailItem}>• Date of Birth</Text>
            <Text style={styles.detailItem}>• Gender</Text>
            <Text style={styles.detailItem}>• Pan No</Text>
            <Text style={styles.detailItem}>• Passport Details</Text>
            <Text style={styles.detailItem}>• Marital Status</Text>
            <Text style={styles.detailItem}>• No of Dependents</Text>
            <Text style={styles.detailItem}>• Age of Dependents</Text>
            <Text style={styles.detailItem}>• Nationality</Text>
            <Text style={styles.detailItem}>• Residential Status</Text>
            <Text style={styles.detailItem}>• Religion</Text>
            <Text style={styles.detailItem}>• Educational Qualification</Text>
            <Text style={styles.detailItem}>• Earning Member in the Family (If any)</Text>
            <Text style={styles.detailItem}>• Length of Relationship with the Bank</Text>
            <Text style={styles.detailItem}>• Whether Existing Borrower</Text>
            <Text style={styles.detailItem}>• Staff</Text>
            <Text style={styles.detailItem}>• Account No</Text>
            <Text style={styles.detailItem}>• Deposits with the Bank</Text>
            <Text style={styles.detailItem}>• Current Address</Text>
            <Text style={styles.detailItem}>• Current Residence Ownership</Text>
            <Text style={styles.detailItem}>• Living Duration in Current Residence</Text>
            <Text style={styles.detailItem}>• Permanent Address</Text>
            <Text style={styles.detailItem}>• Mobile No</Text>
            <Text style={styles.detailItem}>• Landline No</Text>
            <Text style={styles.detailItem}>• E-mail ID</Text>
            <Text style={styles.detailItem}>• Occupation</Text>
            <Text style={styles.detailItem}>• Name of the Company</Text>
            <Text style={styles.detailItem}>• Address of the Company</Text>
            <Text style={styles.detailItem}>• Designation</Text>
            <Text style={styles.detailItem}>• Department</Text>
            <Text style={styles.detailItem}>• Employee No</Text>
            <Text style={styles.detailItem}>• Office Phone No</Text>
            <Text style={styles.detailItem}>• Ext</Text>
            <Text style={styles.detailItem}>• Fax</Text>
            <Text style={styles.detailItem}>• No of Years in the Present Company</Text>
            <Text style={styles.detailItem}>• Previous Employment History, etc.</Text>
            <Text style={styles.detailItem}>• Total Length of Service</Text>
            <Text style={styles.detailItem}>• Monthly Income</Text>
            <Text style={styles.detailItem}>• Other Income</Text>
            <Text style={styles.detailItem}>• Monthly Expenses</Text>
            <Text style={styles.detailItem}>• Savings</Text>
            <Text style={styles.detailItem}>• EMI Payment</Text>
            <Text style={styles.detailItem}>• Stability of Income, etc.</Text>
          </View>

          <Text style={styles.subsectionTitle}>Co-Applicant Details:</Text>
          <View style={styles.detailsGrid}>
            <Text style={styles.detailItem}>• First Name</Text>
            <Text style={styles.detailItem}>• Middle Name</Text>
            <Text style={styles.detailItem}>• Last Name</Text>
            <Text style={styles.detailItem}>• Father Name</Text>
            <Text style={styles.detailItem}>• Date of Birth</Text>
            <Text style={styles.detailItem}>• Gender</Text>
            <Text style={styles.detailItem}>• Pan No</Text>
            <Text style={styles.detailItem}>• Passport Details</Text>
            <Text style={styles.detailItem}>• Marital Status</Text>
            <Text style={styles.detailItem}>• No of Dependents</Text>
            <Text style={styles.detailItem}>• Age of Dependents</Text>
            <Text style={styles.detailItem}>• Nationality</Text>
            <Text style={styles.detailItem}>• Residential Status</Text>
            <Text style={styles.detailItem}>• Religion</Text>
            <Text style={styles.detailItem}>• Educational Qualification</Text>
            <Text style={styles.detailItem}>• Earning Member in the Family (If any)</Text>
            <Text style={styles.detailItem}>• Length of Relationship with the Bank</Text>
            <Text style={styles.detailItem}>• Whether Existing Borrower</Text>
            <Text style={styles.detailItem}>• Staff</Text>
            <Text style={styles.detailItem}>• Account No</Text>
            <Text style={styles.detailItem}>• Deposits with the Bank</Text>
            <Text style={styles.detailItem}>• Current Address</Text>
            <Text style={styles.detailItem}>• Current Residence Ownership</Text>
            <Text style={styles.detailItem}>• Living Duration in Current Residence</Text>
            <Text style={styles.detailItem}>• Permanent Address</Text>
            <Text style={styles.detailItem}>• Mobile No</Text>
            <Text style={styles.detailItem}>• Landline No</Text>
            <Text style={styles.detailItem}>• E-mail ID</Text>
            <Text style={styles.detailItem}>• Occupation</Text>
            <Text style={styles.detailItem}>• Name of the Company</Text>
            <Text style={styles.detailItem}>• Address of the Company</Text>
            <Text style={styles.detailItem}>• Designation</Text>
            <Text style={styles.detailItem}>• Department</Text>
            <Text style={styles.detailItem}>• Employee No</Text>
            <Text style={styles.detailItem}>• Office Phone No</Text>
            <Text style={styles.detailItem}>• Ext</Text>
            <Text style={styles.detailItem}>• Fax</Text>
            <Text style={styles.detailItem}>• No of Years in the Present Company</Text>
            <Text style={styles.detailItem}>• Previous Employment History, etc.</Text>
            <Text style={styles.detailItem}>• Total Length of Service</Text>
            <Text style={styles.detailItem}>• Monthly Income</Text>
            <Text style={styles.detailItem}>• Other Income</Text>
            <Text style={styles.detailItem}>• Monthly Expenses</Text>
            <Text style={styles.detailItem}>• Savings</Text>
            <Text style={styles.detailItem}>• EMI Payment</Text>
            <Text style={styles.detailItem}>• Stability of Income, etc.</Text>
          </View>

          <Text style={styles.subsectionTitle}>Address Details:</Text>
          <View style={styles.detailsGrid}>
            <Text style={styles.detailItem}>• Current Address</Text>
            <Text style={styles.detailItem}>• Current Residence Ownership</Text>
            <Text style={styles.detailItem}>• Living Duration in Current Residence</Text>
            <Text style={styles.detailItem}>• Permanent Address</Text>
            <Text style={styles.detailItem}>• Mobile No</Text>
            <Text style={styles.detailItem}>• Landline No</Text>
            <Text style={styles.detailItem}>• E-mail ID</Text>
          </View>

          <Text style={styles.subsectionTitle}>Work Details:</Text>
          <View style={styles.detailsGrid}>
            <Text style={styles.detailItem}>• Occupation</Text>
            <Text style={styles.detailItem}>• Name of the Company</Text>
            <Text style={styles.detailItem}>• Address of the Company</Text>
            <Text style={styles.detailItem}>• Designation</Text>
            <Text style={styles.detailItem}>• Department</Text>
            <Text style={styles.detailItem}>• Employee No</Text>
            <Text style={styles.detailItem}>• Office Phone No</Text>
            <Text style={styles.detailItem}>• Ext</Text>
            <Text style={styles.detailItem}>• Fax</Text>
          </View>

          <Text style={styles.subsectionTitle}>Instrument Details:</Text>
          <View style={styles.detailsGrid}>
            <Text style={styles.detailItem}>• Cheque No</Text>
            <Text style={styles.detailItem}>• Amount</Text>
            <Text style={styles.detailItem}>• Bank Name</Text>
            <Text style={styles.detailItem}>• Bank Branch</Text>
            <Text style={styles.detailItem}>• Micr Code</Text>
          </View>

          <Text style={styles.text}>
            User modifies the required details and saves the record for
            modification of the details.
          </Text>
          <Text style={styles.noteText}>
            Note: User can add new guarantor/co-applicant details, but cannot
            update the guarantor and co-applicant details of existing customers.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchartCard}>
            <Text style={styles.flowchartText}>
              1. User: Initiates the process for modification of Non Financial
              Information of the Account.
            </Text>
            <Text style={styles.flowchartText}>
              2. User: Retrieves the Account details with the Agreement ID.
            </Text>
            <Text style={styles.flowchartText}>3. System: Displays Account Details.</Text>
            <Text style={styles.flowchartText}>
              4. User: Modifies the Account details such as Address, Work
              Details, Finance Details, Instrument Details, and can add
              guarantor/co-applicant details.
            </Text>
            <Text style={styles.flowchartText}>5. User: Saves the record for modification.</Text>
            <Text style={styles.flowchartText}>6. System: Account Modified.</Text>
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
  mainCard: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1f2937",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1f2937",
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#374151",
  },
  text: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginTop: 12,
    fontStyle: "italic",
    fontWeight: "600",
  },
  listContainer: {
    marginLeft: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: "#374151",
    marginRight: 8,
    lineHeight: 20,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 8,
    marginBottom: 12,
  },
  detailItem: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
    width: "48%",
    marginBottom: 4,
  },
  flowchartCard: {
    borderWidth: 1,
    borderColor: "#6b7280",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
  },
  flowchartText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 6,
  },
});

export default PostDisbursalEdit;