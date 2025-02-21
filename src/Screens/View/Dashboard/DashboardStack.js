import FreeAIAndGenAI from "./FreeAIAndGenAI";
import LegalService from "./LegalService";
import Machines from "./Machines";
import MyRotary from "./MyRotary";
import Rudraksha from "./Rudraksha";
import Rice from "../ShoppingCart/Rice";
import FreeContainer from "../../../Screens/View/Dashboard/FreeContainer"
import commonScreenOptions from "../../../Navigations/commonScreenOptions";
import AbroadCategories from "./AbroadCategories";
import { createStackNavigator } from "@react-navigation/stack";
import Explore from "../../../Screens/View/Dashboard/ExploreGpts/Explore"
import GPT from "../../../Screens/View/Dashboard/ExploreGpts/GPT";
import UniversityGpt from "../../View/Dashboard/ExploreGpts/UniversityGpt";
export default function DashboardStack() {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      initialRouteName="LEGAL SERVICE"
      screenOptions={commonScreenOptions}
    >
      <stack.Screen name="FREE RUDRAKSHA" component={Rudraksha} />
      <stack.Screen name="FREE AI & GEN AI" component={FreeAIAndGenAI} />
       <stack.Screen name="LEGAL SERVICE" component={LegalService} />
      <stack.Screen name="Rice" component={Rice} />
      <stack.Screen name="MY ROTARY " component={MyRotary} />
      <stack.Screen name="FREE CONTAINER" component={Rice} />
      <stack.Screen name="STUDY ABROAD" component={AbroadCategories} />
      {/* <stack.Screen name="Explore Gpts" componet={Explore}/>
      <stack.Screen name="University Gpts" componet={UniversityGpt}/>
      <stack.Screen name="GPT" component={GPT}/> */}
    </stack.Navigator>
  );
}
