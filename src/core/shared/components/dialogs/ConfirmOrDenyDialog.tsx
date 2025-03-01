import {View, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import {Portal, Dialog, Button, Text, useTheme} from 'react-native-paper';
import {DarkTheme, LightTheme} from '../../../theme/theme';

// ConfirmOrDenyDialog
// This component is used to display a dialog that asks the user to confirm or deny a request
const ConfirmOrDenyDialog = ({
  onConfirm,
  onCancel,
  title,
  reason,
  visible,
}: {
  onConfirm: () => Promise<void>;
  title: string;
  reason: string;
  visible: boolean;
  onCancel: () => void;
}) => {
  const colorScheme = useColorScheme();

  return (
    <Portal>
      <Dialog visible={visible}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{reason}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            textColor={`${
              colorScheme === 'dark'
                ? DarkTheme.colors.disabled
                : LightTheme.colors.disabled
            }`}
            onPress={onCancel}>
            Cancel
          </Button>
          <Button onPress={async () => await onConfirm()}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmOrDenyDialog;
