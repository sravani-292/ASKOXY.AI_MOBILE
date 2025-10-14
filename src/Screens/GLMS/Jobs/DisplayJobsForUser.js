import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity,
  Image, Modal, FlatList, SafeAreaView, StatusBar, Dimensions, Alert,ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import BASE_URL from "../../../Config"
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from "react-native-vector-icons/Ionicons"
const { width: screenWidth } = Dimensions.get('window');

const DisplayJobsForUser = ({ navigation }) => {
   const userData = useSelector((state) => state.counter);
  //  console.log({userData})
    const token = userData?.accessToken;
    const customerId = userData?.userId;
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);
  
  // Filter states
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedSalary, setSelectedSalary] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  // Modal states
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [showJobTypeModal, setShowJobTypeModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const[queryLoader,setQueryLoader]=useState(false)
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    email: '',
    mobile: '',
    query: ''
  });

  // Extract unique values for filters
  const industries = [...new Set(jobs.map(job => job.industry))].sort();
  const jobTypes = [...new Set(jobs.map(job => job.jobType))].sort();
  const locations = [...new Set(jobs.map(job => job.jobLocations))].sort();
  const experiences = [...new Set(jobs.map(job => job.experience))].sort();
  const allSkills = [...new Set(jobs.flatMap(job => 
    job.skills ? job.skills.split(',').map(skill => skill.trim()) : []
  ))].sort();

  const salaryRanges = [
    { label: 'Not Specified', value: 'not-specified' },
    { label: '0-5 LPA', value: '0-5' },
    { label: '5-10 LPA', value: '5-10' },
    { label: '10-15 LPA', value: '10-15' },
    { label: '15-25 LPA', value: '15-25' },
    { label: '25+ LPA', value: '25+' }
  ];

  useFocusEffect(
  useCallback(() => {
    const mobile =
      userData?.mobileNumber && userData.mobileNumber !== "null"
        ? userData.mobileNumber
        : userData?.whatsappNumber || "";

    setContactForm({
      ...contactForm,
      email: userData?.email || "",
      mobile: mobile,
    });

    appliedjobsfunc();
  }, [userData])
);


  useEffect(() => { fetchJobsForUser(); }, []);

  useEffect(() => {
    let filtered = jobs;
    if (searchQuery.trim()) {
      filtered = filtered.filter(job =>
        job.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.jobLocations?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.skills && job.skills.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (selectedIndustry) filtered = filtered.filter(job => job.industry === selectedIndustry);
    if (selectedJobType) filtered = filtered.filter(job => job.jobType === selectedJobType);
    if (selectedLocation) filtered = filtered.filter(job => job.jobLocations === selectedLocation);
    if (selectedExperience) filtered = filtered.filter(job => job.experience === selectedExperience);
    if (selectedSalary) filtered = filtered.filter(job => filterBySalary(job));
    if (selectedSkill) filtered = filtered.filter(job => job.skills && job.skills.toLowerCase().includes(selectedSkill.toLowerCase()));
    setFilteredJobs(filtered);
  }, [searchQuery, selectedIndustry, selectedJobType, selectedLocation, selectedExperience, selectedSalary, selectedSkill, jobs]);

  const filterBySalary = (job) => {
    const salaryMax = job.salaryMax || 0;
    switch (selectedSalary) {
      case 'not-specified': return job.salaryMin === 0 && job.salaryMax === 0;
      case '0-5': return salaryMax > 0 && salaryMax <= 5;
      case '5-10': return salaryMax > 5 && salaryMax <= 10;
      case '10-15': return salaryMax > 10 && salaryMax <= 15;
      case '15-25': return salaryMax > 15 && salaryMax <= 25;
      case '25+': return salaryMax > 25;
      default: return true;
    }
  };

  const appliedjobsfunc = () => {
    axios.get(`${BASE_URL}marketing-service/campgin/getuserandllusersappliedjobs?userId=${customerId}`)
      .then((response) => { setAppliedJobs(response.data); })
      .catch((error) => { console.log("error", error); });
  };

  const fetchJobsForUser = () => {
    axios.get(`${BASE_URL}marketing-service/campgin/getalljobsbyuserid`)
      .then((response) => { setJobs(response.data); setFilteredJobs(response.data); })
      .catch((error) => { console.log("Error in fetching jobs for user", error); });
  };

  const clearFilters = () => {
    setSelectedIndustry(''); setSelectedJobType(''); setSelectedLocation('');
    setSelectedExperience(''); setSelectedSalary(''); setSelectedSkill(''); setSearchQuery('');
  };




  const handleContactSubmit = () => {
    if (!contactForm.email || !contactForm.mobile || !contactForm.query) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    // Handle form submission here
    console.log('Contact Form:', contactForm);
    var data={
      "email":contactForm.email,
      "mobileNumber":contactForm.mobile,
      "queryStatus":"PENDING",
      "projectType":"ASKOXY",
      "askOxyOfers":"FREESAMPLE",
      "adminDocumentId":"",
      "comments":"",
      "id":"",
      "resolvedBy":"",
      "resolvedOn":"",
      "status":"",
      "userDocumentId":"",
      "query":contactForm.query,
      "userId":customerId
    }
    console.log({data})
    setQueryLoader(true)
    axios({
      method:"post",
      url:`${BASE_URL}user-service/write/saveData`,
      data:data,
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then((response)=>{
      console.log("Write to us response",response.data)
      Alert.alert('Success', 'Your query has been submitted!');
      setContactForm({ name: '', mobile: '', query: '' });
      setShowContactModal(false);
      setQueryLoader(false)
    })
    .catch((error)=>{
      console.log("error",error.response)
      setQueryLoader(false)
      Alert.alert("Error",error.response.data.error)
    })
    
  };

  const updateContactForm = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatSalary = (min, max) => {
    if (min === 0 && max === 0) return 'Not disclosed';
    if (min === max && min > 0) return `₹${min}L`;
    if (min > 0 && max > 0) return `₹${min}L - ₹${max}L`;
    if (max > 0) return `Up to ₹${max}L`;
    return 'Not disclosed';
  };

  const truncateText = (text, maxLength = 120) => {
    return text.length <= maxLength ? text : text.substr(0, maxLength) + '...';
  };



  // Dropdown Modal Component - Also memoized to prevent unnecessary re-renders
  const DropdownModal = useMemo(() => ({ visible, onClose, title, data, selectedValue, onSelect }) => (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={[{ label: 'All', value: 'All' }, ...data]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modalItem, selectedValue === item.value && styles.selectedModalItem]}
                onPress={() => { onSelect(item.value === 'All' ? '' : item.value); onClose(); }}
              >
                <Text style={[styles.modalItemText, selectedValue === item.value && styles.selectedModalItemText]}>
                  {item.label || item.value || item}
                </Text>
                {selectedValue === item.value && <Ionicons name="checkmark" size={20} color="#3B82F6" />}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  ), []);

  // Filter Button Component
  const FilterButton = ({ title, value, onPress, icon }) => (
    <TouchableOpacity style={[styles.filterButton, value && styles.activeFilterButton]} onPress={onPress}>
      <Ionicons name={icon} size={16} color={value ? '#3B82F6' : '#6B7280'} />
      <Text style={[styles.filterButtonText, value && styles.activeFilterButtonText]} numberOfLines={1}>
        {value || title}
      </Text>
      <Ionicons name="chevron-down" size={16} color={value ? '#3B82F6' : '#6B7280'} />
    </TouchableOpacity>
  );

  // Job Card Component
  const JobCard = ({ job }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobHeaderLeft}>
          <Image source={{ uri: job.companyLogo }} style={styles.companyLogo} />
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle} numberOfLines={2}>{job.jobTitle}</Text>
            <Text style={styles.companyName}>{job.companyName}</Text>
          </View>
          {appliedJobs.some(appliedjob => appliedjob.jobId === job.id) && (
            <TouchableOpacity style={styles.appliedButton} disabled>
              <Text style={styles.appliedText}>Applied</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.jobDetailRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.jobDetailText}>{job.jobLocations}</Text>
        </View>
        <View style={styles.jobDetailRow}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.jobDetailText}>{job.experience}</Text>
        </View>
      </View>

      <Text style={styles.jobDescription}>{truncateText(job.description)}</Text>

      {job.skills && (
        <View style={styles.skillsContainer}>
          {job.skills.split(',').slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill.trim()}</Text>
            </View>
          ))}
          {job.skills.split(',').length > 3 && (
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>+{job.skills.split(',').length - 3} more</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.jobFooter}>
        <View style={styles.salaryContainer}>
          <Ionicons name="card-outline" size={16} color="#6B7280" />
          <Text style={styles.salaryText}>{formatSalary(job.salaryMin, job.salaryMax)}</Text>
        </View>
        <TouchableOpacity style={styles.viewJobButton} onPress={() => navigation.navigate('Job Details', { jobDetails: job })}>
          <Text style={styles.viewJobText}>View Job</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header with Write to Us button */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Ionicons name="rocket-outline" size={20} style={styles.headerIcon} />
          <View>
            <Text style={styles.headerTitle}>Find Your Dream Job</Text>
            <Text style={styles.headerSubtitle}>Search jobs, companies & roles</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.writeToUsButton} onPress={() => setShowContactModal(true)}>
          <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
          <Text style={styles.writeToUsText}>Write to Us</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs, companies, locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScrollView}>
        <View style={styles.filtersContainer}>
          <FilterButton title="Industry" value={selectedIndustry} onPress={() => setShowIndustryModal(true)} icon="business-outline" />
          <FilterButton title="Job Type" value={selectedJobType} onPress={() => setShowJobTypeModal(true)} icon="briefcase-outline" />
          <FilterButton title="Location" value={selectedLocation} onPress={() => setShowLocationModal(true)} icon="location-outline" />
          <FilterButton title="Experience" value={selectedExperience} onPress={() => setShowExperienceModal(true)} icon="time-outline" />
          <FilterButton title="Salary" value={salaryRanges.find(s => s.value === selectedSalary)?.label} onPress={() => setShowSalaryModal(true)} icon="card-outline" />
          <FilterButton title="Skills" value={selectedSkill} onPress={() => setShowSkillsModal(true)} icon="code-slash-outline" />
          
          {(selectedIndustry || selectedJobType || selectedLocation || selectedExperience || selectedSalary || selectedSkill) && (
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>{filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found</Text>
      </View>

      {/* Job List */}
      <FlatList
        data={filteredJobs}
        renderItem={({ item }) => <JobCard job={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.jobsList}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search criteria or filters</Text>
            <TouchableOpacity style={styles.resetButton} onPress={clearFilters}>
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modals - Now properly memoized */}
      {showIndustryModal && (
        <DropdownModal 
          visible={showIndustryModal} 
          onClose={() => setShowIndustryModal(false)} 
          title="Select Industry" 
          data={industries.map(industry => ({ label: industry, value: industry }))} 
          selectedValue={selectedIndustry} 
          onSelect={setSelectedIndustry} 
        />
      )}
      
      {showJobTypeModal && (
        <DropdownModal 
          visible={showJobTypeModal} 
          onClose={() => setShowJobTypeModal(false)} 
          title="Select Job Type" 
          data={jobTypes.map(type => ({ label: type.charAt(0).toUpperCase() + type.slice(1), value: type }))} 
          selectedValue={selectedJobType} 
          onSelect={setSelectedJobType} 
        />
      )}
      
      {showLocationModal && (
        <DropdownModal 
          visible={showLocationModal} 
          onClose={() => setShowLocationModal(false)} 
          title="Select Location" 
          data={locations.map(location => ({ label: location, value: location }))} 
          selectedValue={selectedLocation} 
          onSelect={setSelectedLocation} 
        />
      )}
      
      {showExperienceModal && (
        <DropdownModal 
          visible={showExperienceModal} 
          onClose={() => setShowExperienceModal(false)} 
          title="Select Experience" 
          data={experiences.map(exp => ({ label: exp, value: exp }))} 
          selectedValue={selectedExperience} 
          onSelect={setSelectedExperience} 
        />
      )}
      
      {showSalaryModal && (
        <DropdownModal 
          visible={showSalaryModal} 
          onClose={() => setShowSalaryModal(false)} 
          title="Select Salary Range" 
          data={salaryRanges} 
          selectedValue={selectedSalary} 
          onSelect={setSelectedSalary} 
        />
      )}
      
      {showSkillsModal && (
        <DropdownModal 
          visible={showSkillsModal} 
          onClose={() => setShowSkillsModal(false)} 
          title="Select Skill" 
          data={allSkills.map(skill => ({ label: skill, value: skill }))} 
          selectedValue={selectedSkill} 
          onSelect={setSelectedSkill} 
        />
      )}
      
       {/* Contact Modal Component - Fixed with useMemo to prevent re-renders */}
    <Modal 
      visible={showContactModal} 
      transparent 
      animationType="fade"
      onRequestClose={()=>setShowContactModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: '80%' }]}>
          <View style={{flexDirection:"row", justifyContent:"space-between"}}>
          <Text style={{fontSize:16,paddingLeft:15,fontWeight:"bold"}}>Write to us</Text>
<Icon name="close" size={20} style={{paddingRight:15}} onPress={()=>setShowContactModal(false)}/ >
          </View>
          
          
          <View style={styles.contactForm}>
            <TextInput
              style={styles.input}
              placeholder="Your Email"
              value={contactForm.email}
              onChangeText={(text) => updateContactForm('email', text)}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={contactForm.mobile}
              onChangeText={(text) => updateContactForm('mobile', text)}
              keyboardType="number-pad"
              maxLength={10}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Your Query"
              value={contactForm.query}
              onChangeText={(text) => updateContactForm('query', text)}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
            {queryLoader==false?
            <TouchableOpacity style={styles.submitButton} onPress={()=>handleContactSubmit()}>
              <Text style={styles.submitButtonText}>Submit Query</Text>
            </TouchableOpacity>
            :
            <View style={styles.submitButton} >
              <ActivityIndicator size={"small"} color="white"/>            
            </View>
            }
          </View>
        </View>
      </View>
    </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { color: '#3B82F6', backgroundColor: '#EBF4FF', padding: 8, borderRadius: 10 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  writeToUsButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#3B82F6',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6
  },
  writeToUsText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    marginHorizontal: 16, marginVertical: 12, paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', elevation: 2
  },
  searchInput: { flex: 1, fontSize: 16, color: '#374151', marginLeft: 12 },
  filtersScrollView: { maxHeight: 60 },
  filtersContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  filterButton: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 5,
    backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB',
    minWidth: 80, gap: 10, height: 30
  },
  activeFilterButton: { backgroundColor: '#EBF4FF', borderColor: '#3B82F6' },
  filterButtonText: { fontSize: 13, color: '#6B7280', fontWeight: '500', maxWidth: 80, height: 16 },
  activeFilterButtonText: { color: '#3B82F6' },
  clearFiltersButton: {
    paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FEE2E2',
    borderRadius: 20, borderWidth: 1, borderColor: '#FECACA', height: 30
  },
  clearFiltersText: { fontSize: 13, color: '#DC2626', fontWeight: '500' },
  resultsContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  resultsText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  jobsList: { paddingHorizontal: 16, paddingBottom: 20 },
  jobCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#E5E7EB', elevation: 2
  },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  jobHeaderLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, gap: 12 },
  companyLogo: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#F3F4F6' },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', lineHeight: 22 },
  companyName: { fontSize: 14, color: '#3B82F6', fontWeight: '600', marginTop: 2 },
  appliedButton: { backgroundColor: "green", padding: 5, borderRadius: 5, marginLeft: 10 },
  appliedText: { color: "white" },
  jobDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 12 },
  jobDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  jobDetailText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  jobDescription: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 12 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  skillTag: { backgroundColor: '#EBF4FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  skillText: { fontSize: 11, color: '#3B82F6', fontWeight: '500' },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  salaryContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  salaryText: { fontSize: 13, color: '#059669', fontWeight: '600' },
  viewJobButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#3B82F6',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, gap: 4
  },
  viewJobText: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  resetButton: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  resetButtonText: { fontSize: 14, color: '#FFFFFF', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, paddingBottom: 40, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  selectedModalItem: { backgroundColor: '#EBF4FF' },
  modalItemText: { fontSize: 16, color: '#374151', flex: 1 },
  selectedModalItemText: { color: '#3B82F6', fontWeight: '600' },
  contactForm: { padding: 20 },
  input: { 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16, 
    fontSize: 16,
    backgroundColor: '#FFFFFF'
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default DisplayJobsForUser;