import FreeAIAndGenAI from "./FreeAIAndGenAI";
import LegalService from "./LegalService";
import Machines from "./Machines";
import MyRotary from "./MyRotary";
import Rudraksha from "./Rudraksha";
import Rice from "../ShoppingCart/Rice1";
import commonScreenOptions from "../../../Navigations/commonScreenOptions";
import { createStackNavigator } from "@react-navigation/stack";
export default function DashboardStack() {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      initialRouteName="Legal Services"
      screenOptions={commonScreenOptions}
    >
      <stack.Screen name="Free AI And GenAI" component={FreeAIAndGenAI} />
      <stack.Screen name="LegalService" component={LegalService} />
      <stack.Screen name="Rice" component={Rice} />
      <stack.Screen name="My Rotary" component={MyRotary} />
      <stack.Screen name="Free Rudraksha" component={Rudraksha} />
    </stack.Navigator>
  );
}
