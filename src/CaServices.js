import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import BASE_URL from "../Config";
const CITY_CLASSIFICATIONS =  {
  "ANDAMAN & NICOBAR ISLANDS": { A: [], B: [], C: ["All cities"] },
};

export default function CaServices() {
  // Core state
  const [allData, setAllData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [filteredAgreements, setFilteredAgreements] = useState([]);

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [interestLoading, setInterestLoading] = useState({}); // Track loading per agreement

  // Filter states
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityClass, setSelectedCityClass] = useState(null);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
const [userInterests, setUserInterests] = useState(new Set());
  // Navigation states
  const [currentView, setCurrentView] = useState("CATEGORIES");

  // Redux state
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;

  // Fetch all data initially
  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter agreements when filters change
  useEffect(() => {
    filterAgreements();
  }, [agreements, selectedCityClass]);

  const fetchAllData = async () => {
    try {
      setInitialLoading(true);
      const response = await axios.get(
        BASE_URL+"product-service/getAllAgreements"
      );

      // Filter data to only include CA SERVICE items
      const caServiceData = response.data.filter(
        (item) => item.cacsType?.toLowerCase() === "ca service"
      );

      setAllData(caServiceData);

      // Extract unique categories from filtered data
      const uniqueCategories = new Map();
      caServiceData.forEach((item) => {
        if (!uniqueCategories.has(item.cacsName)) {
          uniqueCategories.set(item.cacsName, {
            name: item.cacsName,
            entityId: item.caCsEntityId,
            hasSubCategories: false,
          });
        }
      });

      // Check if categories have subcategories
      const categoriesArray = Array.from(uniqueCategories.values()).map(
        (category) => {
          const categoryItems = caServiceData.filter(
            (item) => item.cacsName === category.name
          );
          const hasNonEmptySubTypes = categoryItems.some(
            (item) =>
              item.categorySubType &&
              item.categorySubType.trim() !== "" &&
              item.categorySubType.trim() !== " "
          );

          return {
            ...category,
            hasSubCategories: hasNonEmptySubTypes,
          };
        }
      );

      setCategories(categoriesArray);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);

    // Get items for this category
    const categoryItems = allData.filter(
      (item) => item.cacsName === category.name
    );

    if (category.hasSubCategories) {
      // Extract unique subcategories
      const uniqueSubCategories = [
        ...new Set(
          categoryItems
            .filter(
              (item) =>
                item.categorySubType &&
                item.categorySubType.trim() !== "" &&
                item.categorySubType.trim() !== " "
            )
            .map((item) => item.categorySubType.trim())
        ),
      ];

      setSubCategories(uniqueSubCategories);
      setCurrentView("SUBCATEGORIES");
    } else {
      // Show agreements directly
      setAgreements(categoryItems);
      setCurrentView("AGREEMENTS");
    }

    // Reset filters
    resetFilters();
  };

  const handleSubCategoryPress = (subCategory) => {
    setSelectedSubCategory(subCategory);

    // Get agreements for this subcategory
    const subCategoryItems = allData.filter(
      (item) =>
        item.cacsName === selectedCategory.name &&
        item.categorySubType &&
        item.categorySubType.trim() === subCategory
    );

    setAgreements(subCategoryItems);
    setCurrentView("AGREEMENTS");

    // Reset filters
    resetFilters();
  };

  const filterAgreements = () => {
    setFilteredAgreements(agreements);
  };

  const resetFilters = () => {
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedCityClass(null);
  };

  const handleBackNavigation = () => {
    if (currentView === "AGREEMENTS") {
      if (selectedCategory.hasSubCategories) {
        setCurrentView("SUBCATEGORIES");
        setSelectedSubCategory(null);
      } else {
        setCurrentView("CATEGORIES");
        setSelectedCategory(null);
      }
    } else if (currentView === "SUBCATEGORIES") {
      setCurrentView("CATEGORIES");
      setSelectedCategory(null);
      setSubCategories([]);
    }

    setAgreements([]);
    setFilteredAgreements([]);
    resetFilters();
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setSelectedCity(null);
    setSelectedCityClass(null);
    setShowStateModal(false);
    setShowCityModal(true); // Auto-open city modal
  };

  const handleCitySelect = (city, cityClass) => {
    setSelectedCity(city);
    setSelectedCityClass(cityClass);
    setShowCityModal(false);
  };

  const getAvailableCities = () => {
    if (!selectedState || !CITY_CLASSIFICATIONS[selectedState]) return [];

    const stateData = CITY_CLASSIFICATIONS[selectedState];
    const cities = [];

    Object.keys(stateData).forEach((cityClass) => {
      stateData[cityClass].forEach((city) => {
        cities.push({ name: city, class: cityClass });
      });
    });

    return cities;
  };

  const clearFilters = () => {
    resetFilters();
  };

  const getCurrentTitle = () => {
    if (currentView === "CATEGORIES") {
      return "OUR CHARTERED ACCOUNTANT SERVICES";
    } else if (currentView === "SUBCATEGORIES") {
      return selectedCategory.name;
    } else if (currentView === "AGREEMENTS") {
      if (selectedSubCategory) {
        return selectedSubCategory;
      } else {
        return selectedCategory.name;
      }
    }
    return "Services";
  };

  // Function to get price based on city tier
  const getPriceForCityTier = (agreement) => {
    if (!selectedCityClass) return null;

    // Get price based on city tier
    switch (selectedCityClass) {
      case "A":
        return agreement.priceA || agreement.price;
      case "B":
        return agreement.priceB || agreement.price;
      case "C":
        return agreement.priceC || agreement.price;
      default:
        return agreement.price;
    }
  };

  // Function to format price
  const formatPrice = (price) => {
    if (!price) return "Contact for pricing";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  // Function to handle interest API call
 const handleShowInterest = async (agreement) => {
  if (!customerId || !token) {
    Alert.alert("Error", "Please login to show interest in services.");
    return;
  }

  try {
    setInterestLoading(prev => ({ ...prev, [agreement.id]: true }));

    const payload = {
      cacsAggrementId: agreement.id,
      userId: customerId,
    };

    const response = await axios.post(
      BASE_URL+"product-service/cacsinterested",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Interest registered successfully:", response.data);

    // Check if response is successful
    if (response.data && response.data.id) {
      Alert.alert(
        "Success",
        "Your interest has been recorded successfully! We will contact you soon.",
        [{ text: "OK", style: "default" }]
      );
    } else {
      throw new Error("Invalid response from server");
    }

  } catch (error) {
    console.error("Error showing interest:", error);
    
    let errorMessage = "Failed to record your interest. Please try again.";
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        errorMessage = "Please login again to show interest.";
      } else if (status === 409) {
        errorMessage = "You have already shown interest in this service.";
      } else if (status === 400) {
        errorMessage = "Invalid request. Please try again.";
      } else if (status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (data && data.message) {
        errorMessage = data.message;
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Network error. Please check your connection and try again.";
    } else if (error.message) {
      // Something else happened
      errorMessage = error.message;
    }
    
    Alert.alert("Error", errorMessage);
    
  } finally {
    setInterestLoading(prev => ({ ...prev, [agreement.id]: false }));
  }
};

  // Show initial loading
  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {currentView !== "CATEGORIES" && (
            <TouchableOpacity
              onPress={handleBackNavigation}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          )}
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{getCurrentTitle()}</Text>
            {currentView !== "CATEGORIES" && (
              <Text style={styles.breadcrumb}>
                {selectedCategory.name}
                {selectedSubCategory && ` > ${selectedSubCategory}`}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Location Selection Bar - Show only in agreements view */}
      {currentView === "AGREEMENTS" && (
        <View style={styles.locationBar}>
          <View style={styles.locationContent}>
            <Text style={styles.locationLabel}>
              Select Location for Pricing:
            </Text>
            <View style={styles.locationSelectors}>
              <TouchableOpacity
                style={[
                  styles.locationSelector,
                  selectedState && styles.locationSelectorActive,
                ]}
                onPress={() => setShowStateModal(true)}
              >
                <Text
                  style={[
                    styles.locationSelectorText,
                    selectedState && styles.locationSelectorTextActive,
                  ]}
                >
                  {selectedState || "Select State"}
                </Text>
                <Text style={styles.locationArrow}>▼</Text>
              </TouchableOpacity>

              {selectedState && (
                <TouchableOpacity
                  style={[
                    styles.locationSelector,
                    selectedCity && styles.locationSelectorActive,
                  ]}
                  onPress={() => setShowCityModal(true)}
                >
                  <Text
                    style={[
                      styles.locationSelectorText,
                      selectedCity && styles.locationSelectorTextActive,
                    ]}
                  >
                    {selectedCity || "Select City"}
                  </Text>
                  <Text style={styles.locationArrow}>▼</Text>
                </TouchableOpacity>
              )}
            </View>

            {(selectedState || selectedCity) && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearFiltersText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Categories View */}
      {currentView === "CATEGORIES" && (
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              Choose a service category to get started
            </Text>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryCardContent}>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  {category.hasSubCategories && (
                    <View style={styles.subCategoryBadge}>
                      {/* <Text style={styles.subCategoryBadgeText}>
                        Multiple Services
                      </Text> */}
                    </View>
                  )}
                  <View style={styles.circleArrow}>
                    <Text style={styles.arrowText}>{'>'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Subcategories View */}
      {currentView === "SUBCATEGORIES" && (
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              Select a specific service type
            </Text>
          </View>

          <View style={styles.subCategoriesGrid}>
            {subCategories.map((subCategory, index) => (
              <TouchableOpacity
                key={index}
                style={styles.subCategoryCard}
                onPress={() => handleSubCategoryPress(subCategory)}
                activeOpacity={0.7}
              >
                <View style={styles.subCategoryCardContent}>
                  <Text style={styles.subCategoryTitle}>{subCategory}</Text>
                  <View style={styles.circleArrow}>
                    <Text style={styles.arrowText}>{'>'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Agreements View */}
     {currentView === "AGREEMENTS" && (
        <View style={styles.content}>
          {/* Service Selection Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Available Services</Text>
            <Text style={styles.infoText}>
              {selectedCity
                ? `Showing prices for ${selectedCity}, ${selectedState}. Tap on any service to show your interest.`
                : "Select your location above to view pricing. Tap on any service to show your interest."}
            </Text>
          </View>

          {/* Agreements List */}
          <View style={styles.agreementsList}>
            {filteredAgreements.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No services found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Please try again later
                </Text>
              </View>
            ) : (
              filteredAgreements.map((agreement, index) => (
                <View
                  key={agreement.id || index}
                  style={styles.agreementCard}
                >
                  <View style={styles.agreementHeader}>
                    <View style={styles.agreementTitleRow}>
                      <Text style={styles.agreementTitle}>
                        {agreement.agreementName}
                      </Text>
                      {selectedCity && (
                        <View style={styles.priceContainer}>
                          <Text style={styles.priceText}>
                            {formatPrice(getPriceForCityTier(agreement))}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {agreement.agreementDescription && (
                    <View style={styles.agreementDescription}>
                      <Text style={styles.agreementDescriptionText}>
                        {agreement.agreementDescription}
                      </Text>
                    </View>
                  )}

                  <View style={styles.contactSection}>
                    <View style={styles.interestButton}>
                      <TouchableOpacity
                        onPress={() => handleShowInterest(agreement)}
                        activeOpacity={0.8}
                        disabled={interestLoading[agreement.id]}
                      >
                        <Text style={styles.interestButtonText}>
                          {interestLoading[agreement.id] ? (
                            <>
                              <ActivityIndicator size="small" color="#059669" style={{ marginRight: 8 }} />
                              Processing...
                            </>
                          ) : (
                            <>
                              <MaterialIcons name="favorite" size={16} color="#059669" />
                              {" "}Show Interest
                            </>
                          )}
                        </Text>
                        <Text style={styles.interestButtonSubtext}>
                          {selectedCity
                            ? "Get contacted with pricing details"
                            : "Get pricing and details"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.contactArrow}
                      onPress={() => handleShowInterest(agreement)}
                      activeOpacity={0.8}
                      disabled={interestLoading[agreement.id]}
                    >
                      <MaterialIcons name="message" size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      )}

      {/* State Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showStateModal}
        onRequestClose={() => setShowStateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State/UT</Text>
              <TouchableOpacity
                onPress={() => setShowStateModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={Object.keys(CITY_CLASSIFICATIONS).sort()}
              keyExtractor={(item) => item}
              style={styles.modalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedState === item && styles.modalItemActive,
                  ]}
                  onPress={() => handleStateSelect(item)}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedState === item && styles.modalItemTextActive,
                    ]}
                  >
                    {item}  
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* City Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCityModal}
        onRequestClose={() => setShowCityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select City in {selectedState}
              </Text>
              <TouchableOpacity
                onPress={() => setShowCityModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={getAvailableCities()}
              keyExtractor={(item) => `${item.name}-${item.class}`}
              style={styles.modalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedCity === item.name && styles.modalItemActive,
                  ]}
                  onPress={() => handleCitySelect(item.name, item.class)}
                >
                  <View style={styles.cityItemContent}>
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedCity === item.name &&
                          styles.modalItemTextActive,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={[
                        styles.tierBadge,
                        styles[`tierBadge${item.class}`],
                      ]}
                    >
                      <Text style={styles.tierBadgeText}>
                        Tier {item.class}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  // Loading - CLEAN & MODERN
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },

  // Header - PROFESSIONAL & CLEAN
  header: {
    backgroundColor: "#ffdab9",
    paddingTop: 25,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    minHeight: 50,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  backButtonText: {
    fontSize: 18,
    color: "#374151",
    fontWeight: "500",
  },

  headerTitleContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6b249c",
    marginBottom: 2,
    alignSelf: "center",
    textAlign: "center",
  },

  breadcrumb: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "400",
    textAlign: "left",
    alignSelf: "center",
    opacity: 0.9,
  },

  // Location Bar - REFINED & ELEGANT
  locationBar: {
    backgroundColor: "#fafbfc",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  locationContent: {
    gap: 12,
  },

  locationLabel: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
    marginBottom: 10,
  },

  locationSelectors: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },

  locationSelector: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },

  locationSelectorActive: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    shadowColor: "#f59e0b",
    shadowOpacity: 0.1,
  },

  locationSelectorText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },

  locationSelectorTextActive: {
    color: "#d97706",
    fontWeight: "600",
  },

  locationArrow: {
    fontSize: 12,
    color: "#9ca3af",
  },

  clearFiltersButton: {
    backgroundColor: "#fff7ed",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#f59e0b",
    alignSelf: "flex-start",
  },

  clearFiltersText: {
    fontSize: 12,
    color: "#d97706",
    fontWeight: "600",
  },

  // Content - SPACIOUS & ORGANIZED
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  welcomeSection: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },

  welcomeText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400",
  },

  // Info Section - CLEAR & INFORMATIVE
  infoSection: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#b2beb5",
    borderLeftWidth: 4,
    borderLeftColor: "#696969",
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 22,
    fontWeight: "400",
  },

  // Categories - MODERN CARD DESIGN
  categoriesGrid: {
    gap: 16,
  },

  categoryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 0,
  },

  categoryCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
    marginRight: 16,
    letterSpacing: 0.2,
  },

//   subCategoryBadge: {
//     backgroundColor: "#fef3c7",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 12,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: "#f59e0b",
//   },

  subCategoryBadgeText: {
    fontSize: 10,
    color: "#b91c1c",
    fontWeight: "700",
    backgroundColor: "#fee2e2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    textAlign: "center",
  },

  categoryArrow: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
  },

  arrowText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "700",
  },

  // Subcategories - REFINED DESIGN
  subCategoriesGrid: {
    gap: 12,
    paddingHorizontal: 4,
  },

  subCategoryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderLeftWidth: 3,
    borderLeftColor: "#06b6d4",
  },

  subCategoryCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  subCategoryTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1e293b",
    flex: 1,
    lineHeight: 20,
  },

  subCategoryArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#64748b",
    justifyContent: "center",
    alignItems: "center",
  },

  // Agreements - PROFESSIONAL LAYOUT
  agreementsList: {
    gap: 16,
    paddingBottom: 24,
    paddingHorizontal: 4,
  },

  agreementCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },

  agreementHeader: {
    backgroundColor: "#ffffff",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  agreementTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  agreementTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 24,
    flex: 1,
    marginRight: 16,
  },

  priceContainer: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

  priceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d4ed8",
    textAlign: "center",
  },

  agreementDescription: {
    backgroundColor: "#f8fafc",
    margin: 20,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },

  agreementDescriptionText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    fontWeight: "400",
  },

  contactSection: {
    backgroundColor: "#ecfdf5",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  whatsappButton: {
    flex: 1,
  },

  whatsappButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#059669",
    marginBottom: 4,
  },

  whatsappButtonSubtext: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "400",
  },

  contactArrow: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f59e0b",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Agreement Header - CLEAR HIERARCHY
  agreementHeader: {
    backgroundColor: "#ffffff",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  agreementTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  agreementTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 24,
    flex: 1,
    marginRight: 16,
  },
  // Price Section - ELEGANT DISPLAY
  priceContainer: {
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0ea5e9",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  priceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0369a1",
    textAlign: "center",
  },

  // Description Section - READABLE & CLEAN
  agreementDescription: {
    backgroundColor: "#f8fafc",
    margin: 20,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#64748b",
  },

  agreementDescriptionText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    fontWeight: "400",
  },

  // Contact Section - INVITING & CLEAR
  contactSection: {
    backgroundColor: "#f0fdf4",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  whatsappButton: {
    flex: 1,
  },

  whatsappButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 4,
  },

  whatsappButtonSubtext: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "400",
  },

  contactArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffae42",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    shadowColor: "#ffae42",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Empty State - FRIENDLY & CLEAR
 emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },

  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
    textAlign: "center",
  },

  emptyStateSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },

  // Modals - MODERN & ACCESSIBLE
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCloseText: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "600",
  },

  modalList: {
    maxHeight: 400,
  },

  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  modalItemActive: {
    backgroundColor: "#f0f9ff",
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },

  modalItemText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },

  modalItemTextActive: {
    color: "#1d4ed8",
    fontWeight: "600",
  },

  cityItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },

  tierBadgeA: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#f59e0b",
  },

  tierBadgeB: {
    backgroundColor: "#dbeafe",
    borderWidth: 1,
    borderColor: "#3b82f6",
  },

  tierBadgeC: {
    backgroundColor: "#d1fae5",
    borderWidth: 1,
    borderColor: "#10b981",
  },
  circleArrow: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: '#ffffffff',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2, // for Android
},

arrowText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#26a247ff', //  '#174c85ff'
},

  tierBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#374151",
  },
});
