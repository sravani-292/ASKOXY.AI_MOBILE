import React,{useState,useEffect} from "react";
import { View, Text, TextInput, StyleSheet, Switch } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import BASE_URL from "../../../../Config"
import { useSelector } from "react-redux";
const Step1 = ({ formData, handleChange }) => {
  const [userTypes,setUserTypes] =useState( [
  { label: "Advocate", value: "Advocate" },
    { label: "Chartered Accountant (CA)", value: "CA" },
    { label: "Company Secretary (CS)", value: "CS" },
    { label: "Consultant", value: "Consultant" },
    { label: "Teacher", value: "Teacher" },
    { label: "Doctor", value: "Doctor" },
    { label: "Engineer", value: "Engineer" },
    { label: "Lawyer", value: "Lawyer" },
    { label: "Startup Founder", value: "Startup Founder" },
    { label: "Entrepreneur", value: "Entrepreneur" },
    { label: "Investor", value: "Investor" },
    { label: "Banker", value: "Banker" },
    { label: "Software Developer", value: "Software Developer" },
    { label: "Data Scientist", value: "Data Scientist" },
    { label: "AI / ML Expert", value: "AI/ML Expert" },
    { label: "Researcher", value: "Researcher" },
    { label: "Designer", value: "Designer" },
    { label: "Marketing Specialist", value: "Marketing Specialist" },
    { label: "HR Professional", value: "HR Professional" },
    { label: "Operations Manager", value: "Operations Manager" },
    { label: "Sales Executive", value: "Sales Executive" },
    { label: "Product Manager", value: "Product Manager" },
    { label: "CXO (CEO / CTO / CFO etc.)", value: "CXO" },
    { label: "Freelancer", value: "Freelancer" },
    { label: "Business Consultant", value: "Consultant" },
    { label: "Other", value: "Other" },
  ])

  const user = useSelector((state) => state.counter);
  const userId = user?.userId;

  const languages = [
    { label: "English", value: "English" },
    { label: "తెలుగు", value: "తెలుగు" },
    { label: "हिंदी", value: "हिंदी" },
  ];
// const[personalDetails,setPersonalDetails]=useState();




useEffect(()=>{
  getProfile();
  
   if (
      formData.userRole &&
      formData.userRole !== "Other" &&
      !userTypes.some((userTypes) => userTypes.value === formData.userRole)
    ) {
      setUserTypes((prev) => [
        ...prev.filter((userTypes) => userTypes.value !== formData.userRole), // Avoid duplicates
        { label: formData.userRole, value: formData.userRole },
      ]);
    }
},[])

const getProfile=()=>{
  axios.get(`${BASE_URL}user-service/getProfile/${userId}`)
  .then((response)=>{
    console.log("Profile data",response.data);
    // setPersonalDetails(response.data);
     if (response.data?.userName) {
          handleChange("creatorName", response.data.userName);
        }
  })
  .catch((error)=>{
    console.log("Profile error",error); 
  })
}




  // Clear customDomain if domain is not "Other"
  const handleDomainChange = (item) => {
    console.log("Selected domain:", item);
    handleChange("userRole", item.value);
    if (item.value === "Other") {
       console.log("Selected :", item);
      // handleChange("customDomain", "");
    }
  };

   const handleLanguage = (item) => {
    // console.log("Selected domain:", item);
    handleChange("language", item.value);
    // if (item.value === "Other") {
    //   handleChange("customDomain", "");
    // }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Agent Creator Profile</Text>

      <Text style={styles.label}>AI Agent Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter agent name"
        placeholderTextColor={"#94A3B8"}
        value={formData.agentName}
        onChangeText={(v) => handleChange("agentName", v)}
        accessible={true}
        accessibilityLabel="Agent Name"
      />

       <Text style={styles.label}>Creator Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Creator Name"
        placeholderTextColor={"#94A3B8"}
        value={formData.creatorName}
        onChangeText={(v) => handleChange("creatorName", v)}
        accessible={true}
        accessibilityLabel="Sub Domain"
      />

      <Text style={styles.label}>Professional Identity of the Creator *</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={userTypes}
        labelField="label"
        valueField="value"
        placeholder="Select a role"
        value={formData.userRole}
        onChange={handleDomainChange}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#F1F5F9"
        accessible={true}
        accessibilityLabel="User Role"
      />
      {formData.userRole === "Other" && (
        <>
          {/* <Text style={styles.label}>Custom Domain *</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Enter your profession"
            placeholderTextColor={"#94A3B8"}
            value={formData.userRole || ""}
            onChangeText={(v) => handleChange("userRole", v)}
            accessible={true}
            accessibilityLabel="customDomain"
          />
        </>
      )}

     

      <Text style={styles.label}>Creator Experience Overview(optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Creator Experience Overview"
        placeholderTextColor={"#94A3B8"}
        value={formData.userExperienceSummary}
        onChangeText={(v) => handleChange("userExperienceSummary", v)}
        accessible={true}
        accessibilityLabel="creator Experience Overview"
        multiline={true}
      />

      <Text style={styles.label}>Problems Solved in the Past (Description) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor={"#94A3B8"}
        value={formData.description}
        onChangeText={(v) => handleChange("description", v)}
        accessible={true}
        accessibilityLabel="Description"
        multiline={true}
      />

       <Text style={styles.label}>Your Strengths in the Field(optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Strengths"
        placeholderTextColor={"#94A3B8"}
        value={formData.strengths}
        onChangeText={(v) => handleChange("strengths", v)}
        accessible={true}
        accessibilityLabel="Strengths"
        multiline={true}
      />

      <Text style={styles.label}>Preferred Language</Text>
       <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={languages}
        labelField="label"
        valueField="value"
        placeholder="Select a language"
        value={formData.language}
        onChange={handleLanguage}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#F1F5F9"
        accessible={true}
        accessibilityLabel="Language"
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#1F2937",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    height: 50, // Consistent with input height
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  itemTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    // marginBottom: 12,

  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginRight: 10,
  },
});

export default Step1;