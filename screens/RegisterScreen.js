import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    Text, 
    StyleSheet, 
    ActivityIndicator, 
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    Alert // Para mostrar mensajes nativos
} from 'react-native';
import { useRegisterViewModel } from '../ViewModel/RegisterViewModel';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const RegisterScreen = ({ navigation }) => {
    
    // --- LÓGICA DE NAVEGACIÓN COMBINADA Y CORREGIDA ---
    // Esta función se ejecuta después de que el ViewModel confirma un registro exitoso.
    const handleSuccess = (user) => {
        const userRole = user.role;
        
        if (userRole === 'Administrador') {
            // La navegación para el admin se mantiene como la tenías.
            navigation.replace('AdminPanel', { userName: user.name }); 
        } else {
            // Para el alumno, mostramos un mensaje de éxito y lo enviamos al Login.
            Alert.alert(
                '¡Registro Exitoso!',
                'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
                // Al presionar OK, se ejecuta la navegación a la pantalla de Login.
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        }
    };

    // El resto de tu código se mantiene exactamente igual, ya que estaba correcto.
    const { 
        name, setName, 
        lastName, setLastName,
        email, setEmail, 
        password, setPassword,
        gender, setGender,
        isLoading, error, handleRegister 
    } = useRegisterViewModel(handleSuccess);

    const [image, setImage] = useState(null);

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Lo sentimos, necesitamos permisos de la galería para que esto funcione.');
                return;
            }
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    
    const onRegisterPress = () => {
        const userData = { name, lastName, email, password, gender, image };
        handleRegister(userData);
    };

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
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.logoTitle}>EduLingo</Text>
                <Text style={styles.tagline}>"Hoy empiezas el viaje hacia la fluidez"</Text>

                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Icon name="camera" size={40} color="#5E35B1" />
                            <Text style={styles.imagePlaceholderText}>Añadir foto</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Text style={styles.label}>Nombre:</Text>
                <TextInput style={styles.input} placeholder="Ingresa nombre" value={name} onChangeText={setName} />
                
                <Text style={styles.label}>Apellido:</Text>
                <TextInput style={styles.input} placeholder="Ingresa apellido" value={lastName} onChangeText={setLastName} />

                <Text style={styles.label}>Correo electrónico:</Text>
                <TextInput style={styles.input} placeholder="correolectrónico@dominio.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                
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

                <Text style={styles.label}>Contraseña:</Text>
                <TextInput style={styles.input} placeholder="********" value={password} onChangeText={setPassword} secureTextEntry />

                <TouchableOpacity
                    style={styles.button}
                    onPress={onRegisterPress} 
                    disabled={isLoading}
                >
                    {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Crear cuenta</Text>}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.linkText}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { paddingHorizontal: 30, paddingTop: 60, paddingBottom: 40 },
    logoTitle: { fontSize: 32, fontWeight: 'bold', color: '#5E35B1', textAlign: 'center' },
    tagline: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
    imagePicker: { alignSelf: 'center', marginBottom: 20 },
    profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#5E35B1' },
    imagePlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed' },
    imagePlaceholderText: { marginTop: 5, color: '#5E35B1' },
    label: { fontSize: 16, color: '#333', marginBottom: 5, marginTop: 10 },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 5 },
    radioGroup: { flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 10 },
    radioOption: { flexDirection: 'row', alignItems: 'center', marginRight: 30 },
    radioLabel: { fontSize: 16, marginLeft: 8, color: '#333' },
    button: { backgroundColor: '#000', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    errorText: { color: 'red', textAlign: 'center', marginVertical: 10 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    footerText: { fontSize: 14, color: '#333' },
    linkText: { fontSize: 14, color: '#5E35B1', fontWeight: 'bold' },
});

export default RegisterScreen;