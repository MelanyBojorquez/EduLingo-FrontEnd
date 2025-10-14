import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; 
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import StudentListScreen from '../screens/admin/StudentListScreen';
import ModuleCreationScreen from '../screens/admin/ModuleCreationScreen'; 
import ModulesScreen from '../screens/admin/ModulesScreen'; 

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="AdminHome"
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#5E35B1', 
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'AdminHome') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'StudentList') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'ModuleCreation') { 
                        iconName = focused ? 'add-circle' : 'add-circle-outline'; 
                    } else if (route.name === 'Modules') {
                        iconName = focused ? 'library' : 'library-outline'; 
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Inicio' }} />
            <Tab.Screen name="StudentList" component={StudentListScreen} options={{ title: 'Alumnos' }} />
            <Tab.Screen name="ModuleCreation" component={ModuleCreationScreen} options={{ title: 'Crear Módulo' }} />
            <Tab.Screen name="Modules" component={ModulesScreen} options={{ title: 'Módulos' }} />
        </Tab.Navigator>
    );
};

export default AdminTabNavigator;