import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { useGameContext } from '../../context/GameContext';
import Player from '../../entities/Player';

// Get the screen dimensions
const { width, height } = Dimensions.get('window');

// Game constants
const GROUND_HEIGHT = 60;
const PLAYER_SIZE = 50;
const GROUND_SPEED = 2000; // Time in ms for ground to move across screen

// Background element type
interface BackgroundElement {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

// Props for BaseScene
export interface BaseSceneProps {
  children?: React.ReactNode;
  playerPosition?: { x: number };
  onAnimationComplete?: () => void;
}

export default function BaseScene({
  children,
  playerPosition,
  onAnimationComplete
}: BaseSceneProps) {
  // Create player instance
  const [player] = useState<Player>(new Player());

  // Game state
  const [backgroundElements, setBackgroundElements] = useState<BackgroundElement[]>([]);

  // Animation values
  const groundPosition = useRef(new Animated.Value(0)).current;
  const playerXPosition = useRef(new Animated.Value(width / 2 - PLAYER_SIZE / 2)).current;

  // Get game context
  const { setPlayerPosition } = useGameContext();

  // Initialize game
  useEffect(() => {
    // Create initial background elements (white cloud-like circles in the sky)
    const initialElements = Array.from({ length: 10 }, (_, i) => createBackgroundElement(i));
    setBackgroundElements(initialElements);

    // Start animations
    startGroundAnimation();
  }, []);

  // Update player position when playerPosition prop changes
  useEffect(() => {
    // Only animate if playerPosition is explicitly set (not null or undefined)
    // This prevents animation on initial render
    if (playerPosition && typeof playerPosition.x === 'number') {
      // Animate to the new position
      Animated.timing(playerXPosition, {
        toValue: playerPosition.x,
        duration: 1000, // 1 second animation
        easing: Easing.easeInOut,
        useNativeDriver: true
      }).start(() => {
        // After animation completes, notify parent
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });

      // We're not updating the context here anymore to avoid infinite loops
    }
  }, [playerPosition]);

  // Set initial player position in context only once on mount
  useEffect(() => {
    // Set initial player position in context
    setPlayerPosition({ x: width / 2 - PLAYER_SIZE / 2, y: GROUND_HEIGHT });
  }, []);

  // Game loop for moving background elements
  useEffect(() => {
    const gameLoop = setInterval(() => {
      // Move background elements
      setBackgroundElements(prevElements =>
        prevElements
          .map(element => ({
            ...element,
            x: element.x - element.speed
          }))
          .filter(element => element.x > -element.size) // Remove elements that are off-screen
      );

      // Add new background elements as needed
      if (backgroundElements.length < 10) {
        setBackgroundElements(prev => [
          ...prev,
          createBackgroundElement(prev.length > 0 ? Math.max(...prev.map(e => e.id)) + 1 : 0)
        ]);
      }
    }, 16); // ~60fps

    return () => clearInterval(gameLoop);
  }, [backgroundElements]);

  // Create a new background element
  const createBackgroundElement = (id: number): BackgroundElement => {
    const size = Math.random() * 20 + 10; // Random size between 10 and 30
    const speed = Math.random() * 2 + 1; // Random speed between 1 and 3

    // Calculate a reasonable height for the component (half of screen height minus ground)
    const componentHeight = height / 2 - GROUND_HEIGHT;

    return {
      id,
      x: Math.random() * width + width, // Start off-screen to the right
      y: Math.random() * (componentHeight - size), // Random y position within available height
      size,
      speed
    };
  };

  // Start ground animation
  const startGroundAnimation = () => {
    Animated.loop(
      Animated.timing(groundPosition, {
        toValue: -width,
        duration: GROUND_SPEED,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  };

  return (
    <View style={styles.container}>
      {/* Sky background */}
      <View style={styles.sky}>
        {/* Background elements (clouds, etc.) */}
        {backgroundElements.map(element => (
          <View
            key={element.id}
            style={[
              styles.backgroundCloudElement,
              {
                width: element.size,
                height: element.size,
                left: element.x,
                top: element.y,
                opacity: element.size / 30 * 0.5 // Smaller elements are more transparent
              }
            ]}
          />
        ))}
      </View>

      {/* Player character (animated) */}
      <Animated.View
        style={[
          styles.player,
          {
            backgroundColor: player.getColor(),
            bottom: GROUND_HEIGHT,
            transform: [{ translateX: playerXPosition }]
          }
        ]}
      />

      {/* Children components (buttons, UI elements, etc.) */}
      {children}

      {/* Animated ground */}
      <View style={styles.ground}>
        {/* Simple animated ground with stripes */}
        <Animated.View
          style={[
            styles.groundStripes,
            {
              transform: [{ translateX: groundPosition }]
            }
          ]}
        >
          {/* Create stripes using Views instead of CSS */}
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: i * 100,
                width: 50,
                height: GROUND_HEIGHT,
                backgroundColor: '#A0522D', // Slightly lighter brown
              }}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%', // Ensure container takes full width
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: GROUND_HEIGHT,
    backgroundColor: '#87CEEB', // Sky blue
  },
  ground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: GROUND_HEIGHT,
    backgroundColor: '#8B4513', // Brown
    overflow: 'hidden',
  },
  groundStripes: {
    position: 'absolute',
    width: width * 2, // Double the screen width for seamless scrolling
    height: GROUND_HEIGHT,
    bottom: 0,
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    // Position is set dynamically
  },
  backgroundCloudElement: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 50,
    // Position and size are set dynamically
  }
});
