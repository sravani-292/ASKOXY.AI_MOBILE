import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { COLORS } from "../../../Redux/constants/theme";

export default function CountriesDisplay() {
  const navigation = useNavigation();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { width, height } = Dimensions.get('window');

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
    })
    .then((response) => {
      console.log("countries response",response.data);
      
      setUniversities(response.data.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching universities:", error.response);
      setError("Failed to load universities");
      setLoading(false);
    });
  };

  const handleCountryPress = (country) => {
    navigation.navigate('Universities Display', { 
      country: country.country,
      universities: country.universities
    });
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.countryItem}
      onPress={() => handleCountryPress(item)}
    >
      <Text style={styles.countryName}>{item.country}</Text>
      <View style={styles.countDetails}>
        <Text style={styles.universityCount}>
          {item.universities.length} {item.universities.length === 1 ? "University" : "Universities"}
        </Text>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
        <Text style={styles.loadingText}>Loading Universities...</Text>
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
      {/* <Text style={styles.screenTitle}>Countries & Universities</Text> */}
      
      <FlatList
        data={countriesUniversities}
        renderItem={renderCountryItem}
        keyExtractor={(item) => item.country}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No countries found</Text>
        }
      />
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
    color: '#4B0082',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listContainer: {
    paddingBottom: 20
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
    flex: 1,
  },
  countDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  universityCount: {
    color: '#666',
    marginRight: 8,
  },
  arrowContainer: {
    marginLeft: 5,
  },
  arrow: {
    fontSize: 22,
    color: '#4B0082',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#4B0082",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4B0082',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#666',
  }
});