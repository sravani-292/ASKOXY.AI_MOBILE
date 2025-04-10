import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  Modal,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import axios from 'axios';
import { COLORS } from "../../../Redux/constants/theme";

export default function CountriesDisplay() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const{width,height} = Dimensions.get('window')
  // Group universities by country
  const countriesUniversities = useMemo(() => {
    const groupedUniversities = universities.reduce((acc, university) => {
      const country = university.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(university);
      return acc;
    }, {});

    return Object.entries(groupedUniversities)
      .map(([country, universities]) => ({
        country,
        universities
      }))
      .sort((a, b) => a.country.localeCompare(b.country));
  }, [universities]);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = () => {
    setLoading(true);
    axios({
      method: "POST",
      url: "https://meta.oxyglobal.tech/api/user-service/searchForUniversity?pageIndex=0&pageSize=20",
    //   params: {
    //     pageIndex: 0,
    //     pageSize: 20
    //   }
    })
    .then((response) => {
      setUniversities(response.data.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching universities:", error.response);
      setError("Failed to load universities");
      setLoading(false);
    });
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.countryItem}
      onPress={() => setSelectedCountry(item)}
    >
      <Text style={styles.countryName}>{item.country}</Text>
      <Text style={styles.universityCount}>
        {/* {item.universities.length} Universities */}
        {item.universities.length}{item.universities.length>1?" Universities":" University"}
      </Text>
    </TouchableOpacity>
  );

  const renderUniversityModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!selectedCountry}
      onRequestClose={() => setSelectedCountry(null)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedCountry?.country} Universities</Text>
          <FlatList
            data={selectedCountry?.universities}
            renderItem={({ item }) => (
              <View style={styles.universityModalItem}>
                <Text style={styles.universityModalName} numberOfLines={2}>
                  {item.universityName}
                </Text>
                
              </View>
            )}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>No universities found</Text>
            }
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedCountry(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
        <Text style={{color:"#4B0082",textAlign:"center",justifyContent:"center",alignItems:"center"}}>Loading Universities...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchUniversities} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Countries & Universities</Text>
      
      <FlatList
        data={countriesUniversities}
        renderItem={renderCountryItem}
        keyExtractor={(item) => item.country}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No countries found</Text>
        }
      />
r
      {renderUnivesityModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 20,
      backgroundColor: '#ffffff',
      marginBottom: 10,
    },
    countryItem: {
      backgroundColor: 'white',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    countryName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    universityCount: {
      color: '#666',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      maxHeight: '70%',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    universityModalItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    universityModalName: {
      fontSize: 16,
      flex: 1,
    },
    universityModalId: {
      fontSize: 12,
      color: '#666',
    },
    closeButton: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#007bff',
      borderRadius: 10,
      alignItems: 'center',
    },
    closeButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
   loadingContainer:{
     justifyContent:"center",
     alignItems:"center",
    // marginTop:height/2
   }
  });