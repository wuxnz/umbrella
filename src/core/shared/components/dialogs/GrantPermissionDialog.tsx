import React, {useEffect} from 'react';
import {useColorScheme, View} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import {DarkTheme, LightTheme} from '../../../theme/theme';
import {useGrantPermissionDialogStore} from '../../../../features/plugins/presentation/state/useGrantPermissionDialogStore';
import {requestManagePermission} from 'manage-external-storage';

// GrantPermissionDialog
// This component is used to display a dialog that asks the user to grant a permission
// Permissions required: manageExternalStorage
// Shown on app launch

function GrantPermissionDialog() {
  const colorScheme = useColorScheme();

  const {visible, setVisible, title, reason, onConfirm} =
    useGrantPermissionDialogStore(state => state);

  const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Grant Permission: {title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            The {title} permission is required to {reason}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={hideDialog}
            textColor={`${
              colorScheme === 'dark'
                ? DarkTheme.colors.disabled
                : LightTheme.colors.disabled
            }`}>
            Cancel
          </Button>
          <Button onPress={() => requestManagePermission().then(onConfirm)}>
            Grant Permission
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default GrantPermissionDialog;
