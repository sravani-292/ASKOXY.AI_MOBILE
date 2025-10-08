// App.js
import React, { useState, useEffect ,useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import BASE_URL from "../../../../Config"
import { useFocusEffect } from '@react-navigation/native';
const { width: screenWidth } = Dimensions.get('window');
import { useSelector } from 'react-redux';

const DisplayJobsForUser = ({navigation}) => {
   const user = useSelector((state) => state.counter);
    const token = user.accessToken;
    const userId = user.userId
  const [jobsData,setJobsData]=useState([])
  const [jobs, setJobs] = useState(jobsData);
  const [filteredJobs, setFilteredJobs] = useState(jobsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState(new Set());
   
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
  // Extract unique values for filters
  const industries = [...new Set(jobs.map(job => job.industry))].sort();
  const jobTypes = [...new Set(jobs.map(job => job.jobType))].sort();
  const locations = [...new Set(jobs.map(job => job.jobLocations))].sort();
  const experiences = [...new Set(jobs.map(job => job.experience))].sort();
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Salary ranges
  const salaryRanges = [
    { label: 'Not Specified', value: 'not-specified' },
    { label: '0-5 LPA', value: '0-5' },
    { label: '5-10 LPA', value: '5-10' },
    { label: '10-15 LPA', value: '10-15' },
    { label: '15-25 LPA', value: '15-25' },
    { label: '25+ LPA', value: '25+' }
  ];

  // Extract all unique skills
  const allSkills = [...new Set(
    jobs.flatMap(job => 
      job.skills ? job.skills.split(',').map(skill => skill.trim()) : []
    )
  )].sort();

    useFocusEffect(
      useCallback(() => {
        appliedjobsfunc();
      }, [])
    );

  useEffect(() => {
  fetchJobsForUser();
}, []); // run only once when component mounts


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

  if (selectedIndustry && selectedIndustry !== 'All') {
    filtered = filtered.filter(job => job.industry === selectedIndustry);
  }

  if (selectedJobType && selectedJobType !== 'All') {
    filtered = filtered.filter(job => job.jobType === selectedJobType);
  }

  if (selectedLocation && selectedLocation !== 'All') {
    filtered = filtered.filter(job => job.jobLocations === selectedLocation);
  }

  if (selectedExperience && selectedExperience !== 'All') {
    filtered = filtered.filter(job => job.experience === selectedExperience);
  }

  if (selectedSalary && selectedSalary !== 'All') {
    filtered = filtered.filter(job => {
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
    });
  }

  if (selectedSkill && selectedSkill !== 'All') {
    filtered = filtered.filter(job =>
      job.skills && job.skills.toLowerCase().includes(selectedSkill.toLowerCase())
    );
  }

  setFilteredJobs(filtered);
}, [
  searchQuery,
  selectedIndustry,
  selectedJobType,
  selectedLocation,
  selectedExperience,
  selectedSalary,
  selectedSkill,
  jobs,
]);


 const appliedjobsfunc = () => {
    axios
      .get(
        `${BASE_URL}marketing-service/campgin/getuserandllusersappliedjobs?userId=${userId}`,{
          headers:{
            'Authorization':`Bearer ${token}`
          }
        }
      )
      .then((response) => {
        console.log("applied jobs", response.data);
        setAppliedJobs(response.data); // save the applied jobs
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const clearFilters = () => {
    setSelectedIndustry('');
    setSelectedJobType('');
    setSelectedLocation('');
    setSelectedExperience('');
    setSelectedSalary('');
    setSelectedSkill('');
    setSearchQuery('');
  };

const fetchJobsForUser =()=>{
axios({
  method: 'get',
  url: `${BASE_URL}marketing-service/campgin/getalljobsbyuserid`,
  headers:{
    'Authorization':`Bearer ${token}`
  }
        
})
.then((response)=>{
  console.log("Jobs for user",response.data)
  setJobsData(response.data)
  setJobs(response.data)
})
.catch((error)=>{
  console.log("Error in fetching jobs for user",error)
})
}




  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const formatSalary = (min, max) => {
    if (min === 0 && max === 0) return 'Not disclosed';
    if (min === max && min > 0) return `₹${min}L`;
    if (min > 0 && max > 0) return `₹${min}L - ₹${max}L`;
    if (max > 0) return `Up to ₹${max}L`;
    return 'Not disclosed';
  };

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'fulltime': return '#10B981';
      case 'contract': return '#F59E0B';
      case 'parttime': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getWorkModeColor = (mode) => {
    switch (mode) {
      case 'REMOTE': return '#3B82F6';
      case 'HYBRID': return '#8B5CF6';
      case 'ONSITE': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Dropdown Component
  const DropdownModal = ({ visible, onClose, title, data, selectedValue, onSelect, isSkills = false }) => (
    <Modal visible={visible} transparent animationType="slide">
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
                style={[
                  styles.modalItem,
                  selectedValue === item.value && styles.selectedModalItem
                ]}
                onPress={() => {
                  onSelect(item.value === 'All' ? '' : item.value);
                  onClose();
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  selectedValue === item.value && styles.selectedModalItemText
                ]}>
                  {item.label || item.value || item}
                </Text>
                {selectedValue === item.value && (
                  <Ionicons name="checkmark" size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );

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
          <Image
            source={{ uri: job.companyLogo }}
            style={styles.companyLogo}
            onError={() => {}}
          />
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle} numberOfLines={2}>{job.jobTitle}</Text>
            <Text style={styles.companyName}>{job.companyName}</Text>
            {job.jobDesignation !== job.jobTitle && (
              <Text style={styles.jobDesignation} numberOfLines={1}>{job.jobDesignation}</Text>
            )}
          </View>
          {appliedJobs.some(
                      (appliedjob) => appliedjob.jobId === job.id
                    ) ? (
                      <TouchableOpacity
                        style={ { backgroundColor: "green",padding:5,borderRadius:5,marginLeft:10 }}
                        disabled
                      >
                      <Text style={{color:"white"}}>Applied</Text>
                      </TouchableOpacity>
                    ) : null}

        </View>
        {/* <TouchableOpacity onPress={() => toggleSaveJob(job.id)} style={styles.saveButton}>
          <Ionicons
            name={savedJobs.has(job.id) ? "heart" : "heart-outline"}
            size={22}
            color={savedJobs.has(job.id) ? "#EF4444" : "#9CA3AF"}
          />
        </TouchableOpacity> */}
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
        <View style={styles.jobDetailRow}>
          <Ionicons name="briefcase-outline" size={16} color="#6B7280" />
          <Text style={[styles.jobDetailText, { color: getWorkModeColor(job.workMode) }]}>
            {job.workMode}
          </Text>
        </View>
      </View>

      <Text style={styles.jobDescription}>
        {truncateText(job.description)}
      </Text>

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

      {job.applicationDeadLine && (
        <View style={styles.deadlineContainer}>
          <Ionicons name="warning-outline" size={14} color="#F59E0B" />
          <Text style={styles.deadlineText}>
            Deadline: {new Date(job.applicationDeadLine).toLocaleDateString()}
          </Text>
        </View>
      )}
      
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
       <View style={styles.headerBar}>
    <View style={styles.headerLeft}>
      <Ionicons name="rocket-outline" size={20} style={styles.headerIcon} />
      <View>
        <Text style={styles.headerTitle}>Find Your Dream Job</Text>
        <Text style={styles.headerSubtitle}>Search jobs, companies & roles</Text>
      </View>
    </View>

    {/* optional right-side icon (notifications / profile etc) */}
    {/* <TouchableOpacity style={styles.headerRight}>
      <Ionicons name="notifications-outline" size={20} color="#6B7280" />
    </TouchableOpacity> */}
  </View>
  
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs, companies, locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearch}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScrollView}>
        <View style={styles.filtersContainer}>
          <FilterButton
            title="Industry"
            value={selectedIndustry}
            onPress={() => setShowIndustryModal(true)}
            icon="business-outline"
          />
          <FilterButton
            title="Job Type"
            value={selectedJobType}
            onPress={() => setShowJobTypeModal(true)}
            icon="briefcase-outline"
          />
          <FilterButton
            title="Location"
            value={selectedLocation}
            onPress={() => setShowLocationModal(true)}
            icon="location-outline"
          />
          <FilterButton
            title="Experience"
            value={selectedExperience}
            onPress={() => setShowExperienceModal(true)}
            icon="time-outline"
          />
          <FilterButton
            title="Salary"
            value={salaryRanges.find(s => s.value === selectedSalary)?.label}
            onPress={() => setShowSalaryModal(true)}
            icon="card-outline"
          />
          <FilterButton
            title="Skills"
            value={selectedSkill}
            onPress={() => setShowSkillsModal(true)}
            icon="code-slash-outline"
          />
          
          {(selectedIndustry || selectedJobType || selectedLocation || selectedExperience || selectedSalary || selectedSkill) && (
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </Text>
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
       {/* Footer Features */}
    <View style={styles.featuresFooter}>
      <View style={styles.featureTag}>
        <Text style={styles.featureText}>🚀 Fast Apply</Text>
      </View>
      <View style={styles.featureTag}>
        <Text style={styles.featureText}>✨ Top Companies</Text>
      </View>
      <View style={styles.featureTag}>
        <Text style={styles.featureText}>❤️ Great Benefits</Text>
      </View>
    </View>

      {/* Modals */}
      <DropdownModal
        visible={showIndustryModal}
        onClose={() => setShowIndustryModal(false)}
        title="Select Industry"
        data={industries.map(industry => ({ label: industry, value: industry }))}
        selectedValue={selectedIndustry}
        onSelect={setSelectedIndustry}
      />

      <DropdownModal
        visible={showJobTypeModal}
        onClose={() => setShowJobTypeModal(false)}
        title="Select Job Type"
        data={jobTypes.map(type => ({ 
          label: type.charAt(0).toUpperCase() + type.slice(1), 
          value: type 
        }))}
        selectedValue={selectedJobType}
        onSelect={setSelectedJobType}
      />

      <DropdownModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Select Location"
        data={locations.map(location => ({ label: location, value: location }))}
        selectedValue={selectedLocation}
        onSelect={setSelectedLocation}
      />

      <DropdownModal
        visible={showExperienceModal}
        onClose={() => setShowExperienceModal(false)}
        title="Select Experience"
        data={experiences.map(exp => ({ label: exp, value: exp }))}
        selectedValue={selectedExperience}
        onSelect={setSelectedExperience}
      />

      <DropdownModal
        visible={showSalaryModal}
        onClose={() => setShowSalaryModal(false)}
        title="Select Salary Range"
        data={salaryRanges}
        selectedValue={selectedSalary}
        onSelect={setSelectedSalary}
      />

      <DropdownModal
        visible={showSkillsModal}
        onClose={() => setShowSkillsModal(false)}
        title="Select Skill"
        data={allSkills.map(skill => ({ label: skill, value: skill }))}
        selectedValue={selectedSkill}
        onSelect={setSelectedSkill}
        isSkills={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBar: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: '#E5E7EB',
},

  headerLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12, // supported on newer RN; replace with margin if needed
},

headerIcon: {
  color: '#3B82F6',
  backgroundColor: '#EBF4FF',
  padding: 8,
  borderRadius: 10,
  overflow: 'hidden',
},

headerTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: '#111827',
  lineHeight: 22,
},

headerSubtitle: {
  fontSize: 12,
  color: '#6B7280',
  marginTop: 2,
},

headerRight: {
  padding: 6,
  borderRadius: 10,
},
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  clearSearch: {
    padding: 4,
  },
  filtersScrollView: {
    maxHeight: 60,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
    gap: 10,
    height: 30,
  },
  activeFilterButton: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    maxWidth: 80,
    height: 16,
  },
  activeFilterButtonText: {
    color: '#3B82F6',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    height: 30,
  },
  clearFiltersText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '500',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  jobsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 22,
  },
  companyName: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 2,
  },
  jobDesignation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  saveButton: {
    padding: 4,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobDetailText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  jobDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '500',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  salaryText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  viewJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  viewJobText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 12,
    gap: 4,
  },
  deadlineText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedModalItem: {
    backgroundColor: '#EBF4FF',
  },
  modalItemText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  selectedModalItemText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  featuresFooter: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 8,
  borderTopWidth: 1,
  borderColor: '#E5E7EB',
  backgroundColor: '#FFFFFF',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
},
featureTag: {
  backgroundColor: '#F3F4F6',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
},
featureText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#374151',
},

});

export default DisplayJobsForUser;