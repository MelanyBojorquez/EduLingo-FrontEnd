// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

// Importa tu pantalla de Login
import LoginScreen from './screens/LoginScreen'; 
// Importa tu archivo de servicio para verificar el token
import { getToken } from './services/AuthService'; 

const Stack = createStackNavigator();

// Pantalla de inicio temporal para verificar la navegación
const HomeScreen = ({ route }) => {
    // Accede a los datos pasados desde el Login (ej: rol)
    const { userRole } = route.params || { userRole: 'Usuario' }; 
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>
                ¡Bienvenido a EduLingo!
            </Text>
            <Text style={{ fontSize: 18 }}>
                Autenticación exitosa.
            </Text>
            <Text style={{ fontSize: 18, color: 'blue' }}>
                Tu Rol: {userRole}
            </Text>
        </View>
    );
};


export default function App() {
    // Puedes implementar aquí la lógica para verificar si hay un token
    // al inicio de la app para redirigir automáticamente (Splash Screen)

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{ title: 'EduLingo Principal' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
