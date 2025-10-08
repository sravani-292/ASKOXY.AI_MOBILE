import { StyleSheet, Text, View, Image, Dimensions,TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
import { COLORS } from '../../../../Redux/constants/theme';
const AIRoleImage = ({ style, containerStyle }) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, containerStyle, style]}>
        <Image
          source={{ uri: 'https://www.askoxy.ai/static/media/ca3.4e7e85ad9253663f7680.png' }} 
        style={styles.image} 
      />
    </View>
  )
}

export default AIRoleImage

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    minHeight: height /10,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    elevation: 8,
  },
  image: {
    width: width * 0.8,
    height: 80,
    borderRadius: 50,
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  }
})