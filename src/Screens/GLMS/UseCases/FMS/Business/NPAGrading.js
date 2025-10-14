import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TrendingDown, Users, Settings, CheckCircle, AlertTriangle, ArrowRight, FileText, BarChart3, Calendar, Edit3 } from 'lucide-react-native';
import ImageModal from '../../ImageModal';

// Main Component
const NPAGrading = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <TrendingDown size={28} color="#ffffff" />
        </View>
        <Text style={styles.headerText}>Work Flow – NPA Grading</Text>
        <Text style={styles.headerSubtext}>Non-Performing Asset Classification System</Text>
      </View>
      
      <View style={styles.content}>
        {/* Overview Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.primaryIcon]}>
              <FileText size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewText}>
                The Bank assigns a grade to each finance based on the repayment pattern of the client. This information helps financing institutions ascertain the creditworthiness of the borrower and the likelihood of repayment within the specified time period.
              </Text>
            </View>
            <View style={styles.npaDefinition}>
              <AlertTriangle size={16} color="#dc2626" />
              <Text style={styles.npaDefinitionText}>
                A non-performing asset (NPA) refers to funds invested in finances not producing desired returns. An asset becomes non-performing when receivables are overdue for more than the specified days in NPA criteria.
              </Text>
            </View>
          </View>
        </View>

        {/* Actors & Conditions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.userIcon]}>
              <Users size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Actors & Conditions</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.actorsRow}>
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>Primary Actor</Text>
                <View style={styles.actorList}>
                  <View style={styles.actorItem}>
                    <Users size={14} color="#7c3aed" />
                    <Text style={styles.actorText}>User (Credit Officer)</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.actionCard}>
                <Text style={styles.actionTitle}>Key Action</Text>
                <Text style={styles.actionText}>
User defines grading before provisioning to non-performing assets.
                </Text>
              </View>
            </View>

            {/* Conditions */}
            <View style={styles.conditionsRow}>
              <View style={styles.conditionBox}>
                <View style={styles.conditionHeader}>
                  <Settings size={16} color="#dc2626" />
                  <Text style={styles.conditionTitle}>Pre Condition</Text>
                </View>
                <Text style={styles.conditionText}>
                  Only selected accounts are to be marked/graded for NPA
                </Text>
              </View>

              <View style={styles.conditionBox}>
                <View style={styles.conditionHeader}>
                  <CheckCircle size={16} color="#16a34a" />
                  <Text style={styles.conditionTitle}>Post Condition</Text>
                </View>
                <Text style={styles.conditionText}>
                  NPA stage assignment completed successfully
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* NPA Stages Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.stageIcon]}>
              <BarChart3 size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>NPA Classification Stages</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.stagesGrid}>
              <View style={[styles.stageCard, styles.standardStage]}>
                <Text style={styles.stageTitle}>Standard</Text>
                <Text style={styles.stageDescription}>Regular repayment, no overdue</Text>
              </View>
              
              <View style={[styles.stageCard, styles.substandardStage]}>
                <Text style={styles.stageTitle}>Sub-standard</Text>
                <Text style={styles.stageDescription}>Overdue 1-90 days</Text>
              </View>
              
              <View style={[styles.stageCard, styles.doubtfulStage]}>
                <Text style={styles.stageTitle}>Doubtful</Text>
                <Text style={styles.stageDescription}>Overdue 91-360 days</Text>
              </View>
              
              <View style={[styles.stageCard, styles.lossStage]}>
                <Text style={styles.stageTitle}>Loss</Text>
                <Text style={styles.stageDescription}>Overdue 360+ days, considered uncollectible</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Work Flow Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.flowIcon]}>
              <ArrowRight size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Work Flow Process</Text>
          </View>
          <View style={styles.sectionBody}>
            {/* Process Steps */}
            <View style={styles.processSteps}>
              <View style={styles.processStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Access System</Text>
                  <Text style={styles.stepDescription}>
                    User opens Financial Management System and navigates to Finance Grading screen
                  </Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Define NPA Stage</Text>
                  <Text style={styles.stepDescription}>
                    User defines NPA stage (Standard, Sub-standard, Doubtful, or Loss)
                  </Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Movement Definition</Text>
                  <Text style={styles.stepDescription}>
                    User defines NPA movements (Forward or Backward)
                  </Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Processing Method</Text>
                  <Text style={styles.stepDescription}>
                    User selects automatic or manual NPA marking
                  </Text>
                </View>
              </View>
            </View>

            {/* Movement Types */}
            <View style={styles.movementSection}>
              <Text style={styles.movementTitle}>NPA Movement Types:</Text>
              <View style={styles.movementGrid}>
                <View style={[styles.movementCard, styles.forwardMovement]}>
                  <TrendingDown size={20} color="#dc2626" />
                  <Text style={styles.movementType}>Forward Movement</Text>
                  <Text style={styles.movementDesc}>
                    Lower to higher NPA stage (deterioration)
                  </Text>
                </View>
                
                <View style={[styles.movementCard, styles.backwardMovement]}>
                  <TrendingDown size={20} color="#16a34a" style={{ transform: [{ rotate: '180deg' }] }} />
                  <Text style={styles.movementType}>Backward Movement</Text>
                  <Text style={styles.movementDesc}>
                    Higher to lower NPA stage (improvement)
                  </Text>
                </View>
              </View>
            </View>

            {/* Manual Grading Fields */}
            <View style={styles.fieldsSection}>
              <Text style={styles.fieldsTitle}>Manual Grading Fields:</Text>
              <View style={styles.fieldsGrid}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldItem}>• Agreement ID</Text>
                  <Text style={styles.fieldItem}>• New NPA Stage</Text>
                  <Text style={styles.fieldItem}>• Remarks</Text>
                  <Text style={styles.fieldItem}>• NPA Change Date</Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldItem}>• Current NPA Stage</Text>
                  <Text style={styles.fieldItem}>• Final NPA Stage</Text>
                  <Text style={styles.fieldItem}>• NPA Reason</Text>
                </View>
              </View>
            </View>

            {/* Completion Steps */}
            <View style={styles.completionSteps}>
              <View style={styles.completionStep}>
                <View style={styles.completionIndicator}>
                  <CheckCircle size={16} color="#16a34a" />
                </View>
                <Text style={styles.completionText}>
                  User saves transaction after manual grading
                </Text>
              </View>
              <View style={styles.completionStep}>
                <View style={styles.completionIndicator}>
                  <CheckCircle size={16} color="#16a34a" />
                </View>
                <Text style={styles.completionText}>
                  System confirms NPA grading completed successfully
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Flowchart Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.flowchartIcon]}>
              <ArrowRight size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Process Summary</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.flowchart}>
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>1</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User accesses system and navigates to grading screen
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>2</Text>
                </View>
                <Text style={styles.flowchartText}>
                  Defines NPA stage and movement types
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>3</Text>
                </View>
                <Text style={styles.flowchartText}>
                  Selects automatic or manual processing method
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>4</Text>
                </View>
                <Text style={styles.flowchartText}>
                  Enters manual grading details if required
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>5</Text>
                </View>
                <Text style={styles.flowchartText}>
                  Submits record for processing
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>6</Text>
                </View>
                <Text style={styles.flowchartText}>
                  System completes NPA stage assignment
                </Text>
              </View>
            </View>
            
            <View style={styles.imageContainer}>
              <ImageModal imageSource={'https://i.ibb.co/rR0mxDKS/NPA-GRADING.jpg'}/>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#dc2626",
    padding: 24,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 50,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 14,
    color: "#fecaca",
    textAlign: "center",
  },
  content: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 16,
    borderLeftWidth: 4,
  },
  primaryIcon: { 
    backgroundColor: "#dc2626",
    borderLeftColor: "#dc2626",
  },
  userIcon: { 
    backgroundColor: "#7c3aed",
    borderLeftColor: "#7c3aed",
  },
  stageIcon: { 
    backgroundColor: "#d97706",
    borderLeftColor: "#d97706",
  },
  flowIcon: { 
    backgroundColor: "#2563eb",
    borderLeftColor: "#2563eb",
  },
  flowchartIcon: { 
    backgroundColor: "#059669",
    borderLeftColor: "#059669",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  sectionBody: {
    padding: 20,
  },
  // Overview Section
  overviewCard: {
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  overviewText: {
    fontSize: 15,
    color: "#7f1d1d",
    lineHeight: 22,
    textAlign: "justify",
  },
  npaDefinition: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fffbeb",
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  npaDefinitionText: {
    flex: 1,
    fontSize: 14,
    color: "#92400e",
    lineHeight: 20,
  },
  // Actors & Conditions
  actorsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  actorCard: {
    flex: 1,
    backgroundColor: "#faf5ff",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#7c3aed",
  },
  actorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  actorList: {
    gap: 8,
  },
  actorItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actorText: {
    fontSize: 14,
    color: "#475569",
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0ea5e9",
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  conditionsRow: {
    flexDirection: "row",
    gap: 16,
  },
  conditionBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  conditionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  conditionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  conditionText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  // NPA Stages
  stagesGrid: {
    gap: 12,
  },
  stageCard: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  standardStage: {
    backgroundColor: "#f0fdf4",
    borderLeftColor: "#16a34a",
  },
  substandardStage: {
    backgroundColor: "#fffbeb",
    borderLeftColor: "#d97706",
  },
  doubtfulStage: {
    backgroundColor: "#fef3c7",
    borderLeftColor: "#f59e0b",
  },
  lossStage: {
    backgroundColor: "#fef2f2",
    borderLeftColor: "#dc2626",
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  stageDescription: {
    fontSize: 14,
    color: "#475569",
  },
  // Process Steps
  processSteps: {
    gap: 0,
    marginBottom: 24,
  },
  processStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: 16,
    width: 24,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  stepNumberText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  stepLine: {
    width: 2,
    backgroundColor: "#d1d5db",
    flex: 1,
    marginTop: 4,
    minHeight: 40,
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  // Movement Section
  movementSection: {
    marginBottom: 20,
  },
  movementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  movementGrid: {
    flexDirection: "row",
    gap: 16,
  },
  movementCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  forwardMovement: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  backwardMovement: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  movementType: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  movementDesc: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
    lineHeight: 16,
  },
  // Fields Section
  fieldsSection: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  fieldsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  fieldsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  fieldColumn: {
    flex: 1,
  },
  fieldItem: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 6,
  },
  // Completion Steps
  completionSteps: {
    gap: 12,
  },
  completionStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  completionIndicator: {
    marginTop: 2,
  },
  completionText: {
    flex: 1,
    fontSize: 14,
    color: "#15803d",
    lineHeight: 20,
    fontWeight: "500",
  },
  // Flowchart
  flowchart: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  flowchartStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  flowchartNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  flowchartNumberText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  flowchartText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    paddingTop: 2,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default NPAGrading;