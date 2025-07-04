import { StyleSheet } from "react-native";

export default StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  tab: {
    flex: 1,
    borderRadius: 6,
    marginHorizontal: 2,
    overflow: 'hidden', // Important for gradient borders
    minHeight: 44, // Ensure minimum touchable area
  },
  tabActiveGradient: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    flex: 1, // Added to ensure full height
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabInactive: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    flex: 1, // Added to ensure full height
  },
  tabFirst: {
    marginLeft: 0,
  },
  tabLast: {
    marginRight: 0,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center', // Ensure text is centered
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center', // Ensure text is centered
  },
});