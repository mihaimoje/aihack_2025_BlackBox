import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content} />
      <View style={styles.tabBar}>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#013220', // dark green
  },
  content: {
    flex: 1,
  },
  tabBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'capitalize',
  },
});
