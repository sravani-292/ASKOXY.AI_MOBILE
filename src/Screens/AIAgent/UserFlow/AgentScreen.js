import { Text, View, TextInput, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import FileUpload from './FileUpload';
import ImageUpload from './ImageUpload';
const AgentScreen = () => {
  const navigation = useNavigation();
  const assistantId = "nbhbgbbbbb"
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Agent</Text>
        <Text style={styles.subtitle}>Upload documents to enhance your agent</Text>
      </View>
      
      <View style={styles.uploadSection}>
        {/* <FileUpload assistantId={assistantId} /> */}
        <ImageUpload assistantId={assistantId} />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Agent ID: {assistantId}</Text>
      </View>
    </View>
  )
}

export default AgentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
  uploadSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6c757d',
    fontFamily: 'monospace',
  },
});