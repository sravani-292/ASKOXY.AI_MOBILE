import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ActionButton = ({ 
  icon, 
  label, 
  onPress, 
  color = '#6b7280',
  customStyle = 'default',
  iconSize = 20 
}) => {
  
  const getButtonStyle = () => {
    switch (customStyle) {
      case 'createImage':
        return {
          ...styles.button,
          ...styles.createImageButton,
        };
      case 'brainstorm':
        return {
          ...styles.button,
          ...styles.brainstormButton,
        };
      case 'getAdvice':
        return {
          ...styles.button,
          ...styles.getAdviceButton,
        };
      case 'code':
        return {
          ...styles.button,
          ...styles.codeButton,
        };
      default:
        return styles.button;
    }
  };

  const getTextColor = () => {
    switch (customStyle) {
      case 'createImage':
        return '#ffffff';
      case 'brainstorm':
        return '#ffffff';
      case 'getAdvice':
        return '#1e40af';
      case 'code':
        return '#ffffff';
      default:
        return color;
    }
  };

  const getIconColor = () => {
    switch (customStyle) {
      case 'createImage':
        return '#ffffff';
      case 'brainstorm':
        return '#ffffff';
      case 'getAdvice':
        return '#3b82f6';
      case 'code':
        return '#ffffff';
      default:
        return color;
    }
  };

  const renderButton = () => {
    if (customStyle === 'createImage') {
      return (
        <View style={styles.gradientContainer}>
          <View style={styles.createImageGradient}>
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={iconSize} color={getIconColor()} />
            </View>
            <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
          </View>
        </View>
      );
    }

    if (customStyle === 'brainstorm') {
      return (
        <View style={styles.gradientContainer}>
          <View style={styles.brainstormGradient}>
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={iconSize} color={getIconColor()} />
            </View>
            <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
          </View>
        </View>
      );
    }

    return (
      <>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={iconSize} color={getIconColor()} style={styles.icon} />
        </View>
        <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
      </>
    );
  };

  return (
    <TouchableOpacity style={getButtonStyle()} onPress={onPress}>
      {renderButton()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginHorizontal: 4,
    marginVertical: 4,
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createImageButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 4,
    shadowOpacity: 0.2,
  },
  brainstormButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 4,
    shadowOpacity: 0.2,
  },
  getAdviceButton: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
    borderWidth: 2,
  },
  codeButton: {
    backgroundColor: '#7c3aed',
    borderWidth: 0,
    elevation: 3,
    shadowOpacity: 0.15,
  },
  gradientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  createImageGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#10a37f',
    background: 'linear-gradient(135deg, #10a37f 0%, #059669 50%, #047857 100%)',
  },
  brainstormGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#f97316',
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
  },
  iconContainer: {
    marginRight: 8,
    padding: 2,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default ActionButton;