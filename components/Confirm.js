import { Alert } from 'react-native';

export function Confirm(message, onConfirm, onCancel) {
  Alert.alert(
    'Confirm',
    message,
    [
      {
        text: 'Cancel',
        onPress: onCancel,
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: onConfirm,
      },
    ],
    { cancelable: false }
  );
}
