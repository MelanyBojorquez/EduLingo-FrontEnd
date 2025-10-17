// screens/LoginScreen.js
import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importar la librería de iconos
import { useLoginViewModel } from '../ViewModel/LoginViewModel'; 

const LoginScreen = ({ navigation }) => {
    
    
    const handleSuccess = (user) => {
        const userRole = user.role;
        const userName = user.name;

        if (userRole === 'Administrador') {
            navigation.replace('AdminPanel', { userName }); 
        } else {
            navigation.replace('Home', { userRole, userName }); 
        }
    };

    const { 
        email, setEmail, 
        password, setPassword, 
        isLoading, 
        error, 
        handleLogin,
        // Importar la lógica del ViewModel
        isPasswordVisible, togglePasswordVisibility 
    } = useLoginViewModel(handleSuccess);

    return (
        <View style={styles.container}>
            <Text style={styles.logoTitle}>EduLingo</Text>
            <Text style={styles.tagline}>"Hoy empiezas el viaje hacia la fluidez"</Text>

            <View style={styles.formContainer}>
                <Text style={styles.heading}>Inicio de sesión</Text>
                
                {/*  RENDERIZAR EL ERROR*/}
                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <Text style={styles.label}>Ingresa tu correo electrónico</Text>
                <TextInput
                    style={styles.input}
                    placeholder="correolectrónico@dominio.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Contraseña:</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="********"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordVisible} // Usa el estado de visibilidad
                    />
                    {/* Botón de Ojo */}
                    <TouchableOpacity 
                        onPress={togglePasswordVisibility} 
                        style={styles.toggleButton}
                    >
                        <Icon 
                            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} // Cambia el icono
                            size={24} 
                            color="#333" 
                        />
                    </TouchableOpacity>
                </View>
                
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Botón Continuar */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Continuar</Text>
                    )}
                </TouchableOpacity>

                {/* Enlace Crear Cuenta */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿No tienes cuenta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.linkText}>Crear cuenta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingTop: 80, 
    },
    logoTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#5E35B1', 
        textAlign: 'center',
    },
    tagline: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 50,
        fontStyle: 'italic',
    },
    formContainer: {
        width: '100%',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    // Contraseña: Contenedor para el campo 
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        height: 50,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    toggleButton: {
        padding: 10,
    },
    // Botón Continuar (Negro)
    button: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#333',
    },
    linkText: {
        fontSize: 14,
        color: '#5E35B1', 
        fontWeight: 'bold',
    },
    errorBox: {
        backgroundColor: '#FFE5E5', // Fondo suave rojizo
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        borderLeftWidth: 4, // Borde izquierdo para destacar
        borderColor: '#DC3545',
    },
    errorText: {
        color: '#B71C1C', // Texto rojo oscuro
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default LoginScreen;