import { SafeAreaView, StyleSheet } from 'react-native';
import { GameProvider, GameState, useGameContext } from '../../src/context/GameContext';
import HomeScene from '../../src/scenes/HomeScene';
import LevelScene from '../../src/scenes/LevelScene';

// Main content component that uses the game context
function GameContent() {
  const { gameState } = useGameContext();

  // Render the appropriate screen based on game state
  switch (gameState) {
    case GameState.HOME:
      return <HomeScene />;
    case GameState.LEVEL:
      return <LevelScene />;
    default:
      return <HomeScene />;
  }
}

export default function GameScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <GameProvider>
        <GameContent />
      </GameProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
