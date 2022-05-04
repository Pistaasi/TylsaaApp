import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons} from '@expo/vector-icons';  
import Homepage from './Homepage';
import Points from "./Points";
import {View} from "react-native";

const Tab = createBottomTabNavigator();

export default function TabsNav(){
    
    return (
        <Tab.Navigator
        screenOptions={({route }) => ({ 
        tabBarIcon: ({ focused, color, size }) => {             
                
            let iconName;            
            if (route.name === 'Home') {             
                iconName = 'happy-outline';            
            } else if (route.name === 'Points') {
                iconName = 'gift-outline';            
            }
            return <Ionicons name={iconName}size={size}color={color} />;   
                
        },

        tabBarStyle: {
            backgroundColor: "#333C83"
        },
        tabBarActiveTintColor: "#F24A72", 
        tabBarInactiveTintColor: "#EAEA7F",
        headerShown: false         
        })}>
            <Tab.Screen name="Home" component={Homepage} />
            <Tab.Screen name="Points" component={Points} />
        </Tab.Navigator>
      );
}