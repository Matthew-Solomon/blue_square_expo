import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import BaseScene from '../components/game/BaseScene';

// Get the screen dimensions
const { width, height } = Dimensions.get('window');

// Game constants
const PLAYER_SIZE = 50;

export default function LevelScene() {
  // State for player position and game state
  const [playerPosition, setPlayerPosition] = useState({ x: width }); // Start from right edge
  const [levelStarted, setLevelStarted] = useState(false);

  // Start level animation when component mounts
  useEffect(() => {
    // Use a local Animated.Value for the animation
    const playerEntryAnim = new Animated.Value(width);

    // Listen to animation updates to update our state
    const animationListener = playerEntryAnim.addListener(({ value }) => {
      setPlayerPosition({ x: value });
    });

    // Animate player sliding in from right to left third position
    Animated.timing(playerEntryAnim, {
      toValue: width / 3 - PLAYER_SIZE / 2,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
        // Final position update to ensure accuracy
        setPlayerPosition({ x: width / 3 - PLAYER_SIZE / 2 });

      // Level has started after animation completes
      setLevelStarted(true);

      // Remove the listener
      playerEntryAnim.removeListener(animationListener);
    });
  }, []); // Only run on mount

  return (
    <View style={styles.container}>
      <BaseScene playerPosition={playerPosition}>
        {/* Level UI elements */}
        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>Level 1</Text>
        </View>
      </BaseScene>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  levelInfo: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  levelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  scoreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  distanceMeter: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  distanceProgress: {
    height: '100%',
    backgroundColor: '#0066cc',
  },
  distanceText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }
});
