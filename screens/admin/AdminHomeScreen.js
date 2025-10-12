
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminHomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Panel de Administración - Inicio</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#f5f5f5' 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#5E35B1',
    }
});

export default AdminHomeScreen;