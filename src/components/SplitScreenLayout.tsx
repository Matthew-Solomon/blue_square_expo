import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PlatformerScene from './PlatformerScene';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

/**
 * SplitScreenLayout component that divides the screen into two parts:
 * - Top half: Battle screen (PlatformerScene)
 * - Bottom half: Other screen (currently a blank black screen)
 */
export default function SplitScreenLayout() {
  return (
    <View style={styles.container}>
      {/* Top half - Battle Screen */}
      <View style={styles.battleScreen}>
        <PlatformerScene />
      </View>

      {/* Bottom half - Other Screen (currently blank black) */}
      <View style={styles.otherScreen}>
        {/* This will be filled with content later */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  battleScreen: {
    height: '50%', // Take up top half of the screen
    width: '100%',
    backgroundColor: '#F5FCFF', // Light background for battle screen
  },
  otherScreen: {
    height: '50%', // Take up bottom half of the screen
    width: '100%',
    backgroundColor: '#000000', // Black background for now
  },
});
