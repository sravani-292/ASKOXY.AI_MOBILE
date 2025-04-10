import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import BASE_URL from "../../../../Config";

const { width } = Dimensions.get("window");

const LegalService = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../../assets/legalservice.png")} 
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome, Lawyers and Advocates!</Text>
        <Text style={styles.subtitle}>2X Your Revenue with AskOxy.ai</Text>

        <View style={styles.bulletContainer}>
          <Text style={styles.bulletText}>
            <Text style={styles.bulletHeading}>• Grow Your Client Base:</Text> Connect with users actively seeking legal guidance and cases.
          </Text>
          <Text style={styles.bulletText}>
            <Text style={styles.bulletHeading}>• 2X Your Revenue:</Text> Maximize your earning potential through increased visibility and more cases.
          </Text>
          <Text style={styles.bulletText}>
            <Text style={styles.bulletHeading}>• Share Expertise:</Text> Publish legal insights to educate and establish your authority.
          </Text>
          <Text style={styles.bulletText}>
            <Text style={styles.bulletHeading}>• Collaborate on Legal Publications:</Text> Partner with professionals to create impactful content.
          </Text>
          <Text style={styles.bulletText}>
            <Text style={styles.bulletHeading}>• Expand Your Network:</Text> Be part of a vibrant, trusted platform for lawyers and advocates.
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>I'm Interested</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  bannerImage: {
    width: width * 0.9,
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
  },
  textContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#6c63ff",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  bulletContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  bulletText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 15,
    lineHeight: 22,
  },
  bulletHeading: {
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#6c63ff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#6c63ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LegalService;
