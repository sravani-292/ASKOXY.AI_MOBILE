import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import BASE_URL from "../../../Config";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { Icon } from "react-native-elements";
const { width } = Dimensions.get("window");

const UniversitiesDetails = ({ route }) => {
  const navigation = useNavigation();
  const { university } = route.params;

  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;

  const [selectedCountry, setSelectedCountry] = useState(university.country);
  const [selectedUniversity, setSelectedUniversity] = useState(
    university.universityName
  );
  const [courses, setCourses] = useState([]);
  const [applicationType, setApplicationType] = useState("preferred");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [intake, setIntake] = useState(null);
  const [year, setYear] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Options for dropdowns
  const intakeOptions = [
    { label: "January 2025", value: "jan2025" },
    { label: "April 2025", value: "apr2025" },
    { label: "July 2025", value: "jul2025" },
    { label: "September 2025", value: "sep2025" },
  ];

  const yearOptions = [
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
  ];

  const RadioButton = ({ selected, onPress, label }) => (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
      <View style={styles.radioCircle}>
        {selected && <View style={styles.selectedRadio} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (selectedCountry && selectedUniversity) {
      fetchCourses();
    }
  }, [selectedCountry, selectedUniversity]);

  useEffect(() => {
    // Filter courses based on search query
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course) =>
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}student-service/student/courses-mapped-to-university?pageIndex=1&pageSize=100`,
        { countryName: selectedCountry, university: selectedUniversity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCourses(response.data.data);
      setFilteredCourses(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const renderCourseDetail = (icon, label, value) => (
    <View style={styles.detailRow}>
      <MaterialIcons name={icon} size={20} color="#4B0082" />
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.courseListItem,
        selectedCourse?.courseName === item.courseName &&
          styles.selectedCourseItem,
      ]}
      onPress={() => setSelectedCourse(item)}
    >
      <View style={styles.courseListItemContent}>
        <MaterialIcons
          name="school"
          size={20}
          color="#4B0082"
          style={styles.courseItemIcon}
        />
        <Text style={styles.courseItemName}>{item.courseName}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#4B0082" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedUniversity}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* University Card */}
        <View style={styles.universityCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="school" size={22} color="#4B0082" />
            <Text style={styles.cardHeaderText}>Institution Details</Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.universityInfo}>
            <View style={styles.infoRow}>
              <MaterialIcons name="public" size={18} color="#555" />
              <Text style={styles.infoLabel}>Country:</Text>
              <Text style={styles.infoValue}>{selectedCountry}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="location-city" size={18} color="#555" />
              <Text style={styles.infoLabel}>University:</Text>
              <Text style={styles.infoValue}>{selectedUniversity}</Text>
            </View>
          </View>
        </View>

        {/* Course Selection */}
        <View style={styles.sectionHeader}>
          <MaterialIcons name="class" size={22} color="#4B0082" />
          <Text style={styles.sectionTitle}>Available Courses</Text>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4B0082" />
            <Text style={styles.loadingText}>Loading courses...</Text>
          </View>
        ) : (
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <FontAwesome
                name="search"
                size={18}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search courses..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
              {searchQuery !== "" && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {/* Courses List */}
            <View style={styles.coursesListContainer}>
              <Text style={styles.coursesListHeader}>
                {filteredCourses.length}{" "}
                {filteredCourses.length === 1 ? "Course" : "Courses"} Available
              </Text>

              {filteredCourses.length > 0 ? (
                <FlatList
                  data={filteredCourses}
                  renderItem={renderCourseItem}
                  keyExtractor={(item, index) => `course-${index}`}
                  style={styles.coursesList}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={5}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  contentContainerStyle={styles.coursesListContent}
                />
              ) : (
                <View style={styles.noCourseContainer}>
                  <MaterialIcons name="search-off" size={40} color="#ccc" />
                  <Text style={styles.noCourseText}>No courses found</Text>
                </View>
              )}
            </View>

            {/* Selected Course Details */}
            {selectedCourse && (
              <View style={styles.courseCard}>
                <View style={styles.courseCardHeader}>
                  <Text style={styles.courseCardTitle}>
                    {selectedCourse.courseName}
                  </Text>
                </View>
                <View style={styles.cardDivider} />
                <View style={styles.courseCardContent}>
                  {renderCourseDetail(
                    "attach-money",
                    "Tuition Fee",
                    selectedCourse.cost
                  )}
                  {renderCourseDetail(
                    "schedule", 
                    "Duration",
                    selectedCourse.duration
                  )}
                  {renderCourseDetail(
                    "assignment",
                    "Assessment",
                    selectedCourse.typesOfExams
                  )}
                </View>
              </View>
            )}

            {/* Application Form Card */}
           
            {/* <View style={styles.sectionHeader}>
              <MaterialIcons name="edit" size={22} color="#4B0082" />
              <Text style={styles.sectionTitle}>Add Application</Text>
            </View>
            {selectedCourse && (
            <View style={styles.applicationCard}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="add-circle" size={22} color="#4B0082" />
                <Text style={styles.cardHeaderText}>Application Details</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.applicationCardContent}>
               
                <Text style={styles.formLabel}>Application Type</Text>
                <View style={styles.radioGroup}>
                  <RadioButton
                    selected={applicationType === "preferred"}
                    onPress={() => setApplicationType("preferred")}
                    label="My Preferred"
                  />
                  <RadioButton
                    selected={applicationType === "expert"}
                    onPress={() => setApplicationType("expert")}
                    label="Expert to Advise"
                  />
                </View>

               
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Preferred College</Text>
                  <TextInput
                    style={styles.formInput}
                    value={selectedUniversity}
                    onChangeText={setSelectedUniversity}
                    placeholder="College name"
                    placeholderTextColor="#999"
                  />
                </View>

               
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Intake</Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={intakeOptions}
                    search={false}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Intake"
                    value={intake}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setIntake(item.value);
                      setIsFocus(false);
                    }}
                    renderRightIcon={() => (
                      <Icon
                        name="arrow-drop-down"
                        size={24}
                        color={isFocus ? "#3498db" : "black"}
                      />
                    )}
                  />
                </View>

               
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Year</Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={yearOptions}
                    search={false}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Year"
                    value={year}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setYear(item.value);
                      setIsFocus(false);
                    }}
                    renderRightIcon={() => (
                      <Icon
                        name="arrow-drop-down"
                        size={24}
                        color={isFocus ? "#3498db" : "black"}
                      />
                    )}
                  />
                </View>

             
                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Apply</Text>
                  <MaterialIcons name="send" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>)} */}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  
 
  placeholder: {
    width: 24,
  },
  universityCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 16,
    elevation: 3,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  universityInfo: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    padding: 8,
  },
  clearButton: {
    padding: 4,
  },
  coursesListContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 16,
    marginTop: 0,
    elevation: 3,
    overflow: "hidden",
    height: 300,
  },
  coursesListHeader: {
    padding: 12,
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  coursesList: {
    flex: 1,
  },
  coursesListContent: {
    paddingBottom: 8,
  },
  courseListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedCourseItem: {
    backgroundColor: "#F0E6FA",
  },
  courseListItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  courseItemIcon: {
    marginRight: 10,
  },
  courseItemName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  noCourseContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noCourseText: {
    marginTop: 12,
    color: "#999",
    fontSize: 14,
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 16,
    marginTop: 8,
    elevation: 3,
    overflow: "hidden",
  },
  courseCardHeader: {
    padding: 16,
    backgroundColor: "#4B0082",
  },
  courseCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  courseCardContent: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
    width: 85,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  // Application Card Styles
  applicationCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 16,
    marginTop: 0,
    elevation: 3,
    overflow: "hidden",
  },
  applicationCardContent: {
    padding: 16,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4B0082",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#4B0082",
  },
  radioLabel: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  dropdown: {
    height: 45,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#333",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  applyButton: {
    backgroundColor: "#4B0082",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    alignSelf: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: '#4B0082',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    marginTop:30
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginTop:50
  },
  placeholder: {
    width: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: '#4B0082',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    marginTop:30
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginTop:50
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4B0082",
    marginTop:30
  },
});

export default UniversitiesDetails;
