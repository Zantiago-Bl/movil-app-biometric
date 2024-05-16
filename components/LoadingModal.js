import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { AntDesign } from '@expo/vector-icons';

export default function EmojiPicker({ isVisible }){
    return (
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View style={styles.modalContent}>
                    <Animatable.View animation="rotate" iterationCount="infinite" duration={400}>
                        <AntDesign name="loading2" size={30} color="white" />
                    </Animatable.View>
                </View>
            </Modal>
    );
}

 const styles = StyleSheet.create ({
    modalContent: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(37, 41, 46, 0.7)',
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
 });