import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import Player from '../entities/Player';

// Get the screen dimensions
const { width, height } = Dimensions.get('window');

// Game constants
const GROUND_HEIGHT = 60;
const PLAYER_SIZE = 50;
const BACKGROUND_SPEED = 2;

// Background element type
interface BackgroundElement {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export default function PlatformerScene() {
  // Create player instance
  const [player] = useState<Player>(new Player());

  // Game state
  const [backgroundElements, setBackgroundElements] = useState<BackgroundElement[]>([]);

  // Animation values
  const groundPosition = useRef(new Animated.Value(0)).current;

  // Player position (fixed at left third)
  const playerX = width / 3 - PLAYER_SIZE / 2;

  // Initialize game
  useEffect(() => {
    // Create initial background elements (white cloud-like circles in the sky)
    const initialElements = Array.from({ length: 10 }, (_, i) => createBackgroundElement(i));
    setBackgroundElements(initialElements);

    // Start ground animation
    animateGround();
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

  // Animate the ground to create scrolling effect
  const animateGround = () => {
    groundPosition.setValue(0);
    Animated.timing(groundPosition, {
        toValue: -width,
        duration: 5000,
        useNativeDriver: true
    }).start(() => {
      animateGround(); // Loop the animation
    });
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
              styles.backgroundElement,
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

      {/* Player character */}
      <View
        style={[
          styles.player,
          {
            backgroundColor: player.getColor(),
            bottom: GROUND_HEIGHT,
            left: playerX
          }
        ]}
      />

      {/* Ground with scrolling texture */}
      <View style={styles.ground}>
        <Animated.View
          style={[
            styles.groundTextureContainer,
            {
              transform: [{ translateX: groundPosition }]
            }
          ]}
        >
          {/* Ground texture lines */}
          {Array.from({ length: 20 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.groundTextureLine,
                {
                  left: index * (width / 10),
                }
              ]}
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
  },
  groundTextureContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: GROUND_HEIGHT,
    width: width * 2, // Double width for seamless scrolling
  },
  groundTextureLine: {
    position: 'absolute',
    width: 5,
    height: 5,
    backgroundColor: '#A0522D', // Slightly lighter brown
    bottom: Math.random() * GROUND_HEIGHT,
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    // Position is set dynamically
  },
  backgroundElement: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 50,
    // Position and size are set dynamically
  }
});
