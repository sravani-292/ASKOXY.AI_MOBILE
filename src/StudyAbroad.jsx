import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  Dimensions,
  StatusBar,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';
import { 
  GOOGLE_API_KEY, 
  GOOGLE_SHEET_ID, 
} from '@env';

const DEFAULT_IMAGE = 'https://www.askoxy.ai/static/media/askoxylogostatic.3e03c861742645ba9a15.png';
const { width } = Dimensions.get('window');

const UniversityShowcase = () => {
  const [loading, setLoading] = useState(true);
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch universities data from Google Sheets
  useEffect(() => {
    fetchDataFromGoogleSheets();
    // console.log(GOOGLE_API_KEY);
  }, []);

  // Filter universities based on search text
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter(uni => 
        uni.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUniversities(filtered);
    }
  }, [searchText, universities]);

  const fetchDataFromGoogleSheets = async () => {
    try {
      setLoading(true);
      
      // Note: In production, you should not expose API keys in client-side code
      // Consider using environment variables or a backend service
      const API_KEY = GOOGLE_API_KEY;
      const SPREADSHEET_ID = GOOGLE_SHEET_ID;
      const RANGE = 'Sheet1!A1:K100'; 
      
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`
      );
      
      const sheetData = response.data;
      
      if (sheetData.values && sheetData.values.length > 1) {
        const headers = sheetData.values[0];
        const universitiesData = [];
        
        // Skip the header row and process each university row
        for (let i = 1; i < sheetData.values.length; i++) {
          const row = sheetData.values[i];
          if (!row || row.length === 0) continue; // Skip empty rows
          
          // Find column indices safely
          const nameIndex = headers.indexOf('Name');
          const imageIndex = headers.indexOf('Image');
          const countryIndex = headers.indexOf('Country');
          const rankingIndex = headers.indexOf('Ranking');
          const intakesIndex = headers.indexOf('Intakes');
          
          // Parse university data from the row with null checks
          const universityData = {
            name: nameIndex >= 0 && row[nameIndex] ? row[nameIndex] : '',
            image: imageIndex >= 0 && row[imageIndex] ? row[imageIndex] : '',
            country: countryIndex >= 0 && row[countryIndex] ? row[countryIndex] : 'UK',
            ranking: rankingIndex >= 0 && row[rankingIndex] ? row[rankingIndex] : 'N/A',
            intakes: intakesIndex >= 0 && row[intakesIndex] ? row[intakesIndex] : '',
          };
          
          universitiesData.push(universityData);
        }
        
        setUniversities(universitiesData);
        setFilteredUniversities(universitiesData);
      } else {
        throw new Error('Invalid data format or empty sheet');
      }
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error.response);
      Alert.alert('Error', 'Failed to load university data');
      
      // Fallback to sample data if API fails
      const sampleData = getSampleUniversities();
      setUniversities(sampleData);
      setFilteredUniversities(sampleData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Sample university data as fallback
  const getSampleUniversities = () => [
    {
      name: "BPP University",
      image: "https://example.com/bpp.png",
      country: "UK",
      ranking: "Top 100",
      intakes: "Jan, May, Sept"
    },
    {
      name: "University of East London",
      image: "https://example.com/uel.png",
      country: "UK",
      ranking: "Top 150",
      intakes: "Jan, Sept"
    },
    {
      name: "Middlesex University",
      image: "https://example.com/middlesex.png",
      country: "UK",
      ranking: "Top 120",
      intakes: "Sept, Jan"
    },
    {
      name: "University of Greenwich",
      image: "https://example.com/greenwich.png",
      country: "UK",
      ranking: "Top 80",
      intakes: "Sept, Jan, May"
    },
    {
      name: "University of Birmingham",
      image: "https://example.com/birmingham.png",
      country: "UK",
      ranking: "Top 50",
      intakes: "Sept, Jan"
    },
    {
      name: "London Metropolitan University",
      image: "https://example.com/london-met.png",
      country: "UK",
      ranking: "Top 200",
      intakes: "Jan, May, Sept"
    }
  ];

  const onRefresh = () => {
    setRefreshing(true);
    fetchDataFromGoogleSheets();
  };

  const handleUniversityPress = (university) => {
    setSelectedUniversity(university);
    setModalVisible(true);
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => handleUniversityPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image || DEFAULT_IMAGE }} 
          style={styles.universityImage}
          resizeMode="contain"
          defaultSource={{ uri: DEFAULT_IMAGE }}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
      </View>
      <Text style={styles.universityName} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => handleUniversityPress(item)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.image || DEFAULT_IMAGE }} 
        style={styles.listItemImage}
        resizeMode="contain"
        defaultSource={{ uri: DEFAULT_IMAGE }}
        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
      />
      <View style={styles.listItemContent}>
        <Text style={styles.listItemName}>{item.name}</Text>
        <View style={styles.listItemDetails}>
          <Text style={styles.listItemDetailText}>
            <FontAwesome5 name="flag" size={12} color="#6b46c1" /> {item.country}
          </Text>
          {item.ranking && (
            <Text style={styles.listItemDetailText}>
              <FontAwesome5 name="trophy" size={12} color="#6b46c1" /> {item.ranking}
            </Text>
          )}
        </View>
      </View>
      <FontAwesome5 name="chevron-right" size={16} color="#6b46c1" />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6b46c1" />
          <Text style={styles.loadingText}>Loading universities...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Universities Directory</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity 
              style={[styles.toggleButton, viewMode === 'grid' && styles.activeToggle]}
              onPress={() => setViewMode('grid')}
            >
              <FontAwesome5 name="th-large" size={18} color={viewMode === 'grid' ? "#fff" : "#6b46c1"} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
              onPress={() => setViewMode('list')}
            >
              <FontAwesome5 name="list" size={18} color={viewMode === 'list' ? "#fff" : "#6b46c1"} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <FontAwesome5 name="search" size={16} color="#6b46c1" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search universities..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#9ca3af"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <FontAwesome5 name="times-circle" size={16} color="#6b46c1" />
            </TouchableOpacity>
          )}
        </View>
        
        {filteredUniversities.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <FontAwesome5 name="exclamation-circle" size={48} color="#d1d5db" />
            <Text style={styles.noResultsText}>No universities found</Text>
            <Text style={styles.noResultsSubtext}>Try a different search term</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUniversities}
            renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
            keyExtractor={(item, index) => `university-${index}`}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode} // Important for re-rendering when switching between grid and list
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : null}
            showsVerticalScrollIndicator={false}
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListFooterComponent={<View style={styles.listFooter} />}
          />
        )}
      </View>
      
      {/* University Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedUniversity && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setModalVisible(false)}
                  >
                    <FontAwesome5 name="times" size={20} color="#6b46c1" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalImageContainer}>
                  <Image 
                    source={{ uri: selectedUniversity.image || DEFAULT_IMAGE }} 
                    style={styles.modalImage}
                    resizeMode="contain"
                    onError={(e) => console.log('Modal image load error:', e.nativeEvent.error)}
                  />
                </View>
                
                <Text style={styles.modalTitle}>{selectedUniversity.name}</Text>
                
                <View style={styles.detailsContainer}>
                  <View style={styles.detailItem}>
                    <FontAwesome5 name="flag" size={16} color="#6b46c1" />
                    <Text style={styles.detailText}>Country: {selectedUniversity.country || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <FontAwesome5 name="trophy" size={16} color="#6b46c1" />
                    <Text style={styles.detailText}>Ranking: {selectedUniversity.ranking || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <FontAwesome5 name="calendar-alt" size={16} color="#6b46c1" />
                    <Text style={styles.detailText}>Intakes: {selectedUniversity.intakes || 'N/A'}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.inquireButton}
                  onPress={() => {
                    Alert.alert(
                      "Request Information",
                      `Would you like to receive more information about ${selectedUniversity.name}?`,
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Yes", onPress: () => console.log("Information requested for:", selectedUniversity.name) }
                      ]
                    );
                  }}
                >
                  <Text style={styles.inquireButtonText}>Request Information</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b46c1',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f3e8ff',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeToggle: {
    backgroundColor: '#6b46c1',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 10,
    color: '#6b46c1',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 48) / 2, // 16px padding on each side, 16px gap between items
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    padding: 12,
  },
  imageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  universityImage: {
    width: '100%',
    height: '100%',
  },
  universityName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4b5563',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: 4,
  },
  listItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemDetailText: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 12,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  listFooter: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'flex-end',
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeButton: {
    padding: 8,
  },
  modalImageContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6b46c1',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f3e8ff',
    padding: 12,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 12,
    flex: 1,
  },
  inquireButton: {
    backgroundColor: '#6b46c1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  inquireButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UniversityShowcase;