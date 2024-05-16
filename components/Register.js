import { useEffect, useState } from 'react'
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from './Button';
import { v4 as uuidv4 } from 'uuid';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { Confirm } from './Confirm';
import LoadingModal from './LoadingModal';


export default function Login() {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [userInputValue, setUserInputValue] = useState('');
    const [passwordInputValue, setPasswordInputValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleUserInputChange = () => {
    }
    useEffect(() => {
        handleUserInputChange();
    })
    const handlePasswordInputChange = () => {
    }
    useEffect(() => {
        handlePasswordInputChange();
    })

    const fetchData = async () => {
        Confirm(
            'Do you want enable biometric authentication on this device?',
            async () => {
                setModalVisible(true);
                console.log("OK");
                let uuid = uuidv4();
                console.log(JSON.stringify({ user: userInputValue, password: passwordInputValue, device_id: uuid }));
                await SecureStore.setItemAsync('secure_deviceId', JSON.stringify(uuid))
                try{
                    console.log("No se");
                    const response = await fetch('https://5336-191-156-62-202.ngrok-free.app/test/createUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ user: userInputValue, password: passwordInputValue, deviceId: uuid }),
                    });
                    console.log(userInputValue, passwordInputValue, uuid)
                    navigation.navigate('Login');
                }catch (e){
                    console.error('Error fetching data: ', e);
                };
                setUserInputValue('');
                setPasswordInputValue('');
                setModalVisible(false);
            },
            async () => {
                setModalVisible(true);
                console.log("OKN'T");
                try{
                    const response = await fetch('https://5336-191-156-62-202.ngrok-free.app/test/createUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ user: userInputValue, password: passwordInputValue }),
                    });
                    console.log(userInputValue, passwordInputValue)
                    navigation.navigate('Login');
                }catch (e){
                    console.error('Error fetching data: ', e);
                };   
                setUserInputValue('');
                setPasswordInputValue('');
                setModalVisible(false);
            }
        );
    };
    
    return (    
        <View style={styles.loginContainer}>
            <LoadingModal isVisible={modalVisible}> </LoadingModal>
            <Text style={styles.textStyle}> Enter your user </Text>
            <TextInput style={styles.inputStyle}
                placeholder='User'
                onChangeText={(value) => {setUserInputValue(value)}}
                value={userInputValue}
            />
            <Text style={styles.textStyle}> Type your password </Text>
            <TextInput style={styles.inputStyle}
                secureTextEntry={true}
                placeholder='Password'
                onChangeText={(value) => {setPasswordInputValue(value)}}
                value={passwordInputValue}
            />
            <Button theme="login" label="Register" onPress={fetchData}/>
            <Button label="Log in" onPress={() =>{navigation.navigate('Login')}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
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
    textStyle: {
        marginBottom: 20,
        color: 'white',
        fontSize: 17,
    }
})
