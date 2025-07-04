// components/styles/BannerStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  bannerContainer: {
    position: "relative",
    marginTop: 16,
    alignItems: "center",
    borderRadius: 16,
  },
  bannerImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  bannerImage: {
    width: "94%",
    borderRadius: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -15,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#4A148C",
    width: 20,
  },
  inactiveDot: {
    backgroundColor: "rgba(74, 20, 140, 0.3)",
  },
  bannerLoadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
