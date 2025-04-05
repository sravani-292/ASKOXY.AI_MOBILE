import { Alert } from 'react-native';

export const createErrorHandler = (customErrorMessages = {}) => {
  const defaultErrorMessages = {
    400: 'Invalid Request: Please check your input',
    401: 'Authentication Failed: Please log in again',
    403: 'Forbidden: You do not have permission',
    404: 'Not Found: The requested resource does not exist',
    500: 'Server Error: Please try again later',
    default: 'An unexpected error occurred'
  };

  const errorMessages = { ...defaultErrorMessages, ...customErrorMessages };

  return (error) => {
    // Log full error for debugging
    console.error('API Error Details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Determine error message
    const status = error.response?.status;
    const errorMessage = errorMessages[status] || errorMessages.default;

    // Show user-friendly error alert
    Alert.alert(
      'Error', 
      errorMessage,
      [{ text: 'OK', style: 'cancel' }]
    );

    // Additional error handling logic
    switch(status) {
      case 401:
        // Logout user or refresh token
        // NavigationService.navigate('Login');
        break;
      case 403:
        // Handle permission denied
        break;
      case 500:
        // Log error to monitoring service
        break;
    }

    // Rethrow to allow further error handling
    throw error;
  };
};