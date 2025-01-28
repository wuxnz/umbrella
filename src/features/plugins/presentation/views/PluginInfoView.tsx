import {
  View,
  Image,
  useColorScheme,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Linking,
  ScrollView,
} from 'react-native';
import React from 'react';
import {Appbar, Chip, Icon, List, Text} from 'react-native-paper';
import {DarkTheme, LightTheme} from '../../../../core/theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import FileViewer from 'react-native-file-viewer';

const PluginInfoView = ({route}: {route: any}) => {
  const plugin = route.params.plugin;

  const colorScheme = useColorScheme();

  const navigation = useNavigation();

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        style={{
          ...styles.scrollView,
          backgroundColor:
            colorScheme === 'dark'
              ? DarkTheme.colors.background
              : LightTheme.colors.background,
        }}>
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title={plugin.name} />
          <Appbar.Action icon="star" onPress={() => {}} />
          <Appbar.Action icon="earth" onPress={() => {}} />
          <Appbar.Action icon="share" onPress={() => {}} />
        </Appbar.Header>
        {plugin.bannerImageUrl !== undefined ? (
          <>
            <ImageBackground
              source={{uri: plugin.bannerImageUrl}}
              style={styles.banner}>
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)']}
                style={{flex: 1}}></LinearGradient>
            </ImageBackground>
          </>
        ) : (
          <View style={styles.bannerPlaceholderContainer}>
            <Icon source="power-plug" size={50} />
          </View>
        )}
        <View style={styles.pluginInfoView}>
          <View style={styles.pluginInfoContainer}>
            {plugin.iconUrl !== undefined ? (
              <Image
                source={{uri: plugin.iconUrl}}
                style={styles.authorAvatarImage}
              />
            ) : (
              <View style={styles.authorAvatarIcon}>
                <Icon source="account" size={50} />
              </View>
            )}
            <View style={styles.pluginNameAndDescription}>
              <Text variant="headlineMedium" style={{fontWeight: 'bold'}}>
                {plugin.name}
              </Text>
              <Text variant="bodyMedium">{plugin.author}</Text>
              <Text variant="bodyMedium">{plugin.description}</Text>
            </View>
            <View style={{flex: 1}} />
          </View>
          <View style={styles.pluginMetaDataContainer}>
            <Chip style={styles.chip}>Version: {plugin.version}</Chip>
            {plugin.homePageUrl !== undefined ? (
              <Chip
                closeIcon={'open-in-new'}
                style={styles.chip}
                onClose={() => {
                  Linking.openURL(plugin.homePageUrl);
                }}>
                Open Source
              </Chip>
            ) : null}
            <Chip
              closeIcon={'open-in-new'}
              style={styles.chip}
              onClose={() => {
                Linking.openURL(plugin.manifestUrl);
              }}>
              Manifest
            </Chip>
            <Chip
              closeIcon={'open-in-new'}
              style={styles.chip}
              onClose={() => {
                Linking.openURL(plugin.pluginUrl);
              }}>
              Plugin
            </Chip>
          </View>
          <List.Section style={styles.pluginDetailsContainer}>
            <List.Item
              title="Changelog"
              description={plugin.changelog}
              onPress={() => {}}
            />
            <List.Item
              title="Readme"
              description={plugin.readme}
              onPress={() => {}}
            />
            <List.Item
              title="License"
              description={plugin.license}
              onPress={() => {}}
            />
            <List.Item
              title="Manifest File Location"
              description={plugin.manifestPath}
              onPress={() => {
                FileViewer.open(plugin.manifestPath);
              }}
            />
            <List.Item
              title="Plugin File Location"
              description={plugin.pluginPath}
              onPress={() => {
                FileViewer.open(plugin.pluginPath);
              }}
            />
          </List.Section>
        </View>
      </ScrollView>
    </View>
  );
};

export default PluginInfoView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  pluginInfoView: {
    marginTop: -50,
  },
  banner: {
    width: '100%',
    height: 200,
  },
  bannerPlaceholderContainer: {
    width: '100%',
    height: 200,
    backgroundColor: 'gray',
  },
  pluginInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  authorAvatarImage: {
    width: 100,
    height: 100,
  },
  authorAvatarIcon: {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
  },
  pluginNameAndDescription: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  pluginMetaDataContainer: {
    flex: 1,
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 16,
  },
  chip: {
    height: 36,
    width:
      Dimensions.get('window').width >= 600
        ? Dimensions.get('window').width / 3
        : Dimensions.get('window').width / 2 - 24,
  },
  pluginDetailsContainer: {
    flex: 1,
    width: '100%',
  },
});
