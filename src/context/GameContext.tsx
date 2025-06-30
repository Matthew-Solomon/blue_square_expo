import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define game states
export enum GameState {
  HOME = 'Home',
  LEVEL = 'Level',
  INVENTORY = 'Inventory',
  SHOP = 'Shop',
}

// Define the context type
interface GameContextType {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  playerPosition: { x: number, y: number };
  setPlayerPosition: (position: { x: number, y: number }) => void;
}

// Create the context with a default value
const GameContext = createContext<GameContextType | undefined>(undefined);

// Props for the GameProvider component
interface GameProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app and provides the game state
export function GameProvider({ children }: GameProviderProps) {
  // State for the current game state
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);

  // State for the player's position
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });

  // Value object that will be provided to consumers
  const value = {
    gameState,
    setGameState,
    playerPosition,
    setPlayerPosition,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Custom hook to use the game context
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
