// components/styles/ServiceListStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(74, 20, 140, 0.08)",
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A148C",
  },
  servicesGridContent: {
    paddingVertical: 8,
  },
  serviceItem: {
    alignItems: "center",
    marginRight: 12,
    marginBottom: 16,
    width: 100,
  },
  serviceIconContainer: {
    width: "85%",
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(74, 20, 140, 0.1)",
  },
  serviceImage: {
    width: "75%",
    height: "80%",
    resizeMode: "contain",
  },
  serviceName: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    color: "#424242",
    fontWeight: "500",
    height: 32,
  },
});
