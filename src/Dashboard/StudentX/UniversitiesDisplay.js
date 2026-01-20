import { StyleSheet, Text, View,TouchableOpacity,FlatList } from 'react-native'
import React from 'react'
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function UniversitiesDisplay({ route }) {
  const { country, universities } = route.params;
  console.log("univresities",universities);
  
  const navigation = useNavigation();

  const handleUniversityPress = (university) => {
    navigation.navigate('Universities Details', { 
      university: university,
      country :country
    });
  };

  const renderUniversityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.universityItem}
      onPress={() => handleUniversityPress(item)}
    >
      <View style={styles.universityContent}>
        <Text style={styles.universityName} numberOfLines={2}>
          {item.universityName}
        </Text>
        <Text style={styles.universityLocation}>
          {/* {item.city || 'N/A'}, */}
           {country}
        </Text>
      </View>
      <TouchableOpacity
       onPress={() => navigation.navigate('Universities Details', { university: item })}
      >
        <Text style={styles.applyButtonText}>Know More</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}> {country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()} Universities</Text>
        <View style={styles.placeholder} />
      </View>
      
      <Text style={styles.universityCount}>
        {universities.length} {universities.length === 1 ? "University" : "Universities"} found
      </Text>
      
      <FlatList
        data={universities}
        renderItem={renderUniversityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No universities found in {country}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    marginTop:30,
    padding: 8,
  },
  backButtonText: {
   
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  screenTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
   marginLeft:20,
    color: '#4B0082',
    marginTop:30
  },
  placeholder: {
    width: 24,
  },
  universityCount: {
    margin: 16,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20
  },
  universityItem: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  universityContent: {
    flex: 1,
    marginRight: 12,
  },
  universityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  universityLocation: {
    fontSize: 14,
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#4B0082',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyButtonText: {
    color: '#4B0082',
    fontWeight: 'bold',
    textDecorationLine:"underline"
  },
  emptyListText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#666',
  }
});
