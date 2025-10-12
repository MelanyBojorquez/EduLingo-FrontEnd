import React from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRegisterViewModel } from '../ViewModel/RegisterViewModel';
import Icon from 'react-native-vector-icons/Ionicons'; // Iconos para el Radio Button

const RegisterScreen = ({ navigation }) => {
    
    const handleSuccess = (user) => {
        // Lógica de redirección basada en el rol
        const userRole = user.role;
        const userName = user.name;
        if (userRole === 'Administrador') {
            navigation.replace('AdminPanel', { userName }); 
        } else {
            navigation.replace('Home', { userRole, userName }); 
        }
    };

    const { 
        name, setName, 
        lastName, setLastName,
        email, setEmail, 
        password, setPassword,
        gender, setGender,
        isLoading, error, handleRegister 
    } = useRegisterViewModel(handleSuccess);

    const RadioButton = ({ label, value, selectedValue, onSelect }) => (
        <TouchableOpacity 
            style={styles.radioOption} 
            onPress={() => onSelect(value)}
        >
            <Icon 
                name={selectedValue === value ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={'#5E35B1'}
            />
            <Text style={styles.radioLabel}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.logoTitle}>EduLingo</Text>
            <Text style={styles.tagline}>"Hoy empiezas el viaje hacia la fluidez"</Text>

            <View style={styles.formContainer}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Campo Nombre */}
                <Text style={styles.label}>Nombre:</Text>
                <TextInput style={styles.input} placeholder="Ingresa nombre" value={name} onChangeText={setName} />
                
                {/* Campo Apellido */}
                <Text style={styles.label}>Apellido:</Text>
                <TextInput style={styles.input} placeholder="Ingresa apellido" value={lastName} onChangeText={setLastName} />

                {/* Campo Correo Electrónico */}
                <Text style={styles.label}>Correo electrónico:</Text>
                <TextInput style={styles.input} placeholder="correolectrónico@dominio.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                
                {/* Campo Sexo (Radio Buttons) */}
                <Text style={styles.label}>Sexo:</Text>
                <View style={styles.radioGroup}>
                    <RadioButton 
                        label="Femenino" 
                        value="Femenino" 
                        selectedValue={gender} 
                        onSelect={setGender} 
                    />
                    <RadioButton 
                        label="Masculino" 
                        value="Masculino" 
                        selectedValue={gender} 
                        onSelect={setGender} 
                    />
                </View>

                {/* Campo Contraseña */}
                <Text style={styles.label}>Contraseña:</Text>
                <TextInput style={styles.input} placeholder="********" value={password} onChangeText={setPassword} secureTextEntry />

                {/* Botón Crear Cuenta / Actualizar Datos */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Crear cuenta / Actualizar datos</Text>
                    )}
                </TouchableOpacity>

                {/* Enlace Iniciar Sesión */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.linkText}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 30, paddingTop: 60, },
    logoTitle: { fontSize: 32, fontWeight: 'bold', color: '#5E35B1', textAlign: 'center', },
    tagline: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 20, fontStyle: 'italic', },
    formContainer: { width: '100%', },
    label: { fontSize: 16, color: '#333', marginBottom: 5, marginTop: 10, },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 5, },
    radioGroup: { flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 10, },
    radioOption: { flexDirection: 'row', alignItems: 'center', marginRight: 30, },
    radioLabel: { fontSize: 16, marginLeft: 8, color: '#333', },
    button: { backgroundColor: '#000', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', },
    errorText: { color: 'red', textAlign: 'center', marginTop: 10, },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, },
    footerText: { fontSize: 14, color: '#333', },
    linkText: { fontSize: 14, color: '#5E35B1', fontWeight: 'bold', },
});

export default RegisterScreen;