// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import AdminTabNavigator from './navigation/AdminTabNavigator';

import LoginScreen from './screens/LoginScreen';
 import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AdminScreen from './screens/AdminScreen';
import CourseEditScreen from './screens/admin/CourseEditScreen'; 
// Importa tu archivo de servicio para verificar el token
import { getToken } from './services/AuthService'; 

const Stack = createStackNavigator();




export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Register" // Nueva ruta
                    component={RegisterScreen} 
                    options={{ title: 'Crear Cuenta' }} 
                />
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{ title: 'EduLingo Principal' }}
                />
                <Stack.Screen 
                    name="AdminPanel" 
                    component={AdminTabNavigator} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="CourseEdit" 
                    component={CourseEditScreen} 
                    options={{ title: 'Editar Módulo' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
