import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
const{height,width}=Dimensions.get('window')
const Explore = ({navigation}) => {
  const data = ["University", "Course", "Visa"];

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={()=>navigation.navigate('University Gpt')}>
        <Text style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore GPTs</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    // flex: 1,
    margin: 8,
    padding: 16,
      backgroundColor: "#3d2a71",
    width:width*0.4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
    itemText: {
      color:"white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
