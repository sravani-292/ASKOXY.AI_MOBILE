// components/SubCategoryList.js
import React from "react";
import { View, FlatList, TouchableOpacity, Image, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./styles/SubCategoryListStyles";
import { useNavigation } from "@react-navigation/native";

const SubCategoryList = ({ selectedCategory }) => {
  const navigation = useNavigation();

  if (!selectedCategory) return null;

  if (!selectedCategory?.categories || selectedCategory.categories.length === 0) {
  return (
    <View style={{ padding: 20, alignItems: "center" }}>
      <Text>No categories available.</Text>
    </View>
  );
}

  return (
    <FlatList
      data={selectedCategory.categories}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("Rice Products", {
              screen: "Rice Products",
              category: item.categoryName,
              categoryType: selectedCategory.categoryType,
            })
          }
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item.categoryLogo }}
              style={styles.image}
              defaultSource={require("../../../../assets/icon.png")}
            />
            {/* {item.categoryName.match(/^Cashew\s*nuts?/i) && (
              <View style={styles.cashbackTag}>
                <Text style={styles.cashbackText}>upto ₹40</Text>
                <Text style={styles.cashbackSubText}>Cashback</Text>
              </View>
            )} */}
          </View>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {item.categoryName}
            </Text>
            {/* <View style={styles.browseBtn}>
              <Text style={styles.browseText}>Browse Collection</Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={14}
                color="#FFFFFF"
              />
            </View> */}
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default SubCategoryList;
