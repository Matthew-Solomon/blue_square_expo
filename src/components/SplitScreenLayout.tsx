import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GameState, useGameContext } from '../context/GameContext';
import HomeScene from '../scenes/HomeScene';
import LevelScene from '../scenes/LevelScene';
import PlayerStatsDisplay from './PlayerStatsDisplay';

export default function SplitScreenLayout() {
  const { gameState, player } = useGameContext();

  // Render the appropriate scene based on game state
  const renderTopHalf = () => {
    switch (gameState) {
      case GameState.HOME:
        return <HomeScene />;
      case GameState.LEVEL:
      case GameState.INVENTORY:
      case GameState.SHOP:
        // All these states use the LevelScene with different bottom content
        return <LevelScene />;
      default:
        return <HomeScene />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        {renderTopHalf()}
      </View>
      <View style={styles.bottomHalf}>
        {gameState === GameState.LEVEL && player && (
          <PlayerStatsDisplay player={player} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topHalf: {
    height: '50%',
  },
  bottomHalf: {
    height: '50%',
    backgroundColor: '#222',
    padding: 20,
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  stateText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  infoText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
});
