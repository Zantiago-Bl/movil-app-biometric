import { AsyncStorage } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

// Función para solicitar la autenticación biométrica
export default authenticateBiometrics = async () => {
  try {
    const { success } = await LocalAuthentication.authenticateAsync();
    if (success) {
      // Autenticación exitosa, almacenar algún identificador o token
      await AsyncStorage.setItem('biometricToken', 'tokenGenerado');
      return true;
    } else {
      // Autenticación fallida
      return false;
    }
  } catch (error) {
    console.error('Error en la autenticación biométrica:', error);
    return false;
  }
};

// Función para verificar la autenticación biométrica al iniciar sesión
const checkBiometricAuthentication = async () => {
  try {
    // Recuperar el token almacenado
    const biometricToken = await AsyncStorage.getItem('biometricToken');
    if (biometricToken) {
      // Verificar la autenticación biométrica
      const { success } = await LocalAuthentication.authenticateAsync();
      if (success) {
        // Autenticación exitosa
        return true;
      } else {
        // Autenticación fallida
        return false;
      }
    } else {
      // No hay token almacenado, el usuario no ha configurado la autenticación biométrica
      return false;
    }
  } catch (error) {
    console.error('Error al verificar la autenticación biométrica:', error);
    return false;
  }
};

// Ejemplo de uso
const loginWithBiometrics = async () => {
  const isAuthenticated = await checkBiometricAuthentication();
  if (isAuthenticated) {
    // Permitir el acceso a la aplicación
  } else {
    // Mostrar un mensaje de error o solicitar otro método de autenticación
  }
};
