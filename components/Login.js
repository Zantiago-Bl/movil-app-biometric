import { useEffect, useState } from 'react'
import { View, StyleSheet, Text, TextInput, Platform } from 'react-native';
import Button from './Button';
import * as LocalAuthentication from 'expo-local-authentication';
import { v4 as uuidv4 } from 'uuid';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { Confirm } from './Confirm';
import { useNavigation } from '@react-navigation/native';
import LoadingModal from './LoadingModal';


export default function Login() {
  const navigation = useNavigation();
  const [loggedId, setLoggedIn] = useState(false);
  const [userInputValue, setUserInputValue] = useState('');
  const [passwordInputValue, setPasswordInputValue] = useState('');
  const [showUser, setShowUser] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleUserInputChange = () => {
  }
  useEffect(() => {
    handleUserInputChange();
  }, [userInputValue]);
  const handlePasswordInputChange = () => {
  }
  useEffect(() => {
    handlePasswordInputChange();
  }, [passwordInputValue]);

  const fetchData = async () => {
    setModalVisible(true);
      try{
          const response = await fetch('https://5336-191-156-62-202.ngrok-free.app/test/verifyUser', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user: userInputValue, password: passwordInputValue }),
          });
          const jsonData = await response.json();
          if(jsonData !== null) {
              let fetchUUID = await SecureStore.getItemAsync('secure_deviceId');
              fetchUUID = fetchUUID ? fetchUUID.replace(/"/g, '') : null;
              if(deviceId !== fetchUUID){
                console.log("Desde el if del nose xd")
                Confirm (
                  "Do you want convert this into your main device?",
                  async () =>{
                    let uuid = uuidv4();
                    await SecureStore.setItemAsync('secure_deviceId', JSON.stringify(uuid))
                      await fetch('https://5336-191-156-62-202.ngrok-free.app/test/updateUser', {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ id: jsonData[0].id, deviceId: uuid})
                    });
                    console.log("Actual: ", fetchUUID)
                    console.log("En DB: ", jsonData[0].device_id )
                    console.log("Variable deviceId: ", deviceId);
                    console.log("Esto: ", JSON.stringify({ id: jsonData[0].id, deviceId: uuid}))
                    alert("Access Valid");
                    navigation.navigate("Home");
                    setModalVisible(false);
                  }, 
                  async () => {
                    alert("Access Valid");
                    navigation.navigate("Home");
                    setModalVisible(false);
                  }
                )
                return;
              }
              alert("Access Valid");
              navigation.navigate("Home");
              setModalVisible(false);
          }else{
              alert("Invalid User");
              setModalVisible(false);
          }
          setUserInputValue('');
          setPasswordInputValue('');
      }catch (e){
          console.error('Error fetching data: ', e);
          setModalVisible(false);
      }
  }

  const userExist = async () => {
    setModalVisible(true);
    console.log("Button pressed");
    console.log("Input: ", JSON.stringify({ user: userInputValue }));
  
    try {
      const response = await fetch('https://5336-191-156-62-202.ngrok-free.app/test/userExist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userInputValue }),
      });
  
      const jsonData = await response.json();
      console.log("Response data: ", jsonData);
  
      if (jsonData && jsonData.length > 0) {
  
        const userDevice = jsonData[0].device_id;
        if (userDevice !== null && userDevice !== undefined) {
          console.log("User device_id: ", userDevice);
          setDeviceId(userDevice);
        }
  
        console.log("User Exist");
        setShowPassword(true);
        setShowUser(false);
        
        if (userDevice) {
          console.log("Dentro del if");
          setBiometricAuth(true);
        } else {
          console.log("Desde el else");
          setBiometricAuth(false);
        }
        setModalVisible(false);
      } else {
        setModalVisible(false);
        console.log("User doesn't exist");
        throw new Error("User doesn't exist");
      }
    } catch (e) {
      setModalVisible(false);
      console.error(e);
    }
  }
  

  
  const handleBiometricLogin = async () => {
    setModalVisible(true);
    console.log("Button pressed Biometric Login");
    let fetchUUID = await SecureStore.getItemAsync('secure_deviceId');
    fetchUUID = fetchUUID ? fetchUUID.replace(/"/g, '') : null;
    console.log(deviceId);
    if(fetchUUID === deviceId){
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        console.log('Biometric sensor is not available on this device.');
        return;
      }
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        console.log('Biometric authentication is not enrolled on this device.');
        return;
      }
      const options = {
        title: 'Autenticación biométrica',
        promptMessage: 'Inicia sesión con tu huella digital o Face ID',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Ingresar contraseña'
      };
      try {
        const {success, error} = await LocalAuthentication.authenticateAsync(options);
        if (success) {
          setLoggedIn(true);
          console.log('Login successful!');
          alert("Access Valid");
          navigation.navigate("Home");
        } else {
          console.error('Biometric authentication failed:', error);
        }
        setModalVisible(false);
      } catch (error) {
        console.error('Biometric authentication error:', error);
        setModalVisible(false);
      }
    }else{
      setModalVisible(false);
      alert("Biometrical login is not avalible, please login with your password")
      setBiometricAuth(false);
    }
  };
  
  return (    
      <View style={styles.loginContainer}>
        <LoadingModal isVisible={modalVisible}> </LoadingModal>
          {showUser ? (
            <View style={styles.viewStyle}>
            <Text style={styles.textStyle}> Enter your user </Text>
            <TextInput style={styles.inputStyle}
                placeholder='Login'
                onChangeText={(value) => {setUserInputValue(value)}}
                value={userInputValue}
            />
            <Button label="Continue" onPress={userExist}/>
            <Button label="Register" onPress={() => {navigation.navigate('Register')}}/>
          </View>
          ) : (
            <View/>
          )}     
          {showPassword ? (
            <View style={styles.viewStyle}>
              <Text style={styles.textStyle}> Type your password </Text>
              <TextInput style={styles.inputStyle}
                  secureTextEntry={true}
                  placeholder='Password'
                  onChangeText={(value) => {setPasswordInputValue(value)}}
                  value={passwordInputValue}
              />
              <Button theme="login" label="Login" onPress={fetchData}/>
              {biometricAuth ? (
                <View>
                  <Button label="Biometric Login" onPress={handleBiometricLogin}/>
                  <Button label="Modify user" onPress={() =>{setBiometricAuth(false), setShowPassword(false), setShowUser(true)}}/>
                </View>
              ) : (
                <View>
                  <Button label="Modify user" onPress={() =>{setBiometricAuth(false), setShowPassword(false), setShowUser(true)}}/>
                </View>
              )}
            </View>
          ) : (
            <View/>
          )}
      </View>
  );
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    inputStyle: {
        color: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 5,
        height: 30,
        marginBottom: 15,
        height: 40,
        width: 350,
    },
    viewStyle: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    textStyle: {
      marginBottom: 20,
      color: 'white',
      fontSize: 17,
    }
})
