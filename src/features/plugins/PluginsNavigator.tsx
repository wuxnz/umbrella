import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="folder" />;

const PluginsNavigator = () => {
  return (
    <View style={styles.container}>
      <Text>Waiting for plugins to load</Text>
      <View style={{ height: 8 }} />
      <Text>¯\_( ͡° ͜ʖ ͡°)_/¯</Text>
    </View>
  );
};

export default PluginsNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
