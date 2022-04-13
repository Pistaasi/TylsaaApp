import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons} from '@expo/vector-icons';  
import Homepage from './Homepage';
import Points from "./Points";

const Tab = createBottomTabNavigator();

export default function TabsNav(){
    
    return (
        <Tab.Navigator
        screenOptions={({route }) => ({ 
        tabBarIcon: ({ focused, color, size }) => {             
                
            let iconName;            
            if (route.name === 'Home') {             
                iconName = 'md-home';            
            } else if (route.name === 'Points') {
                iconName = 'md-map';            
            }
            return <Ionicons name={iconName}size={size}color={color} />;   
                
        },
        headerShown: false         
        })}>
            <Tab.Screen name="Home" component={Homepage} />
            <Tab.Screen name="Points" component={Points} />
        </Tab.Navigator>
      );
}