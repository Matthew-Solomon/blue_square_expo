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
  const { gameState, setGameState } = useGameContext();

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
      {/* Top half - Game Scene */}
      <View style={styles.gameContainer}>
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

      {/* Bottom half - Navigation Buttons */}
      <View style={styles.navigationScreen}>
        <Text style={styles.stateLabel}>Current State: {gameState}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.navButton, gameState === GameState.HOME ? styles.activeButton : null]}
            onPress={() => setGameState(GameState.HOME)}
          >
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, gameState === GameState.LEVEL ? styles.activeButton : null]}
            onPress={() => setGameState(GameState.LEVEL)}
          >
            <Text style={styles.buttonText}>Level</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, gameState === GameState.INVENTORY ? styles.activeButton : null]}
            onPress={() => setGameState(GameState.INVENTORY)}
          >
            <Text style={styles.buttonText}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, gameState === GameState.SHOP ? styles.activeButton : null]}
            onPress={() => setGameState(GameState.SHOP)}
          >
            <Text style={styles.buttonText}>Shop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContainer: {
    height: '50%', // Top half of the screen
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
    top: height / 8 - 25, // Position in the top half of the game container
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
  },
  navigationScreen: {
    height: '50%', // Bottom half of the screen
    width: '100%',
    backgroundColor: '#222222', // Dark gray background for navigation
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateLabel: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
  },
  navButton: {
    backgroundColor: '#444',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#0066cc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
