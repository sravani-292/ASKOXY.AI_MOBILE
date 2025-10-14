import { StyleSheet,Dimensions } from 'react-native';
const {height,width}=Dimensions.get('window')




export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    padding: 8,
  },
  logo: {
    height: 48,
    width: 120,
  },
  navButtons: {
    flexDirection: 'row',
    display: { xs: 'none', md: 'flex' }, // Note: React Native doesn't support media queries; use Dimensions or other logic if needed
  },
  navButton: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  interestedButton: {
    backgroundColor: '#dcfce7',
  },
  navButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '500',
  },
  mobileMenuToggle: {
    padding: 8,
    display: { md: 'none' }, // Note: React Native doesn't support media queries
  },
  mobileMenu: {
    paddingVertical: 16,
    flexDirection: 'column',
    display: { md: 'none' }, // Note: React Native doesn't support media queries
  },
  mobileNavButton: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  section: {
    alignItems: 'center',
    marginBottom: 48,
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    color: '#4b5563',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 672,
  },
  bold: {
    fontWeight: 'bold',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '100%', // Adjust based on screen size if needed
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#4b5563',
    fontSize: 14,
    marginBottom: 24,
  },
  cardButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardButton: {
    flex: 1,
    backgroundColor: '#e0e7ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  systemButton: {
    backgroundColor: '#dcfce7',
    marginRight: 0,
  },
  cardButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
  },
  // Existing styles from previous files
  content: {},
  section: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  paragraph: {
    color: '#4b5563',
    fontSize: 16,
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'column',
  },
  subSection: {
    marginBottom: 24,
  },
  list: {},
  listItem: {
    color: '#4b5563',
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  h3: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
   openButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    width:width*0.4,
    alignItems: 'center',
    alignSelf:"flex-end",
    marginBottom:10
  },
  openButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});