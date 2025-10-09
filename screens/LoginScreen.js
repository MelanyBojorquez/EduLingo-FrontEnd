// screens/LoginScreen.js
import React from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLoginViewModel } from '../ViewModel/LoginViewModel';

const LoginScreen = ({ navigation }) => {
    // Definimos qué hacer al iniciar sesión con éxito: navegar a 'HomeScreen'
    const handleSuccess = (user) => {
        // navigation.replace previene volver a la pantalla de login con el botón 'atrás'
        navigation.replace('Home', { userRole: user.role }); 
    };

    const { 
        email, setEmail, 
        password, setPassword, 
        isLoading, 
        error, 
        handleLogin 
    } = useLoginViewModel(handleSuccess);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>EduLingo Login Test</Text>
            
            {/* Mensaje de Error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Input Email */}
            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico (ej: alumno@edulingo.com)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Input Contraseña */}
            <TextInput
                style={styles.input}
                placeholder="Contraseña (ej: Alumno456)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Botón de Ingreso */}
            <Button
                title={isLoading ? "Cargando..." : "INGRESAR"}
                onPress={handleLogin}
                disabled={isLoading}
            />
            
            {isLoading && <ActivityIndicator size="small" color="#0000ff" style={styles.loading} />}
            
            <Text style={styles.footer}>¡Prueba tu conexión API!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 15,
    },
    loading: {
        marginTop: 10,
    },
    footer: {
        marginTop: 50,
        textAlign: 'center',
        color: '#666',
    }
});

export default LoginScreen;


/*import React from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { useLoginViewModel } from '../viewmodels/LoginViewModel';
// Importa useNavigation de React Navigation si lo usas, o pásalo como prop

const LoginScreen = ({ navigation }) => {
    const { 
        email, setEmail, 
        password, setPassword, 
        isLoading, 
        error, 
        handleLogin 
    } = useLoginViewModel(navigation); // Pasa navigation al ViewModel

    return (
        <View style={{ /* ... Estilos *//*> }}>
            <Text>Iniciar Sesión</Text>
            
            {/* Muestra el error *//*}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}

            {/* Inputs *//*}
            <TextInput
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                placeholder="Correo"
            />
            <TextInput
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                placeholder="Contraseña"
            />

            {/* Botón y Spinner *//*}
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button
                    title="Ingresar"
                    onPress={handleLogin}
                    disabled={isLoading}
                />
            )}
            
            <Button 
                title="Registrarse" 
                onPress={() => navigation.navigate('Register')} 
            /> 
        </View>
    );
};

export default LoginScreen;*/