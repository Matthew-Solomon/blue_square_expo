import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PlatformerScene from './PlatformerScene';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define game states
enum GameState {
  HOME = 'Home',
  LEVEL = 'Level',
  BATTLE = 'Battle',
  INVENTORY = 'Inventory',
  SHOP = 'Shop',
}

/**
 * SplitScreenLayout component that divides the screen into two parts:
 * - Top half: Game screen (shows different content based on state)
 * - Bottom half: Navigation buttons
 */
export default function SplitScreenLayout() {
  // State management
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);

  // Handle level start
  const handleLevelStart = () => {
    setGameState(GameState.LEVEL);
  };

  // Render the appropriate screen based on game state
  const renderGameScreen = () => {
    switch (gameState) {
      case GameState.HOME:
        return <PlatformerScene onLevelStart={handleLevelStart} />;
      case GameState.LEVEL:
        // For now, the level looks the same as the home screen but with the player on the left
        return <PlatformerScene isLevel={true} />;
      case GameState.BATTLE:
        return <Text style={styles.placeholderText}>Battle Screen (Coming Soon)</Text>;
      case GameState.INVENTORY:
        return <Text style={styles.placeholderText}>Inventory Screen (Coming Soon)</Text>;
      case GameState.SHOP:
        return <Text style={styles.placeholderText}>Shop Screen (Coming Soon)</Text>;
      default:
        return <PlatformerScene onLevelStart={handleLevelStart} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top half - Game Screen */}
      <View style={styles.gameScreen}>
        {renderGameScreen()}
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
            style={[styles.navButton, gameState === GameState.BATTLE ? styles.activeButton : null]}
            onPress={() => setGameState(GameState.BATTLE)}
          >
            <Text style={styles.buttonText}>Battle</Text>
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
    width: '100%',
  },
  gameScreen: {
    height: '50%', // Take up top half of the screen
    width: '100%',
    backgroundColor: '#F5FCFF', // Light background for game screen
  },
  navigationScreen: {
    height: '50%', // Take up bottom half of the screen
    width: '100%',
    backgroundColor: '#222222', // Dark gray background for navigation
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#333',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 40,
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
