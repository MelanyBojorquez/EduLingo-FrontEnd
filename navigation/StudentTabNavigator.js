
 import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Importa todas las pantallas que usará el navegador
import HomeScreen from '../screens/HomeScreen'; 
import ProfileScreen from '../screens/ProfileScreen';
import CoursesScreen from '../screens/CoursesScreen'; 
import { getUser } from '../services/AuthService';

const Tab = createBottomTabNavigator();

// --- Componente Intermedio MEJORADO con Manejo de Errores ---
// (Esta es la versión robusta que previene cargas infinitas)
const ProfileTabLoader = (props) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                if (userData) {
                    setUser(userData);
                } else {
                    throw new Error("No se encontraron datos de usuario guardados.");
                }
            } catch (e) {
                console.error("Error al cargar el perfil:", e);
                setError("No se pudo cargar el perfil.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (isLoading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#5E35B1" /></View>;
    }

    if (error || !user) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>{error || "Usuario no encontrado."}</Text></View>;
    }

    return <ProfileScreen {...props} route={{ params: { user } }} />;
};

// --- Componente principal de la barra de navegación ---
const StudentTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Courses') {
                        // Ícono para la nueva pestaña de Cursos
                        iconName = focused ? 'wallet' : 'wallet-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#5E35B1',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            {/* Define el orden de las pestañas */}
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
            <Tab.Screen name="Courses" component={CoursesScreen} options={{ title: 'Cursos' }} />
            <Tab.Screen name="Profile" component={ProfileTabLoader} options={{ title: 'Perfil' }} />
        </Tab.Navigator>
    );
};

export default StudentTabNavigator;