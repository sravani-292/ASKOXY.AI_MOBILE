// components/ServiceList.js
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./styles/ServiceListStyles";

const ServiceList = ({ services = [], onPress = () => {} }) => {
  const renderItem = ({ item }) => {
    if (!item) return null;

    return (
      <TouchableOpacity
        style={styles.serviceItem}
        onPress={() => onPress(item)}
      >
        <View style={styles.serviceIconContainer}>
          {item.image ? (
            <Image source={item.image} style={styles.serviceImage} />
          ) : item.imageUrls && item.imageUrls[0]?.imageUrl ? (
            <Image
              source={{ uri: item.imageUrls[0].imageUrl }}
              style={styles.serviceImage}
              defaultSource={require("../../../../assets/icon.png")}
            />
          ) : (
            <Image
              source={require("../../../../assets/icon.png")}
              style={styles.serviceImage}
            />
          )}
        </View>
        <Text numberOfLines={2} style={styles.serviceName}>
          {item.name || item.campaignType || "Service"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="chevron-right" size={18} color="#4A148C" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        horizontal
        keyExtractor={(item, index) => item?.id || `service-${index}`}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.servicesGridContent}
      />
    </View>
  );
};

export default ServiceList;
