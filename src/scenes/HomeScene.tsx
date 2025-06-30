import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BaseScene from '../components/game/BaseScene';
import { GameState, useGameContext } from '../context/GameContext';

// Get the screen dimensions
const { width, height } = Dimensions.get('window');

export default function HomeScene() {
  // State for fade-in animation
  const [fadeAnim] = useState(new Animated.Value(0));

  // Get game context
  const { setGameState } = useGameContext();

  // Handle start button press - directly transition to level state
  const handleStartPress = () => {
    setGameState(GameState.LEVEL);
  };

  // Fade-in animation on component mount
  useEffect(() => {
    // Start with a black screen
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // 1 second fade-in
      useNativeDriver: true,
    });

    // Start the animation after a short delay
    setTimeout(() => {
      fadeIn.start();
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      {/* Black background that fades out */}
      <Animated.View
        style={[
          styles.blackOverlay,
          { opacity: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0] // Fade out from opaque to transparent
          })}
        ]}
      />

      {/* Game scene that fades in */}
      <Animated.View
        style={[
          styles.sceneContainer,
          { opacity: fadeAnim }
        ]}
      >
        <BaseScene>
          {/* Start button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartPress}
          >
            <Text style={styles.startButtonText}>START</Text>
          </TouchableOpacity>
        </BaseScene>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  blackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 10,
  },
  sceneContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  startButton: {
    position: 'absolute',
    top: height / 4 - 50, // Position above the middle of the screen
    left: width / 2 - 50, // Center horizontally
    width: 100,
    height: 40,
    backgroundColor: '#0066cc',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
