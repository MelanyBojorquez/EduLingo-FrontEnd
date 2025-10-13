import React from 'react';
// Importamos TouchableOpacity para crear el botón
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Recibimos 'navigation' como prop para poder navegar entre pantallas
const AdminHomeScreen = ({ navigation }) => {

    // Función que se ejecutará al presionar el botón de cerrar sesión
    const handleLogout = () => {
        // Usamos navigation.reset para limpiar el historial de navegación y
        // establecer la pantalla de Login como la única en la pila.
        // Esto previene que el usuario pueda "volver" a la pantalla de admin
        // después de cerrar sesión.
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Panel de Administración</Text>
            
            {/* Aquí puedes agregar más contenido para el panel de admin si lo necesitas */}

            {/* Botón de Cerrar Sesión */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#f5f5f5',
        justifyContent: 'space-between', // Para empujar el botón al final
        paddingBottom: 40, // Espacio extra en la parte inferior
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#5E35B1',
        textAlign: 'center', // Centramos el título
    },
    // Estilos para el botón de cerrar sesión
    logoutButton: {
        backgroundColor: '#B71C1C', // Un color rojo para indicar una acción de salida
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    // Estilos para el texto del botón
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AdminHomeScreen;
