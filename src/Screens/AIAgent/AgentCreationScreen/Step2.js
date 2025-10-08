import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { RadioButton } from "react-native-paper";

const Step2 = ({ formData, handleChange }) => {
  const [descriptionLength, setDescriptionLength] = useState(
    formData.description.length
  );
  // const [isSolvingProblem, setIsSolvingProblem] = useState('');
  const [isOtherSectorSelected, setIsOtherSectorSelected] = useState(false);
  const [isOtherSubSectorSelected, setIsOtherSubSectorSelected] = useState(false);

  // const Sectors = [
  //   { label: "Law", value: "Law" },
  //   { label: "Finance", value: "Finance" },
  //   { label: "Healthcare", value: "Healthcare" },
  //   { label: "Taxation", value: "Taxation" },
  //   { label: "Education", value: "Education" },
  //   { label: "Technology", value: "Technology" },
  //   { label: "Marketing", value: "Marketing" },
  //   { label: "Human Resources", value: "Human Resources" },
  //   { label: "Operations", value: "Operations" },
  //   { label: "Manufacturing", value: "Manufacturing" },
  //   { label: "Retail", value: "Retail" },
  //   { label: "Other", value: "Other" },
  // ];

  const [Sectors, setSectors] = useState([
    { label: "Law", value: "Law" },
    { label: "Finance", value: "Finance" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "Taxation", value: "Taxation" },
    { label: "Education", value: "Education" },
    { label: "Technology", value: "Technology" },
    { label: "Marketing", value: "Marketing" },
    { label: "Human Resources", value: "Human Resources" },
    { label: "Operations", value: "Operations" },
    { label: "Manufacturing", value: "Manufacturing" },
    { label: "Retail", value: "Retail" },
    { label: "Other", value: "Other" },
  ]);

  const [subSectors, setSubSectors] = useState([
    { label: "Civil Law", value: "Civil Law" },
    { label: "Corporate Law", value: "Corporate Law" },
    { label: "GST", value: "GST" },
    { label: "Personal Finance", value: "Personal Finance" },
    { label: "Data Analytics", value: "Data Analytics" },
    { label: "Software Development", value: "Software Development" },
    { label: "Digital Marketing", value: "Digital Marketing" },
    { label: "Recruitment", value: "Recruitment" },
    { label: "Supply Chain", value: "Supply Chain" },
    { label: "Customer Support", value: "Customer Support" },
    { label: "Other", value: "Other" },
  ]);

   const [responseFormatOptions, setResponseFormatOptions] = useState([
    { label: "auto", value: "auto" },
    { label: "json_object", value: "json_object" },

  ]);

  // const subSectors = [
  //   { label: "Civil Law", value: "Civil Law" },
  //   { label: "Corporate Law", value: "Corporate Law" },
  //   { label: "GST", value: "GST" },
  //   { label: "Personal Finance", value: "Personal Finance" },
  //   { label: "Data Analytics", value: "Data Analytics" },
  //   { label: "Software Development", value: "Software Development" },
  //   { label: "Digital Marketing", value: "Digital Marketing" },
  //   { label: "Recruitment", value: "Recruitment" },
  //   { label: "Supply Chain", value: "Supply Chain" },
  //   { label: "Customer Support", value: "Customer Support" },
  //   { label: "Other", value: "Other" },
  // ];
 
  const gptModles = [{ label: "GPT-4o", value: "gpt-4o" }];

  const handleDescriptionChange = (text) => {
    if (text.length <= 300) {
      handleChange("business_idea", text);
      setDescriptionLength(text.length);
    }
  };

  const handleSectorChange = (item) => {
    console.log("Selected domain:", item);
    handleChange("Domain_Sector", item.value);
    // if (item.value === "Other") {
    //    console.log("Selected :", item);
    //   // handleChange("customDomain", "");
    // }
  };
  const handleSubSectorChange = (item) => {
    console.log("Selected domain:", item);
    handleChange("SubDomain_Subsector", item.value);
    // if (item.value === "Other") {
    //    console.log("Selected :", item);
    //   // handleChange("customDomain", "");
    // }
  };

  const handlegptModelChange = (item) => {
    console.log("Selected Gpt:", item);
    handleChange("gptModel", item.value);
    // if (item.value === "Other") {
    //    console.log("Selected :", item);
    //   // handleChange("customDomain", "");
    // }
  };

  useEffect(() => {
    // Add custom Domain_Sector if it exists and isn't in predefined sectors
    if (
      formData.Domain_Sector &&
      formData.Domain_Sector !== "Other" &&
      !Sectors.some((sector) => sector.value === formData.Domain_Sector)
    ) {
      setSectors((prev) => [
        ...prev.filter((sector) => sector.value !== formData.Domain_Sector), // Avoid duplicates
        { label: formData.Domain_Sector, value: formData.Domain_Sector },
      ]);
    }

    // Add custom SubDomain_Subsector if it exists and isn't in predefined subSectors
    if (
      formData.SubDomain_Subsector &&
      formData.SubDomain_Subsector !== "Other" &&
      !subSectors.some((subSector) => subSector.value === formData.SubDomain_Subsector)
    ) {
      setSubSectors((prev) => [
        ...prev.filter((subSector) => subSector.value !== formData.SubDomain_Subsector), // Avoid duplicates
        {
          label: formData.SubDomain_Subsector,
          value: formData.SubDomain_Subsector,
        },
      ]);
    }

    // Set "Other" selection state based on stored values
    setIsOtherSectorSelected(formData.Domain_Sector === "Other");
    setIsOtherSubSectorSelected(formData.SubDomain_Subsector === "Other");
  }, [formData.Domain_Sector, formData.SubDomain_Subsector]);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Business Context & GPT Model</Text>

      <Text style={styles.label}>Business/Idea *</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        placeholder="Firm/Brand/Practice"
        placeholderTextColor={"#94A3B8"}
        value={formData.business_idea}
        onChangeText={handleDescriptionChange}
        multiline
        maxLength={300}
        accessible={true}
        accessibilityLabel="business_idea"
      />
      <View style={styles.charCounterContainer}>
        <Text style={styles.charCounter}>{descriptionLength}/300</Text>
        {descriptionLength >= 300 && (
          <Text style={styles.charLimitWarning}>
            Maximum characters reached
          </Text>
        )}
      </View>

      <Text style={styles.label}>Domain/Sector *</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={Sectors}
        labelField="label"
        valueField="value"
        placeholder="Select a domain"
        value={formData.Domain_Sector}
        onChange={handleSectorChange}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#F1F5F9"
        accessible={true}
        accessibilityLabel="Sector"
      />
      {formData.Domain_Sector === "Other" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter custom dector/Domain"
            placeholderTextColor={"#94A3B8"}
            value={formData.customDomain_Sector || ""}
            onChangeText={(v) => handleChange("customDomain_Sector", v)}
            accessible={true}
            accessibilityLabel="customDomain_Sector"
          />
        </>
      )}

      <Text style={styles.label}>Sub-Domain/Subsector *</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={subSectors}
        labelField="label"
        valueField="value"
        placeholder="Select a sub-domain"
        value={formData.SubDomain_Subsector}
        onChange={handleSubSectorChange}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#F1F5F9"
        accessible={true}
        accessibilityLabel="Sector"
      />
      {formData.SubDomain_Subsector === "Other" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter custom sub-Sector/sub-Domain"
            placeholderTextColor={"#94A3B8"}
            value={formData.customSubDomain_Subsector || ""}
            onChangeText={(v) => handleChange("customSubDomain_Subsector", v)}
            accessible={true}
            accessibilityLabel="customSubDomain_Subsector"
          />
        </>
      )}

       <Text style={styles.label}>GPT Model *</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={gptModles}
        labelField="label"
        valueField="value"
        placeholder="Select a GPT Model"
        value={formData.gptModel}
        onChange={handlegptModelChange}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#F1F5F9"
        accessible={true}
        accessibilityLabel="Sector"
      />

      <Text style={styles.label}>Response Format *</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={responseFormatOptions}
              labelField="label"
              valueField="value"
              placeholder="Select response format"
              value={formData.responseFormat}
              onChange={(item) => handleChange("responseFormat", item.value)}
              containerStyle={styles.dropdownContainer}
              itemTextStyle={styles.itemTextStyle}
              activeColor="#F1F5F9"
              accessible={true}
              accessibilityLabel="Response Format"
            />

      <View style={styles.container}>
        <Text style={styles.label}>Are you solving a problem? *</Text>
        <View style={styles.radioGroup}>
          <View style={styles.radioItem}>
            <RadioButton
              value="yes"
              status={
                formData.isSolvingProblem === "yes" ? "checked" : "unchecked"
              }
              onPress={() => handleChange("isSolvingProblem", "yes")} // Update formData
              color="#1E40AF"
              uncheckedColor="#6B7280"
            />
            <Text>Yes</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton
              value="no"
              status={
                formData.isSolvingProblem === "no" ? "checked" : "unchecked"
              }
              onPress={() => handleChange("isSolvingProblem", "no")} // Update formData
              color="#1E40AF"
              uncheckedColor="#6B7280"
            />
            <Text>No</Text>
          </View>
        </View>
      </View>
{formData.isSolvingProblem==="yes" ? (
  <>       <Text style={styles.label}>Main Problem to Solve * (max 100 chars)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g.,Early Stage Startups struggle to choose the right structure and miss deadlines."
        placeholderTextColor={"#94A3B8"}
        value={formData.mainProblemSolved}
        onChangeText={(v) => handleChange("mainProblemSolved", v)}
        accessible={true}
        multiline={true}
        maxLength={100}
        accessibilityLabel="Main Problem"
      />
      </>

      ):null}
     

      <Text style={styles.label}>Unique Solution Method (max 100 chars)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g.,Fast Triage + templates + complaince checklist with remainders."
        placeholderTextColor={"#94A3B8"}
        value={formData.uniqueSolution}
        onChangeText={(v) => handleChange("uniqueSolution", v)}
        accessible={true}
        multiline={true}
        maxLength={100}
        accessibilityLabel="Unique Solution"
      />

      {/* <Text style={styles.label}>Business (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., EdTech Startup"
        value={formData.business}
        onChangeText={(v) => handleChange("business", v)}
        accessible={true}
        accessibilityLabel="Business"
      /> */}
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
  charCounterContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: -8,
    marginBottom: 12,
  },
  charCounter: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  charLimitWarning: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
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
  container: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 10,
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
});

export default Step2;
