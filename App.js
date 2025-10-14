import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Navegadores de pestañas
import AdminTabNavigator from './navigation/AdminTabNavigator';
import StudentTabNavigator from './navigation/StudentTabNavigator';

// Pantallas
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CourseEditScreen from './screens/admin/CourseEditScreen';
import ModuleDetailScreen from './screens/ModuleDetailScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Crear Cuenta' }} />
                <Stack.Screen name="Home" component={StudentTabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="AdminPanel" component={AdminTabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="CourseEdit" component={CourseEditScreen} options={{ title: 'Editar Módulo', headerShown: true }} />
                <Stack.Screen name="ModuleDetail" component={ModuleDetailScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
