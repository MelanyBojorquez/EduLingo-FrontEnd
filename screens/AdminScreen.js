// screens/AdminScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminScreen = ({ route }) => {
    const { userName } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Super Panel de Administración 👑</Text>
            <Text style={styles.greeting}>Bienvenido, {userName}</Text>
            <Text style={styles.warning}>
                Esta interfaz solo es visible para Administradores.
            </Text>
            <Text style={styles.info}>
                Aquí se integrarán las herramientas para la gestión global del sistema y la creación de nuevos usuarios Profesor/Admin.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({ /* ... */ });
export default AdminScreen;