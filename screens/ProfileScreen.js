import React from 'react';
// --- 1. SE AÑADEN 'ScrollView' Y 'Alert' A LAS IMPORTACIONES ---
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '../config/api'; 
// --- 2. SE IMPORTA LA FUNCIÓN PARA CERRAR SESIÓN ---
import { logoutUser } from '../services/AuthService';

const ProfileScreen = ({ route, navigation }) => {
    // Tu código para recibir el usuario se mantiene igual
    const { user } = route.params;

    // Tu código para construir la URL de la imagen se mantiene igual
    const serverUrl = BASE_URL.split('/api')[0];
    const imageUrl = user.profile_picture_url
        ? `${serverUrl}/${user.profile_picture_url.replace(/\\/g, "/")}`
        : null;
    
    // --- 3. SE AÑADE LA FUNCIÓN PARA MANEJAR EL LOGOUT ---
    const handleLogout = async () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres cerrar la sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sí, Cerrar Sesión", 
                    onPress: async () => {
                        await logoutUser();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>EduLingo</Text>
                <Text style={styles.headerSubtitle}>"Pequeños pasos, grandes conversaciones"</Text>
            </View>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back-outline" size={24} color="#333" />
                <Text style={styles.backButtonText}>Regresar</Text>
            </TouchableOpacity>

            {/* --- 4. SE ENVUELVE EL CONTENIDO EN UN SCROLLVIEW --- */}
            {/* Esto asegura que todos los botones sean visibles en pantallas pequeñas */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Tu tarjeta de perfil se mantiene exactamente igual */}
                <View style={styles.profileCard}>
                    <View style={styles.cardHeader}>
                        {imageUrl ? (
                            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.profileImagePlaceholder}>
                                <Icon name="person" size={60} color="#c7c7c7" />
                            </View>
                        )}
                        <View style={styles.nameContainer}>
                            <Text style={styles.nameText}>{user.name || 'Nombre Apellido'}</Text>
                        </View>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Correo: </Text>
                            {user.email || 'No disponible'}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Cursos Completados: </Text>0 cursos
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Cursos Inscritos: </Text>0 cursos
                        </Text>
                    </View>
                </View>

                {/* Tu botón de "Actualizar datos" se mantiene igual */}
                <TouchableOpacity style={styles.updateButton}>
                    <Text style={styles.updateButtonText}>Actualizar datos</Text>
                </TouchableOpacity>

                {/* --- 5. SE AÑADE EL NUEVO BOTÓN DE CERRAR SESIÓN --- */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- 6. SE AÑADEN LOS ESTILOS PARA EL SCROLL Y EL NUEVO BOTÓN ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    scrollContent: { paddingBottom: 40 }, // Estilo para el ScrollView
    header: { paddingVertical: 15, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    headerSubtitle: { fontSize: 14, color: '#666' },
    backButton: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#e0cffc' },
    backButtonText: { fontSize: 18, marginLeft: 10, fontWeight: '500' },
    profileCard: { backgroundColor: '#F3E5F5', borderRadius: 20, margin: 20, padding: 20, elevation: 5 },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    profileImage: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#fff' },
    profileImagePlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
    nameContainer: { marginLeft: 20 },
    nameText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    cardBody: { marginTop: 25 },
    infoText: { fontSize: 16, color: '#444', marginBottom: 10 },
    infoLabel: { fontWeight: 'bold' },
    updateButton: { backgroundColor: '#000', borderRadius: 25, paddingVertical: 12, paddingHorizontal: 25, alignSelf: 'center', marginTop: 10 },
    updateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    // Estilos para el nuevo botón de logout
    logoutButton: {
        backgroundColor: '#D32F2F',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 25,
        alignSelf: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;