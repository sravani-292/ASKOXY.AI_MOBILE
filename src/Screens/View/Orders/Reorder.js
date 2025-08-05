import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import {
  handleUserAddorIncrementCart,
} from "../../../ApiService";
import { useNavigation } from '@react-navigation/native';

const useReorder = () => {
    console.log("into the reorder hook");
    
  const userData = useSelector((state) => state.counter);
  const customerId = userData.userId;
  const navigation = useNavigation();

  const handleReorder = async (orderItems) => {
    try {
      for (const item of orderItems) {
        // Pass customerId and itemId properly
        await handleUserAddorIncrementCart({ customerId, itemId: item.itemId });
      }

      Alert.alert('Success', 'All items added to cart!');
    navigation.navigate("Home", { screen: "My Cart" });
    } catch (error) {
      Alert.alert('Error', 'Failed to add items to cart. Please try again.');
      console.error('Reorder error:', error);
    }
  };

  return { handleReorder };
};

export default useReorder;
