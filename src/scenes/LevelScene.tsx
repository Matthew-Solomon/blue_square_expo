import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BaseScene from '../components/game/BaseScene';
import PlayerStatsDisplay from '../components/PlayerStatsDisplay';
import { GameState, useGameContext } from '../context/GameContext';
import Player from '../entities/Player';

// Get the screen dimensions
const { width } = Dimensions.get('window');

// Game constants
const PLAYER_SIZE = 50;

export default function LevelScene() {
  // Create player instance with default values from Player.ts
  const [player] = useState(() => new Player());

  // Get game context
  const { gameState, setGameState } = useGameContext();

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

    // Gain experience periodically once level has started
    const gameInterval = setInterval(() => {
      if (levelStarted) {
        // Gain experience points
        player.gainExperience(1);
      }
    }, 1000);

    return () => {
      clearInterval(gameInterval);
      // Clean up any other resources
    };
  }, [levelStarted, player]);

  return (
    <View style={styles.container}>
      {/* Top half - Game Scene */}
      <View style={styles.gameContainer}>
        <BaseScene playerPosition={playerPosition}>
          {/* Level UI elements */}
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>Level 1</Text>
          </View>
        </BaseScene>
      </View>

      {/* Bottom half - Player Stats with Navigation */}
      <View style={styles.statsContainer}>
        <View style={styles.statsContent}>
          <PlayerStatsDisplay player={player} />
        </View>

        {/* Navigation buttons at the bottom */}
        <View style={styles.navigationBar}>
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
  },
  statsContainer: {
    height: '50%', // Bottom half of the screen
    display: 'flex',
    flexDirection: 'column',
  },
  statsContent: {
    flex: 1,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#111',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  activeButton: {
    backgroundColor: '#0066cc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
  }
});
