import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Tus navegadores de pestañas que ya funcionan
import AdminTabNavigator from './navigation/AdminTabNavigator';
import StudentTabNavigator from './navigation/StudentTabNavigator';

// Tus pantallas de inicio de sesión y registro
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// --- PIEZA AÑADIDA: Se importa la pantalla de edición ---
// El navegador principal necesita conocer esta pantalla para poder abrirla.
import CourseEditScreen from './screens/admin/CourseEditScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            {/* Este es el navegador "padre" que controla toda la aplicación */}
            <Stack.Navigator initialRouteName="Login">
                {/* Pantallas sin inicio de sesión */}
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Crear Cuenta' }} />
                
                {/* Pantallas DESPUÉS del inicio de sesión */}
                <Stack.Screen 
                    name="Home" 
                    component={StudentTabNavigator} // Carga la barra de pestañas del Alumno
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="AdminPanel" 
                    component={AdminTabNavigator} // Carga la barra de pestañas del Admin
                    options={{ headerShown: false }}
                />

                {/* --- RUTA AÑADIDA: Para la pantalla de edición --- */}
                {/* Al registrarla aquí, la app sabrá cómo abrir "CourseEdit" */}
                <Stack.Screen 
                    name="CourseEdit" 
                    component={CourseEditScreen} 
                    options={{ 
                        title: 'Editar Módulo',
                        headerShown: true // Le ponemos un título y botón de regreso automáticos
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
