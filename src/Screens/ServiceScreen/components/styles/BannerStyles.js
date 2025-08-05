// components/styles/BannerStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  bannerContainer: {
    position: "relative",
    marginTop:3,
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 16,
    // marginHorizontal: 8,
  },
  bannerImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  bannerImage: {
    width: "96%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -4,
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
    width: 25,
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
