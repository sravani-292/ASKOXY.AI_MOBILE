import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  main: {
    flex: 1,
  },
  header: {
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 16,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
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
  bold: {
    fontWeight: 'bold',
  },
});