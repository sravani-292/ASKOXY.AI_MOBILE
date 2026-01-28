import { StyleSheet } from "react-native";
import React from "react";
import { COLORS } from "../../Redux/constants/theme";


import { createStackNavigator } from "@react-navigation/stack";
import CustomerIdCreation from "../Screens/GLMS/UseCases/LOS/Business/CustomerIdCreation";
import LinkingOfCustomerIdToLoanBusiness from "../Screens/GLMS/UseCases/LOS/Business/LinkingOfCustomerIdToLoanBusiness";
import LinkingOfCoApplicantGuarantorBusiness from "../Screens/GLMS/UseCases/LOS/Business/LinkingOfCoApplicantGuarantorBusiness";
import LOSDashboard from "../Screens/GLMS/UseCases/LOS/LOSDashboard";
import CaptureAssetDetails from "../Screens/GLMS/UseCases/LOS/Business/CaptureAssetDetails";
import CheckLimitBusiness from "../Screens/GLMS/UseCases/LOS/Business/CheckLimitBusiness";
import NetWorthAnalysis from "../Screens/GLMS/UseCases/LOS/Business/NetWorthAnalysis";
import RiskAnalysis from "../Screens/GLMS/UseCases/LOS/Business/RiskAnalysis";
import SactionCustomerResponse from "../Screens/GLMS/UseCases/LOS/Business/Sanction_CustomerResponse";
import Terms_Conditions_Approvals from "../Screens/GLMS/UseCases/LOS/Business/Terms_Conditions_Approvals";
import LoanAssessment from "../Screens/GLMS/UseCases/LOS/Business/LoanAssessment";
import LoanAppraisal from "../Screens/GLMS/UseCases/LOS/Business/LoanAppraisal";
import Recommendation_SanctionLetter from "../Screens/GLMS/UseCases/LOS/Business/Recommendation_SactionLetter";
import RepaymentSchedule from "../Screens/GLMS/UseCases/LOS/Business/RepaymentSchedule";

import System_CustomerIdCreation from "../Screens/GLMS/UseCases/LOS/System/System_CustomerIdCreation";
import LinkingOfCoApplicantGuarantor from "../Screens/GLMS/UseCases/LOS/System/System_LinkingofCoapplicant";
import LinkingOfCustomerIdToLoan from "../Screens/GLMS/UseCases/LOS/System/System_LoanLinking";
import System_LoanAssessment from "../Screens/GLMS/UseCases/LOS/System/System_LoanAssessment";
import System_LoanAppraisal from "../Screens/GLMS/UseCases/LOS/System/System_LoanAppraisal";
import System_RiskAnalysis from "../Screens/GLMS/UseCases/LOS/System/System_RiskAnalysis";
import System_Terms_Conditions from "../Screens/GLMS/UseCases/LOS/System/System_Terms_Conditions";
import System_Saction_CustomerResponse from "../Screens/GLMS/UseCases/LOS/System/System_Saction_CustomerResponse";
import System_NetWorthAnalysis from "../Screens/GLMS/UseCases/LOS/System/System_NetWorthAnalysis";
import System_CheckLimit from "../Screens/GLMS/UseCases/LOS/System/System_CheckLimit";
import System_CapturingAssetDetails from "../Screens/GLMS/UseCases/LOS/System/System_CapturingAssetDetails";
import System_RepaymentSchedule from "../Screens/GLMS/UseCases/LOS/System/System_RepaymentSchedule";
import System_Recommendation from "../Screens/GLMS/UseCases/LOS/System/System_Recommendation";

import CMSDashboard from "../Screens/GLMS/UseCases/CMS/CMSDashboard";
import FMSDashboard from "../Screens/GLMS/UseCases/FMS/FMSDashboard";
import AllocationHoldUseCaseBusiness from "../Screens/GLMS/UseCases/CMS/Business/AllocationHoldUseCaseBusiness";
import ManualAllocationUseCaseBusiness from "../Screens/GLMS/UseCases/CMS/Business/ManualAllocationUseCaseBusiness";
import ManualReallocationUseCaseBusiness from "../Screens/GLMS/UseCases/CMS/Business/ManualReallocationUseCaseBusiness";
import BeginningDayProcess from "../Screens/GLMS/UseCases/CMS/Business/BeginningDayProcess";
import ClassificationDefineQueue from "../Screens/GLMS/UseCases/CMS/Business/ClassificationDefineQueue";
import DefineAllocationContract from "../Screens/GLMS/UseCases/CMS/Business/DefineAllocationContract";
import ContractRecording from "../Screens/GLMS/UseCases/CMS/Business/ContractRecording";
import LegalCollection from "../Screens/GLMS/UseCases/CMS/Business/LegalCollection";
import PrioritizeQueue from "../Screens/GLMS/UseCases/CMS/Business/PrioritizeQueue";
import CommunicationMapping from "../Screens/GLMS/UseCases/CMS/Business/CommunicationMapping";
import QueueCuring from "../Screens/GLMS/UseCases/CMS/Business/QueueCuring";
import WorkPlan from "../Screens/GLMS/UseCases/CMS/Business/WorkPlan";
import System_AllocationHold from "../Screens/GLMS/UseCases/CMS/System/System_AllocationHoldUseCaseBusiness";
import System_ManualReallocation from "../Screens/GLMS/UseCases/CMS/System/System_ManualReallocation";
import System_ManualAllocation from "../Screens/GLMS/UseCases/CMS/System/System_ManualAllocation";
// import System_ManualAllocation from "../Screens/GLMS/UseCases/CMS/System/System_ManualAllocation";
import System_DefineAllocation from "../Screens/GLMS/UseCases/CMS/System/System_DefineAllocationContract";
import System_BeginingOfDay from "../Screens/GLMS/UseCases/CMS/System/System_BeginingDayProcess";
import System_DefineQueue from "../Screens/GLMS/UseCases/CMS/System/System_DefineQueue";
import System_ContractRecord from "../Screens/GLMS/UseCases/CMS/System/System_ContractRecord";
import System_LegalCollection from "../Screens/GLMS/UseCases/CMS/System/System_LegalCollection";
import System_PrioritizeQueue from "../Screens/GLMS/UseCases/CMS/System/System_PrioritizeQueue";
import System_CommunicationMapping from "../Screens/GLMS/UseCases/CMS/System/System_CommunicationMapping";
import System_QueueCuring from "../Screens/GLMS/UseCases/CMS/System/System_QueueCuring";
import System_WorkPlan from "../Screens/GLMS/UseCases/CMS/System/System_WorkPlan";
import AssetDetails from "../Screens/GLMS/UseCases/FMS/Business/AssetDetails";
import PDCPrinting from "../Screens/GLMS/UseCases/FMS/Business/PDCPrinting";
import InstallmentPrepayment from "../Screens/GLMS/UseCases/FMS/Business/InstallmentPrepayment";
import NPAGrading from "../Screens/GLMS/UseCases/FMS/Business/NPAGrading";
import SettlementsKnockOff from "../Screens/GLMS/UseCases/FMS/Business/SettlementsKnockOff";
import NPAProvision from "../Screens/GLMS/UseCases/FMS/Business/NPAProvision";
import SettlementsChequeProcessing from "../Screens/GLMS/UseCases/FMS/Business/SettlementsChequeProcessing";
import SettlementsManualAdvice from "../Screens/GLMS/UseCases/FMS/Business/SettlementsManualAdvice";
import FinanceDetailsViewer from "../Screens/GLMS/UseCases/FMS/Business/FinanceDetailsViewer";
import TerminationForeclosureClosure from "../Screens/GLMS/UseCases/FMS/Business/TerminationForeclosureClosure ";
import FloatingReview from "../Screens/GLMS/UseCases/FMS/Business/FloatingReview";
import SettlementReciepts from "../Screens/GLMS/UseCases/FMS/Business/SettlementReciepts";
import SettlementsPayments from "../Screens/GLMS/UseCases/FMS/Business/SettlementsPayments";
import SettlementsWaiveOff from "../Screens/GLMS/UseCases/FMS/Business/SettlementsWaiveOff";
import AccountClosureDisplay from "../Screens/GLMS/UseCases/FMS/Business/AccountClosureDisplay";
import EodBodDisplay from "../Screens/GLMS/UseCases/FMS/Business/EodBodDisplay";
import DocumentMasterDisplay from "../Screens/GLMS/UseCases/FMS/Business/DocumentMasterDisplay";
import ViewAccountStatusDisplay from "../Screens/GLMS/UseCases/FMS/Business/ViewAccountStatusDisplay";
import FinanceReschedulingDueDateDisplay from "../Screens/GLMS/UseCases/FMS/Business/FinanceReschedulingDueDateDisplay";
import FinanceReschedulingDisplay from "../Screens/GLMS/UseCases/FMS/Business/FinanceReschedulingDisplay";
import FinanceReschedulingProfitRateChange from "../Screens/GLMS/UseCases/FMS/Business/FinanceReschedulingProfitRateChange";
import FinanceReschedulingTenureChange from "../Screens/GLMS/UseCases/FMS/Business/FinanceReschedulingTenureChange";
import PostDisbursalEdit from "../Screens/GLMS/UseCases/FMS/Business/PostDisbursalEdit";
import RepaymentDeferralConstitutionBased from "../Screens/GLMS/UseCases/FMS/Business/RepaymentDeferralConstitutionBased";
import RepaymentDeferralBatchWise from "../Screens/GLMS/UseCases/FMS/Business/RepaymentDeferralBatchWise";
import RepaymentDeferralFinanceWise from "../Screens/GLMS/UseCases/FMS/Business/RepaymentDeferralFinanceWise";
import System_AssetDetails from "../Screens/GLMS/UseCases/FMS/System/System_AssetDetails";
import System_PDCPrinting from "../Screens/GLMS/UseCases/FMS/System/System_PDCPrinting";
import System_InstallmentPrepayment from "../Screens/GLMS/UseCases/FMS/System/System_InstallmentPrepayment";
import System_NPAGrading from "../Screens/GLMS/UseCases/FMS/System/System_NPAGrading";
import System_NPAProvisioning from "../Screens/GLMS/UseCases/FMS/System/System_NPAProvisioning";
import System_SettlementsKnockOff from "../Screens/GLMS/UseCases/FMS/System/System_SettlementsKnockOff";
import System_SettlementsCheque from "../Screens/GLMS/UseCases/FMS/System/System_SettlementsCheque";
import System_SettlementsManualAdvice from "../Screens/GLMS/UseCases/FMS/System/System_SettlementsManualAdvice";
import System_TerminationForeclosure from "../Screens/GLMS/UseCases/FMS/System/System_TerminationForeclosure";
import System_FinanceViewer from "../Screens/GLMS/UseCases/FMS/System/System_FinanceViewer";
import System_FloatingReviewProcess from "../Screens/GLMS/UseCases/FMS/System/System_FloatingReviewProcess";
import  System_SettlementsPayments  from "../Screens/GLMS/UseCases/FMS/System/System_SettlementsPayments";
import { System_SettlementsReceipts } from "../Screens/GLMS/UseCases/FMS/System/System_SettlementsReceipts";
import System_SettlementsWaiveOff from "../Screens/GLMS/UseCases/FMS/System/System_SettlementsWaiveOff";
import System_EODBODDisplay from "../Screens/GLMS/UseCases/FMS/System/System_EODBODDisplay";
import System_AccountClosure from "../Screens/GLMS/UseCases/FMS/System/System_AccountClosure";
import System_ViewAccountStatus from "../Screens/GLMS/UseCases/FMS/System/System_ViewAccountStatus";
import System_DocumentMaster from "../Screens/GLMS/UseCases/FMS/System/System_DocumentMaster";
import System_BulkPrepayment from "../Screens/GLMS/UseCases/FMS/System/System_BulkPrepayment";
import System_ReschedulingDueDate from "../Screens/GLMS/UseCases/FMS/System/System_ReschedulingDueDate";
import System_ProfitRateChange from "../Screens/GLMS/UseCases/FMS/System/System_ProfitRateChange";
import System_PostDisbursalEdit from "../Screens/GLMS/UseCases/FMS/System/System_PostDisbursalEdit";
import System_DeferralConstitutionWise from "../Screens/GLMS/UseCases/FMS/System/System_DeferralConstitutionWise";
import System_DeferralFinanceWise from "../Screens/GLMS/UseCases/FMS/System/System_DeferralFinanceWise";
import System_DeferralPortfolio from "../Screens/GLMS/UseCases/FMS/System/System_DeferralPortfolio";
// import System_ReschedulingTenureChange from "../GLMS/UseCases/FMS/System/System_ReschedulingTenureChange";
import System_ReschedulingTenureChange from '../Screens/GLMS/UseCases/FMS/System/SYstem_ReschedulingTenureChange';

const Stack = createStackNavigator();

const UseCasesStackScreen = ({route}) => {
  console.log({route})
  return (
    <Stack.Navigator
    initialRouteName={route?.params?.dashboard}
     screenOptions={{
             headerShown: true,
             presentation: "card",
             headerTintColor: "white",
             headerTitleStyle: styles.headerTitleStyle,
             headerMode: "float",
             headerShown: true,
             headerStyle: {
               backgroundColor: COLORS.services,
             },
           }}
    >
       
      <Stack.Screen
        name="LOS Dashboard"
        component={LOSDashboard}
        options={{ title: "LOS Dashboard" }}
      />

      {/* LOS Business Screens */}
      <Stack.Screen
        name="CustomerIdCreation"
        component={CustomerIdCreation}
          options={{ title: "Customer Id Creation" }}
      />
      <Stack.Screen
        name="LinkingOfCustomerIdToLoanBusiness"
        component={LinkingOfCustomerIdToLoanBusiness}
        options={{ title: "Link Customer ID to Loan" }}
      />
      <Stack.Screen
        name="LinkingOfCoApplicantGuarantorBusiness"
        component={LinkingOfCoApplicantGuarantorBusiness}
        options={{ title: "Link Co-Applicant/Guarantor" }}
      />
      <Stack.Screen
        name="CaptureAssetDetails"
        component={CaptureAssetDetails}
        options={{ title: "Capture Asset Details" }}
      />
      <Stack.Screen
        name="CheckLimitBusiness"
        component={CheckLimitBusiness}
        options={{ title: "Profile Update & Limit Check" }}
      />
      <Stack.Screen
        name="NetWorthAnalysis"
        component={NetWorthAnalysis}
        options={{ title: "Account Closure & Net Worth Analysis" }}
      />
      <Stack.Screen
        name="RiskAnalysis"
        component={RiskAnalysis}
        options={{ title: "Risk Analysis" }}
      />
      <Stack.Screen
        name="Sanction&CustomerResponse"
        component={SactionCustomerResponse}
        options={{ title: "Sanction & Customer Response" }}
      />
      <Stack.Screen
        name="Terms&ConditionsApprovals"
        component={Terms_Conditions_Approvals}
        options={{ title: "Terms & Conditions Approvals" }}
      />
      <Stack.Screen
        name="LoanAssessmentWorkflow"
        component={LoanAssessment}
        options={{ title: "Loan Assessment Workflow" }}
      />
      <Stack.Screen
        name="LoanAppraisal"
        component={LoanAppraisal}
        options={{ title: "Loan Appraisal Workflow" }}
      />
      <Stack.Screen
        name="Recommendation_SanctionLetter"
        component={Recommendation_SanctionLetter}
        options={{ title: "Recommendation & Sanction Letter" }}
      />
      <Stack.Screen
        name="RepaymentSchedule"
        component={RepaymentSchedule}
        options={{ title: "Repayment Schedule Generation" }}
      />

      {/* LOS System Screens */}
      <Stack.Screen
        name="System_CustomerIdCreation"
        component={System_CustomerIdCreation}
        options={{ title: "Customer ID Creation" }}
      />
      <Stack.Screen
        name="LinkingOfCoapplicant"
        component={LinkingOfCoApplicantGuarantor}
        options={{ title: "Linking of Co-applicant/Guarantor" }}
      />
      <Stack.Screen
        name="LoanLinkingCustomerId"
        component={LinkingOfCustomerIdToLoan}
        options={{ title: "Customer ID Loan Linking" }}
      />
      <Stack.Screen
        name="System_LoanAssessment"
        component={System_LoanAssessment}
        options={{ title: "Loan Assessment" }}
      />
      <Stack.Screen
        name="System_LoanAppraisal"
        component={System_LoanAppraisal}
        options={{ title: "Loan Appraisal" }}
      />
      <Stack.Screen
        name="System_RiskAnalysis"
        component={System_RiskAnalysis}
        options={{ title: "Risk Analysis" }}
      />
      <Stack.Screen
        name="System_Terms_Conditions"
        component={System_Terms_Conditions}
        options={{ title: "Terms & Conditions" }}
      />
      <Stack.Screen
        name="System_Saction_CustomerResponse"
        component={System_Saction_CustomerResponse}
        options={{ title: "Sanction Letter & Customer Response" }}
      />
      <Stack.Screen
        name="System_NetWorthAnalysis"
        component={System_NetWorthAnalysis}
        options={{ title: "Net Worth Analysis" }}
      />
      <Stack.Screen
        name="System_CheckLimit"
        component={System_CheckLimit}
        options={{ title: "Profile Update & Limit Check" }}
      />
      <Stack.Screen
        name="System_CapturingAssetDetails"
        component={System_CapturingAssetDetails}
        options={{ title: "Asset Details Capture" }}
      />
      <Stack.Screen
        name="System_RepaymentSchedule"
        component={System_RepaymentSchedule}
        options={{ title: "Repayment Schedule" }}
      />
      <Stack.Screen
        name="System_Recommendation"
        component={System_Recommendation}
        options={{ title: "Recommendation Schedule Generation" }}
      />

{/* =============================================================== */}
      <Stack.Screen 
        name="CMS Dashboard"
        component={CMSDashboard}
        options={{ title: "CMS Dashboard" }}
      />

      {/* CMS  Business Usecases */}
      <Stack.Screen
        name="AllocationHoldUseCaseBusiness"
        component={AllocationHoldUseCaseBusiness}
        options={{ title: "Allocation Hold Cases" }}
      />
      <Stack.Screen name="DefineAllocationContract" component={DefineAllocationContract} options={{title:"Define Allocation Contract"}}/>
      <Stack.Screen name="ManualAllocationUseCaseBusiness" component={ManualAllocationUseCaseBusiness} options={{title:"Manual Allocation UseCase"}}/>
      <Stack.Screen name="ManualReAllocationUseCaseBusiness" component={ManualReallocationUseCaseBusiness} options={{title:"Manual Allocation UseCase"}}/>
      <Stack.Screen name="BeginingDayProcess" component={BeginningDayProcess} options={{title:"Beginning Of Day Process"}}/>
      <Stack.Screen name="ClassificationDefineQueue" component={ClassificationDefineQueue} options={{title:"Classification of Delinquent Cases"}}/>
      <Stack.Screen name="ContractRecording" component={ContractRecording} options={{title:"Contact Recording"}}/>
      <Stack.Screen name="LegalCollections" component={LegalCollection} options={{title:"Legal Collection workflow"}}/>
      <Stack.Screen name="PrioritizeQueue" component={PrioritizeQueue} options={{title:"Prioritize Queue Workflow"}}/>
      <Stack.Screen name="CommunicationMapping" component={CommunicationMapping} options={{title:"Communication Mapping"}}/>
      <Stack.Screen name="QueueCuring" component={QueueCuring} options={{title:"Queue Curing"}}/>
      <Stack.Screen name="WorkPlan" component={WorkPlan} options={{title:"Work Plan"}}/>


    {/* CMS System Usecases */}
    <Stack.Screen name="System_AllocationHold" component={System_AllocationHold} options={{title:"Allocation Hold"}}/>
    <Stack.Screen name="System_ManualReallocation" component={System_ManualReallocation} options={{title:"Manual Reallocation"}}/>
    <Stack.Screen name="System_ManualAllocation" component={System_ManualAllocation} options={{title:'Manual Allocation'}}/>
    <Stack.Screen name="System_DefineAllocation" component={System_DefineAllocation} options={{title:'Define Allocation'}}/>
    <Stack.Screen name="System_BeginingDayProcess" component={System_BeginingOfDay} options={{title:"Begining of Day Process"}}/>
    <Stack.Screen name="System_DefineQueue" component={System_DefineQueue} options={{title:"Define Queue"}}/>
    <Stack.Screen name="System_ContractRecord" component={System_ContractRecord} options={{title:"Contact Recording"}}/>
    <Stack.Screen name="System_LegalCollection" component={System_LegalCollection} options={{title:"Legal Collection"}}/>
    <Stack.Screen name="System_PrioritizeQueue" component={System_PrioritizeQueue} options={{title:"Prioritize Queue"}}/>
    <Stack.Screen name="System_CommunicationMapping" component={System_CommunicationMapping} options={{title:"Communication Mapping"}}/>
    <Stack.Screen name="System_QueueCuring" component={System_QueueCuring} options={{title:"Queue Curing"}}/>
    <Stack.Screen name="System_WorkPlan" component={System_WorkPlan} options={{title:"Collector Work Plan"}}/>


{/* ============================================================== */}
      {/* FMS Dashboard */}
      <Stack.Screen
        name="FMS Dashboard"
        component={FMSDashboard}
        options={{ title: "FMS Dashboard" }}
      />

      {/* FMS Business Usecases */}
      <Stack.Screen name="assetDetails" component={AssetDetails} options={{title:"Maintains the Asset Details"}}/>
      <Stack.Screen name="PDCPrinting" component={PDCPrinting} options={{title:"PDC Printing"}}/>
      <Stack.Screen name="Installment_Prepayment" component={InstallmentPrepayment} options={{title:"Installment Prepayment"}}/>
      <Stack.Screen name="NPAGrading" component={NPAGrading} options={{title:"NPA Grading"}}/>
      <Stack.Screen name="Settlements_KnockOff" component={SettlementsKnockOff} options={{title:"Settlements KnockOff"}}/>
      <Stack.Screen name="NPA_Provision" component={NPAProvision} options={{title:"NPA Provision"}}/>
      <Stack.Screen name="Settlements_Cheque_Processing" component={SettlementsChequeProcessing} options={{title:"Settlements Cheque Processing"}}/>
      <Stack.Screen name="Settlements_Manual_Advice" component={SettlementsManualAdvice} options={{title:"Settlements Manual Advice"}}/>
      <Stack.Screen name="FinanceDetailsViewer" component={FinanceDetailsViewer} options={{title:"Finance Detail Viewer"}}/>
      <Stack.Screen name="TerminationForeclosure" component={TerminationForeclosureClosure} options={{title:"Termination Foreclosure"}}/>
      <Stack.Screen name="FloatingReview" component={FloatingReview} options={{title:"Floating Review Process"}}/>
      <Stack.Screen name="SettlementReciepts" component={SettlementReciepts}options={{title:"Settlement Receipts"}}/>
      <Stack.Screen name="SettlementsPayments" component={SettlementsPayments} options={{title:"Settle Payments"}}/>
      <Stack.Screen name="SettlementsWaiveOff" component={SettlementsWaiveOff} options={{title:"Settlements WaiveOff"}}/>
      <Stack.Screen name="AccountClosureDisplay" component={AccountClosureDisplay} options={{title:"Account Closure Display"}}/>
      <Stack.Screen name="EodBodDisplay" component={EodBodDisplay} options={{title:"EOD BOD Display"}}/>
      <Stack.Screen name="DocumentMasterDisplay" component={DocumentMasterDisplay} options={{title:"Document Master Display"}}/>
      <Stack.Screen name="ViewAccountStatusDisplay" component={ViewAccountStatusDisplay} options={{title:"View Account Status Display"}}/>
      <Stack.Screen name="FinanceReschedulingDueDateDisplay" component={FinanceReschedulingDueDateDisplay} options={{title:"Finance Rescheduling DueDate Display"}}/>
      <Stack.Screen name="FinanceRescheduleDisplay" component={FinanceReschedulingDisplay} options ={{title:"Finance Reschedule Bulk Prepayment"}}/>
      <Stack.Screen name="FinanceReschedulingProfitRateChange" component={FinanceReschedulingProfitRateChange} options={{title:"Finance Rescheduling ProfitRate Change"}}/>
      <Stack.Screen name="FinanceReschedulingTenureChange" component={FinanceReschedulingTenureChange} options={{title:"Finance Rescheduling Tenure Change"}}/>
      <Stack.Screen name="PostDisbursalEdit" component={PostDisbursalEdit} options={{title:"Post Disbursal Edit"}}/>
      <Stack.Screen name="RepaymentDeferralConstitutionBased" component={RepaymentDeferralConstitutionBased} options={{title:"Deferral Constitition Based"}}/>
      <Stack.Screen name="RepaymentDeferralBatchWise" component={RepaymentDeferralBatchWise} options={{title:"Deferral Batch Wise"}}/>
      <Stack.Screen name="RepaymentDeferralFinanceWise" component={RepaymentDeferralFinanceWise} options={{title:"Deferral Finance Wise"}}/>

{/* FMS System useCases */}
<Stack.Screen name="System_AssetDetails" component={System_AssetDetails} options={{title:"Asset Details"}}/>
<Stack.Screen name="System_PDCPrinting" component={System_PDCPrinting} options={{title:"PDC Printing"}}/>
<Stack.Screen name="System_InstallmentPrepayment" component={System_InstallmentPrepayment} options={{title:"Installment Prepayment"}}/>
<Stack.Screen name="System_NPAGrading" component={System_NPAGrading} options={{title:"NPA Grading"}}/> 
<Stack.Screen name="System_NPAProvisioning" component={System_NPAProvisioning} options={{title:"NPA Provisioning"}}/>
<Stack.Screen name="System_SettlementsKnockOff" component={System_SettlementsKnockOff} options={{title:"Settlements KnockOff"}}/>
<Stack.Screen name="System_SettlementsCheque" component={System_SettlementsCheque} options={{title:"Settlements Cheque"}}/>
<Stack.Screen name="System_SettlementsManualAdvice" component={System_SettlementsManualAdvice} options={{title:"Settlements Manual Advice"}}/>
<Stack.Screen name="System_TerminationForeclosure" component={System_TerminationForeclosure} options={{title:"Termination ForeClosure"}}/>
<Stack.Screen name="System_FinanceViewer" component={System_FinanceViewer} options={{title:"Finance Viewer"}}/>
<Stack.Screen name="System_FloatingReviewProcess" component={System_FloatingReviewProcess} options={{title:"Floating Review Process"}}/> 
<Stack.Screen name="System_SettlementsPayments" component={System_SettlementsPayments} options={{title:"Settlements Payments"}}/>
<Stack.Screen name="System_SettlementsReceipts" component={System_SettlementsReceipts} options={{title:"Settlements Receipts"}}/>
<Stack.Screen name="System_SettlementsWaiveOff" component={System_SettlementsWaiveOff} options={{title:"Settlements Waive off"}}/>
<Stack.Screen name="System_EODBODDisplay" component={System_EODBODDisplay} options={{title:"EOD BOD Display"}}/>
<Stack.Screen name="System_AccountClosure" component={System_AccountClosure} options={{title:"Account Closure"}}/>
<Stack.Screen name="System_ViewAccountStatus" component={System_ViewAccountStatus} options={{title:"View Account Status"}}/>
<Stack.Screen name="System_DocumentMaster" component={System_DocumentMaster} options={{title:'Document Master'}}/>
<Stack.Screen name="System_BulkPrepayment" component={System_BulkPrepayment} options={{title:"Rescheduling_Bulk Prepayment"}}/>
<Stack.Screen name="System_ReschedulingDueDate" component={System_ReschedulingDueDate} options={{title:"Rescheduling Due Date Change"}}/>
<Stack.Screen name="System_ProfitRateChange" component={System_ProfitRateChange} options={{title:"Rescheduling Profit Rate Change"}}/>
<Stack.Screen name="System_PostDisbursalEdit" component={System_PostDisbursalEdit} options={{title:"Post Disbursal Edit"}}/>
<Stack.Screen name="System_ReschedulingTenureChange" component={System_ReschedulingTenureChange} options={{title:"Rescheduling Tenure Chnage"}}/>
<Stack.Screen name="System_DeferralConstitutionWise" component={System_DeferralConstitutionWise} options={{title:"Deferral Constitution Wise"}}/>
<Stack.Screen name="System_DeferralFinanceWise" component={System_DeferralFinanceWise} options={{title:"Deferral Finance Wise"}}/>
<Stack.Screen name="System_DeferralPortfolio" component={System_DeferralPortfolio} options={{title:"Deferral Portfolio Wise"}}/>



    </Stack.Navigator>
  );
};

export default UseCasesStackScreen;

const styles = StyleSheet.create({});
