import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Image, 
  Dimensions,
  TextInput,
  ActivityIndicator
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get("window");

// Sample data - replace with your API call
const SAMPLE_STORES = [
  {
    id: "1",
    name: "City Center Store",
    address: "123 Main Street, Downtown",
    distance: "1.2 km",
    rating: 4.5,
    hasFreeSamples: true,
    coordinates: {
      latitude: 37.78825,
      longitude: -122.4324,
    }
  },
  {
    id: "2",
    name: "Westside Mall",
    address: "456 West Avenue, Shopping District",
    distance: "3.8 km",
    rating: 4.2,
    hasFreeSamples: true,
    coordinates: {
      latitude: 37.78525,
      longitude: -122.4354,
    }
  },
  {
    id: "3",
    name: "North Point Market",
    address: "789 North Road, Business Park",
    distance: "5.1 km",
    rating: 4.7,
    hasFreeSamples: false,
    coordinates: {
      latitude: 37.78925,
      longitude: -122.4284,
    }
  },
  {
    id: "4",
    name: "Southside Outlet",
    address: "321 South Lane, Industrial Zone",
    distance: "7.3 km",
    rating: 3.9,
    hasFreeSamples: true,
    coordinates: {
      latitude: 37.78625,
      longitude: -122.4384,
    }
  },
];

const StoreLocatorScreen = ({ navigation }) => {
  const [stores, setStores] = useState(SAMPLE_STORES);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" or "map"
  const [selectedStore, setSelectedStore] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Search functionality
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = SAMPLE_STORES.filter(
        (store) => store.name.toLowerCase().includes(text.toLowerCase()) || 
                  store.address.toLowerCase().includes(text.toLowerCase())
      );
      setStores(filtered);
    } else {
      setStores(SAMPLE_STORES);
    }
  };

  // Select store and center map
  const handleSelectStore = (store) => {
    setSelectedStore(store);
    if (viewMode === "map") {
      setRegion({
        ...region,
        latitude: store.coordinates.latitude,
        longitude: store.coordinates.longitude,
      });
    }
  };

  const renderStoreItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.storeCard}
      onPress={() => handleSelectStore(item)}
    >
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      
      <Text style={styles.storeAddress}>{item.address}</Text>
      
      <View style={styles.storeFooter}>
        <View style={styles.distanceContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.distanceText}>{item.distance}</Text>
        </View>
        
        {item.hasFreeSamples && (
          <View style={styles.sampleBadge}>
            <Text style={styles.sampleText}>Free Samples Available</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.directionsButton}
        onPress={() => navigation.navigate("Directions", { store: item })}
      >
        <Ionicons name="navigate-circle-outline" size={18} color="white" />
        <Text style={styles.directionsText}>Get Directions</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#3d2a71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Store Locator</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by location or store name"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* View Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, viewMode === "list" && styles.activeToggle]}
          onPress={() => setViewMode("list")}
        >
          <Ionicons name="list-outline" size={20} color={viewMode === "list" ? "white" : "#3d2a71"} />
          <Text style={[styles.toggleText, viewMode === "list" && styles.activeToggleText]}>List View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toggleButton, viewMode === "map" && styles.activeToggle]}
          onPress={() => setViewMode("map")}
        >
          <Ionicons name="map-outline" size={20} color={viewMode === "map" ? "white" : "#3d2a71"} />
          <Text style={[styles.toggleText, viewMode === "map" && styles.activeToggleText]}>Map View</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content - List or Map */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3d2a71" />
        </View>
      ) : (
        viewMode === "list" ? (
          <FlatList
            data={stores}
            renderItem={renderStoreItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.storeList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="location-off-outline" size={60} color="#b1a9c6" />
                <Text style={styles.emptyText}>No stores found nearby</Text>
              </View>
            }
          />
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
            >
              {stores.map((store) => (
                <Marker
                  key={store.id}
                  coordinate={store.coordinates}
                  title={store.name}
                  description={store.address}
                  onPress={() => handleSelectStore(store)}
                >
                  <View style={[styles.markerContainer, selectedStore?.id === store.id && styles.selectedMarker]}>
                    <Ionicons name="location" size={24} color={selectedStore?.id === store.id ? "#3d2a71" : "#b1a9c6"} />
                  </View>
                </Marker>
              ))}
            </MapView>
            
            {selectedStore && (
              <View style={styles.selectedStoreInfo}>
                <View style={styles.selectedStoreDetails}>
                  <Text style={styles.selectedStoreName}>{selectedStore.name}</Text>
                  <Text style={styles.selectedStoreAddress}>{selectedStore.address}</Text>
                  <View style={styles.selectedStoreFooter}>
                    <View style={styles.selectedRatingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.selectedRatingText}>{selectedStore.rating}</Text>
                    </View>
                    <Text style={styles.selectedDistanceText}>{selectedStore.distance}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.selectedDirectionsButton}
                  onPress={() => navigation.navigate("Directions", { store: selectedStore })}
                >
                  <Ionicons name="navigate" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setViewMode(viewMode === "list" ? "map" : "list")}>
        <Ionicons name={viewMode === "list" ? "map" : "list"} size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#3d2a71",
    textAlign: "center",
    marginRight: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activeToggle: {
    backgroundColor: "#3d2a71",
  },
  toggleText: {
    fontSize: 14,
    marginLeft: 6,
    color: "#3d2a71",
  },
  activeToggleText: {
    color: "white",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  storeList: {
    padding: 16,
    paddingBottom: 80,
  },
  storeCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3d2a71",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBCD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: "600",
    color: "#333",
  },
  storeAddress: {
    color: "#666",
    marginBottom: 12,
    fontSize: 14,
  },
  storeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  sampleBadge: {
    backgroundColor: "#e8f4fd",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sampleText: {
    color: "#0078d4",
    fontSize: 12,
    fontWeight: "500",
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3d2a71",
    paddingVertical: 10,
    borderRadius: 8,
  },
  directionsText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectedMarker: {
    transform: [{scale: 1.2}],
  },
  selectedStoreInfo: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  selectedStoreDetails: {
    flex: 1,
    padding: 16,
  },
  selectedStoreName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3d2a71",
  },
  selectedStoreAddress: {
    color: "#666",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  selectedStoreFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  selectedRatingText: {
    marginLeft: 4,
    fontWeight: "600",
    fontSize: 13,
  },
  selectedDistanceText: {
    color: "#666",
    fontSize: 13,
  },
  selectedDirectionsButton: {
    backgroundColor: "#3d2a71",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#3d2a71",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default StoreLocatorScreen;