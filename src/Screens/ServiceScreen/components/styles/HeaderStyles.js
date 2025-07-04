// components/styles/HeaderStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#4A148C",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: "contain",
    tintColor: "#FFFFFF",
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  authButtonText: {
    marginLeft: 6,
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
